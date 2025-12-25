/**
 * Skill Analysis Chart Component - Pie Charts for Skills by Level
 * Displays listening, reading, vocab/grammar performance across difficulty levels
 */

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTranslation } from 'react-i18next';
import { Zap } from 'lucide-react';
import type { ISkillAnalysisData } from '../../types';

interface SkillAnalysisChartProps {
  data: ISkillAnalysisData;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function SkillAnalysisChart({ data }: SkillAnalysisChartProps) {
  const { t } = useTranslation();

  // Process data for pie charts
  const chartData = useMemo(() => {
    return data.levels.map(level => ({
      ...level,
      chartData: level.slices.map(slice => ({
        name: slice.label,
        value: slice.value,
        wrongRate: slice.wrongRate,
        total: slice.total,
        wrong: slice.wrong,
        skill: slice.skill,
      })),
    }));
  }, [data.levels]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white">{data.name}</p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            {t('admin.skills.correct', 'Tỉ lệ đúng')}: {data.value.toFixed(2)}%
          </p>
          <p className="text-sm text-red-600 dark:text-red-400">
            {t('admin.skills.wrong', 'Tỉ lệ sai')}: {(data.wrongRate * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('admin.skills.answers', 'Câu trả lời')}: {data.wrong}/{data.total}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            {t('admin.analytics.skillAnalysis', 'Phân tích kỹ năng')}
          </h3>
        </div>
      </div>

      {/* Pie Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {chartData.map(levelData => (
          <div key={levelData.level} className="flex flex-col items-center space-y-4">
            {/* Level Title */}
            <div className="text-center">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                {t(`admin.levels.${levelData.level.toLowerCase()}`, levelData.level)}
              </h4>
            </div>

            {/* Pie Chart */}
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={levelData.chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value.toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {levelData.chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend with Stats */}
            <div className="w-full space-y-2">
              {levelData.slices.map((slice, index) => (
                <div key={slice.skill} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-gray-700 dark:text-gray-300">{slice.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      {slice.value.toFixed(1)}%
                    </span>
                    <span className="text-red-600 dark:text-red-400 text-[10px]">
                      {t('admin.skills.wrongRate', 'Sai')}: {(slice.wrongRate * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
