/**
 * Date Range Filter Component
 * Reusable component for selecting date ranges
 */

import { useTranslation } from 'react-i18next';
import { Calendar } from 'lucide-react';

interface DateRangeFilterProps {
  fromDate: string;
  toDate: string;
  onFromDateChange: (date: string) => void;
  onToDateChange: (date: string) => void;
  onApply: () => void;
  loading?: boolean;
}

export function DateRangeFilter({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onApply,
  loading,
}: DateRangeFilterProps) {
  const { t } = useTranslation();
  return (
    <div className="bg-gradient-to-br from-white to-gray-50/50 dark:from-slate-900 dark:to-slate-800/50 rounded-xl p-3.5 shadow-sm border border-gray-200/80 dark:border-slate-700/80">
      <div className="flex items-center gap-3 flex-wrap 2xl:flex-nowrap">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 flex-shrink-0">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-bold whitespace-nowrap">{t('common.dateRange', 'Khoảng thời gian')}</span>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">{t('common.from', 'Từ')}</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => onFromDateChange(e.target.value)}
            className="w-36 px-2.5 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
            disabled={loading}
          />
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">{t('common.to', 'Đến')}</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => onToDateChange(e.target.value)}
            className="w-36 px-2.5 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
            disabled={loading}
          />
        </div>

        <button
          onClick={onApply}
          disabled={loading}
          className="px-3.5 py-1.5 text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 whitespace-nowrap"
        >
          {loading ? t('admin.loading') : t('admin.apply')}
        </button>
      </div>
    </div>
  );
}
