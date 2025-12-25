/**
 * Test Funnel Chart Component
 * Shows stacked bar chart for each test: Total attempts vs Passed
 * With filter to sort by total attempts or pass rate
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Award, ArrowUpDown } from 'lucide-react';
import type { ITestFunnelData } from '../../types';

interface TestFunnelChartProps {
  data: ITestFunnelData;
}

type SortMode = 'attempts' | 'passRate';

export function TestFunnelChart({ data }: TestFunnelChartProps) {
  const { t } = useTranslation();
  const [sortMode, setSortMode] = useState<SortMode>('attempts');
  // Calculate totals
  const totals = {
    started: data.items.reduce((sum, item) => sum + item.started, 0),
    completed: data.items.reduce((sum, item) => sum + item.completed, 0),
    passed: data.items.reduce((sum, item) => sum + item.passed, 0),
  };

  const completionRate = totals.started > 0 ? (totals.completed / totals.started) * 100 : 0;
  const passRate = totals.completed > 0 ? (totals.passed / totals.completed) * 100 : 0;

  // Sort data based on selected mode
  const sortedItems = [...data.items].sort((a, b) => {
    if (sortMode === 'attempts') {
      return b.completed - a.completed; // Sort by total attempts (descending)
    } else {
      return b.passRate - a.passRate; // Sort by pass rate (descending)
    }
  });

  // Find max value for scaling
  const maxValue = Math.max(...sortedItems.map(i => i.completed), 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header with Filter */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white">
                {t('admin.analytics.funnelAnalysis')}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {new Date(data.from).toLocaleDateString('vi-VN')} - {new Date(data.to).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
          
          {/* Sort Filter */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{t('common.sortBy', 'Sắp xếp')}:</span>
            <div className="flex gap-1">
              <button
                onClick={() => setSortMode('attempts')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  sortMode === 'attempts'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {t('admin.analytics.sortByAttempts')}
              </button>
              <button
                onClick={() => setSortMode('passRate')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  sortMode === 'passRate'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {t('admin.analytics.sortByPassRate')}
              </button>
            </div>
          </div>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl p-3 border border-blue-200/50 dark:border-blue-700/50">
            <div className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-1">Bài làm</div>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{totals.completed}</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-900/10 rounded-xl p-3 border border-emerald-200/50 dark:border-emerald-700/50">
            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">Đạt</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{totals.passed}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-900/10 rounded-xl p-3 border border-purple-200/50 dark:border-purple-700/50">
            <div className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider mb-1">Tỉ lệ</div>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{passRate.toFixed(0)}%</div>
          </div>
        </div>
      </div>

      {/* Stacked Bar Chart */}
      <div className="p-5">
        {sortedItems.length > 0 ? (
          <div className="space-y-4">
            {sortedItems.map((item) => {
              const completedPercent = (item.completed / maxValue) * 100;
              const passedPercent = item.completed > 0 ? (item.passed / item.completed) * 100 : 0;
              const failedPercent = 100 - passedPercent;

              return (
                <div key={item.testId} className="space-y-2">
                  {/* Test Info */}
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate max-w-md" title={item.title}>
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs flex-shrink-0">
                      <span className="font-black text-blue-600 dark:text-blue-400">
                        {item.completed} làm
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="font-black text-emerald-600 dark:text-emerald-400">
                        {item.passed} đạt
                      </span>
                      <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full font-black">
                        {item.passRate.toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  {/* Stacked Bar with full width background */}
                  <div className="relative">
                    {/* Background bar - represents total capacity */}
                    <div className="h-14 bg-gray-100 dark:bg-gray-700/30 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      {/* Actual data bar - scaled to maxValue */}
                      <div 
                        className="relative h-full flex"
                        style={{ width: `${completedPercent}%` }}
                      >
                        {/* Passed portion (green) */}
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center relative group"
                          style={{ width: `${passedPercent}%` }}
                        >
                          {passedPercent > 15 && (
                            <span className="text-white text-xs font-black flex items-center gap-1">
                              <Award className="w-3.5 h-3.5" />
                              {item.passed}
                            </span>
                          )}
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <div className="bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded whitespace-nowrap">
                              Đạt: {item.passed} ({passedPercent.toFixed(1)}%)
                            </div>
                          </div>
                        </div>
                        
                        {/* Failed portion (red/orange) */}
                        <div 
                          className="bg-gradient-to-r from-red-400 to-orange-500 flex items-center justify-center relative group"
                          style={{ width: `${failedPercent}%` }}
                        >
                          {failedPercent > 15 && (
                            <span className="text-white text-xs font-black">
                              {item.completed - item.passed}
                            </span>
                          )}
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <div className="bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded whitespace-nowrap">
                              Chưa đạt: {item.completed - item.passed} ({failedPercent.toFixed(1)}%)
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center">
            <TrendingUp className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">Chưa có dữ liệu trong khoảng thời gian này</p>
          </div>
        )}

        {/* Legend */}
        {sortedItems.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
                <span className="text-gray-700 dark:text-gray-300 font-semibold">Bài đạt</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-r from-red-400 to-orange-500"></div>
                <span className="text-gray-700 dark:text-gray-300 font-semibold">Bài chưa đạt</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/30"></div>
                <span className="text-gray-700 dark:text-gray-300 font-semibold">Phạm vi tối đa</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
