/**
 * Test Selector Component
 * Dropdown to select a test for detailed statistics
 */

import { FileText, ChevronDown } from 'lucide-react';
import type { ITest } from '../../types';

interface TestSelectorProps {
  tests: ITest[];
  selectedTestId: number | null;
  onSelectTest: (testId: number) => void;
  loading?: boolean;
}

export function TestSelector({ tests, selectedTestId, onSelectTest, loading }: TestSelectorProps) {
  const selectedTest = tests.find(t => t.id === selectedTestId);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50/50 dark:from-slate-900 dark:to-slate-800/50 rounded-xl p-3.5 shadow-sm border border-gray-200/80 dark:border-slate-700/80">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
          <FileText className="w-4 h-4" />
          <span className="text-sm font-bold">Chọn đề thi</span>
        </div>
        
        <div className="relative flex-1 max-w-sm">
          <select
            value={selectedTestId || ''}
            onChange={(e) => onSelectTest(Number(e.target.value))}
            disabled={loading || tests.length === 0}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none pr-9 disabled:opacity-50 disabled:cursor-not-allowed transition-shadow font-medium"
          >
            <option value="">-- Chọn đề thi --</option>
            {tests.map((test) => (
              <option key={test.id} value={test.id}>
                {test.title} ({test.level} - {test.year}/{test.month})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        
        {selectedTest && (
          <div className="text-xs text-gray-600 dark:text-gray-400">
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedTest.title}</span>
          </div>
        )}
      </div>
    </div>
  );
}
