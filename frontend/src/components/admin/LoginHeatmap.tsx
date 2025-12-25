/**
 * Login Heatmap Component
 * Displays a 12x7 heatmap showing login activity by time slot and day of week
 */

import { useMemo } from 'react';
import type { ILoginHeatmapData } from '../../types';

interface LoginHeatmapProps {
  data: ILoginHeatmapData;
}

export function LoginHeatmap({ data }: LoginHeatmapProps) {
  // Calculate max value for color scaling
  const maxValue = useMemo(() => {
    const allValues = data.rows.flatMap((row) => row.values);
    return Math.max(...allValues, 1); // Avoid division by 0
  }, [data]);

  // Get color intensity based on value
  const getColorClass = (value: number): string => {
    if (value === 0) return 'bg-gray-100 dark:bg-gray-800';
    const intensity = value / maxValue;
    if (intensity >= 0.75) return 'bg-emerald-600 dark:bg-emerald-500';
    if (intensity >= 0.5) return 'bg-emerald-500 dark:bg-emerald-600';
    if (intensity >= 0.25) return 'bg-emerald-400 dark:bg-emerald-700';
    return 'bg-emerald-200 dark:bg-emerald-800';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Biểu đồ nhiệt đăng nhập
      </h3>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Header with time slots */}
          <div className="flex mb-2">
            <div className="w-24 flex-shrink-0" /> {/* Space for day labels */}
            <div className="flex-1 grid grid-cols-12 gap-1">
              {data.columns.map((timeSlot) => (
                <div
                  key={timeSlot}
                  className="text-xs text-center text-gray-600 dark:text-gray-400 font-medium"
                >
                  {timeSlot}
                </div>
              ))}
            </div>
          </div>

          {/* Heatmap rows */}
          <div className="space-y-1">
            {data.rows.map((row) => (
              <div key={row.weekdayId} className="flex items-center">
                {/* Day label */}
                <div className="w-24 flex-shrink-0 pr-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {row.weekdayName}
                  </span>
                </div>

                {/* Time slot cells */}
                <div className="flex-1 grid grid-cols-12 gap-1">
                  {row.values.map((value, colIndex) => (
                    <div
                      key={colIndex}
                      className={`aspect-square rounded transition-all duration-200 hover:ring-2 hover:ring-emerald-500 hover:ring-offset-2 dark:hover:ring-offset-gray-800 cursor-pointer group relative ${getColorClass(
                        value
                      )}`}
                      title={`${row.weekdayName} ${data.columns[colIndex]}: ${value} đăng nhập`}
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                        <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                          <div className="font-semibold">{row.weekdayName}</div>
                          <div>{data.columns[colIndex]}</div>
                          <div className="text-emerald-400">{value} đăng nhập</div>
                          {/* Arrow */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                            <div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-2 mt-6 text-sm text-gray-600 dark:text-gray-400">
            <span>Ít</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800"></div>
              <div className="w-4 h-4 rounded bg-emerald-200 dark:bg-emerald-800"></div>
              <div className="w-4 h-4 rounded bg-emerald-400 dark:bg-emerald-700"></div>
              <div className="w-4 h-4 rounded bg-emerald-500 dark:bg-emerald-600"></div>
              <div className="w-4 h-4 rounded bg-emerald-600 dark:bg-emerald-500"></div>
            </div>
            <span>Nhiều</span>
          </div>
        </div>
      </div>
    </div>
  );
}
