/**
 * Users Tab Component with CRUD operations
 * Displays and manages users for admin
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Pencil, Trash2, UserCog } from 'lucide-react';
import type { IUser } from '../../types';

interface UsersTabProps {
  users: IUser[];
  userSearch: string;
  onSearchChange: (value: string) => void;
  loading: boolean;
}

export function UsersTab({ users, userSearch, onSearchChange, loading }: UsersTabProps) {
  const { t } = useTranslation();
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const handleEdit = (user: IUser) => {
    // TODO: Implement edit modal
    console.log('Edit user:', user);
    alert(`${t('admin.users.editFeatureMessage')}\nUser: ${user.full_name}`);
  };

  const handleDelete = (user: IUser) => {
    // TODO: Implement delete confirmation
    const confirmed = window.confirm(`${t('common.confirmDelete', 'Bạn có chắc muốn xóa')}: ${user.full_name}?`);
    if (confirmed) {
      console.log('Delete user:', user.id);
      alert(t('common.notImplemented', 'Chức năng này sẽ được implement sau'));
    }
  };

  const handleToggleRole = (user: IUser) => {
    // TODO: Implement role toggle
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    const confirmed = window.confirm(`${t('common.confirmChange', 'Đổi vai trò')} ${user.full_name} thành ${newRole}?`);
    if (confirmed) {
      console.log('Toggle role:', user.id, newRole);
      alert(t('common.notImplemented', 'Chức năng này sẽ được implement sau'));
    }
  };

  const handleCreate = () => {
    // TODO: Implement create modal
    alert(t('admin.users.createFeatureMessage'));
  };

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
            placeholder={t('admin.users.searchPlaceholder')}
            value={userSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>{t('admin.users.addUser')}</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {t('admin.users.user')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {t('admin.users.role', 'Vai trò')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {t('admin.users.createdDate')}
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                {t('admin.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                  #{user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold mr-3">
                      {user.full_name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.full_name || 'N/A'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleRole(user)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors hover:opacity-80 ${
                      user.role === 'ADMIN'
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    }`}
                    title={t('admin.users.clickToChangeRole')}
                  >
                    {user.role}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {(user as any).createdAt || user.created_at
                    ? new Date((user as any).createdAt || user.created_at).toLocaleDateString('vi-VN')
                    : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title={t('admin.edit')}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title={t('common.delete', 'Xóa')}
                      disabled={user.role === 'ADMIN'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            {t('admin.users.noUsers')}
          </div>
        )}
      </div>
    </div>
  );
}
