/**
 * Tests Tab Component with CRUD operations
 * Displays and manages tests for admin
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, Power, PowerOff, Search } from 'lucide-react';
import type { ITest } from '../../types';

interface TestsTabProps {
  tests: ITest[];
  loading: boolean;
}

export function TestsTab({ tests, loading }: TestsTabProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleEdit = (test: ITest) => {
    // TODO: Implement edit modal
    console.log('Edit test:', test);
    alert(`${t('admin.tests.editFeatureMessage')}\nTest: ${test.title.replace(/<[^>]+>/g, '')}`);
  };

  const handleDelete = (test: ITest) => {
    // TODO: Implement delete confirmation
    const confirmed = window.confirm(
      `${t('common.confirmDelete')}: ${test.title.replace(/<[^>]+>/g, '')}?`
    );
    if (confirmed) {
      console.log('Delete test:', test.id);
      alert(t('common.notImplemented'));
    }
  };

  const handleToggleActive = (test: ITest) => {
    // TODO: Implement toggle active
    const action = test.is_active ? t('common.disable', 'vô hiệu hóa') : t('common.enable', 'kích hoạt');
    const confirmed = window.confirm(
      `${t('common.confirm')}: ${action} test:\n${test.title.replace(/<[^>]+>/g, '')}?`
    );
    if (confirmed) {
      console.log('Toggle active:', test.id, !test.is_active);
      alert(t('common.notImplemented'));
    }
  };

  const handleCreate = () => {
    // TODO: Implement create modal
    alert(t('admin.tests.createFeatureMessage'));
  };

  const filteredTests = tests.filter((test) => {
    const searchLower = searchQuery.toLowerCase();
    const title = test.title.replace(/<[^>]+>/g, '').toLowerCase();
    return (
      title.includes(searchLower) ||
      test.level.toLowerCase().includes(searchLower) ||
      test.year.toString().includes(searchLower)
    );
  });

  if (loading) {
    return null; // Loading handled by parent
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('admin.tests.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>{t('admin.tests.addTest', 'Thêm bài test')}</span>
        </button>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTests.map((test) => (
          <div
            key={test.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <span
                className={`px-3 py-1 rounded-lg text-xs font-black text-white ${
                  test.level === 'N1'
                    ? 'bg-gradient-to-r from-red-500 to-rose-600'
                    : test.level === 'N2'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600'
                    : test.level === 'N3'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600'
                    : test.level === 'N4'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                    : 'bg-gradient-to-r from-green-400 to-teal-400'
                }`}
              >
                {test.level}
              </span>
              <button
                onClick={() => handleToggleActive(test)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors hover:opacity-80 ${
                  test.is_active
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400'
                }`}
                title={test.is_active ? t('admin.tests.clickToDeactivate') : t('admin.tests.clickToActivate')}
              >
                {test.is_active ? t('admin.tests.active') : t('admin.tests.inactive')}
              </button>
            </div>

            <h3
              className="font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 min-h-[3rem]"
              dangerouslySetInnerHTML={{ __html: test.title }}
            />

            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <span>
                {test.year}.{String(test.month).padStart(2, '0')}
              </span>
              <span>ID: {test.id}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(test)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
              >
                <Pencil className="w-4 h-4" />
                {t('admin.edit')}
              </button>
              <button
                onClick={() => handleDelete(test)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                {t('common.delete')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {tests.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {t('admin.tests.noTests')}
        </div>
      )}
    </div>
  );
}
