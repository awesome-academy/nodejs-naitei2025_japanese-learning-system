/**
 * Analytics Tab Component - Redesigned with Tabs
 * Easy navigation with tabs instead of scrolling
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, TrendingUp, BarChart3, Zap } from 'lucide-react';
import { LoginHeatmap } from './LoginHeatmap';
import { TestFunnelChart } from './TestFunnelChart';
import { TestStatisticsChart } from './TestStatisticsChart';
import { SkillAnalysisChart } from './SkillAnalysisChart';
import { DateRangeFilter } from './DateRangeFilter';
import { TestSelector } from './TestSelector';
import type { ILoginHeatmapData, ITestFunnelData, ITest, ISkillAnalysisData, ITestStatistics } from '../../types';

type ChartTab = 'heatmap' | 'funnel' | 'statistics' | 'skills';

interface AnalyticsTabProps {
  heatmapData: ILoginHeatmapData;
  funnelData: ITestFunnelData;
  tests: ITest[];
  testStatistics: ITestStatistics | null;
  skillAnalysisData?: ISkillAnalysisData | null;
  selectedTestId: number | null;
  loading: boolean;
  onDateRangeChange?: (from: string, to: string) => void;
  onTestSelect?: (testId: number) => void;
}

export function AnalyticsTab({ 
  heatmapData, 
  funnelData, 
  tests,
  testStatistics,
  skillAnalysisData,
  selectedTestId,
  loading,
  onDateRangeChange,
  onTestSelect,
}: AnalyticsTabProps) {
  const { t } = useTranslation();
  const [activeChart, setActiveChart] = useState<ChartTab>('funnel');
  const [fromDate, setFromDate] = useState(funnelData.from);
  const [toDate, setToDate] = useState(funnelData.to);

  const handleApplyDateRange = () => {
    if (onDateRangeChange) {
      onDateRangeChange(fromDate, toDate);
    }
  };

  const handleTestSelect = (testId: number) => {
    if (onTestSelect) {
      onTestSelect(testId);
    }
  };

  const selectedTest = tests.find(t => t.id === selectedTestId);

  return (
    <div className="space-y-6">
      {/* Chart Tabs Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6">
          <nav className="flex space-x-1" aria-label="Chart tabs">
            <button
              onClick={() => setActiveChart('funnel')}
              className={`group inline-flex items-center gap-2 px-5 py-3.5 font-medium text-sm border-b-2 transition-all ${
                activeChart === 'funnel'
                  ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>{t('admin.analytics.funnelAnalysis')}</span>
            </button>

            <button
              onClick={() => setActiveChart('statistics')}
              className={`group inline-flex items-center gap-2 px-5 py-3.5 font-medium text-sm border-b-2 transition-all ${
                activeChart === 'statistics'
                  ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>{t('admin.analytics.difficultyAnalysis')}</span>
            </button>

            <button
              onClick={() => setActiveChart('heatmap')}
              className={`group inline-flex items-center gap-2 px-5 py-3.5 font-medium text-sm border-b-2 transition-all ${
                activeChart === 'heatmap'
                  ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>{t('admin.analytics.loginHeatmap')}</span>
            </button>

            <button
              onClick={() => setActiveChart('skills')}
              className={`group inline-flex items-center gap-2 px-5 py-3.5 font-medium text-sm border-b-2 transition-all ${
                activeChart === 'skills'
                  ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>{t('admin.analytics.skillAnalysis', 'Phân tích kỹ năng')}</span>
            </button>
          </nav>
        </div>



        {/* Chart Content */}
        <div className="p-6">
          {activeChart === 'funnel' && <TestFunnelChart data={funnelData} />}

          {activeChart === 'statistics' && (
            <>
              <div className="mb-6">
                <TestSelector
                  tests={tests}
                  selectedTestId={selectedTestId}
                  onSelectTest={handleTestSelect}
                  loading={loading}
                />
              </div>
              {testStatistics && selectedTest ? (
                <TestStatisticsChart 
                  data={testStatistics} 
                  testTitle={selectedTest.title}
                  attemptCount={
                    funnelData.items.find(item => item.testId === selectedTest.id)?.attemptCount || 0
                  }
                />
              ) : (
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-12 text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {selectedTestId ? 'Không có dữ liệu thống kê' : 'Vui lòng chọn một đề thi'}
                  </p>
                </div>
              )}
            </>
          )}

          {activeChart === 'heatmap' && <LoginHeatmap data={heatmapData} />}

          {activeChart === 'skills' && (
            <>
              {skillAnalysisData ? (
                <SkillAnalysisChart data={skillAnalysisData} />
              ) : (
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-12 text-center">
                  <Zap className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {t('admin.noData', 'Không có dữ liệu')}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
