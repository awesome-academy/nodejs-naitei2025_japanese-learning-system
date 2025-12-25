/**
 * Admin Overview Cards Component
 * Displays key metrics and statistics overview
 */

import { useTranslation } from 'react-i18next';
import { Users, FileText, Activity, TrendingUp } from 'lucide-react';

export interface IAdminOverview {
  totalUsers: number;
  activeUsers: number;
  totalTests: number;
  activeTests: number;
  totalAttempts: number;
  completedAttempts: number;
  averageScore: number;
  passRate: number;
}

interface AdminOverviewCardsProps {
  data: IAdminOverview;
  loading?: boolean;
}

export function AdminOverviewCards({ data, loading }: AdminOverviewCardsProps) {
  const { t } = useTranslation();
  const cards = [
    {
      title: t('admin.overview.title'),
      value: data.totalUsers,
      subtitle: `${data.activeUsers} ${t('admin.overview.activeUsers')}`,
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      textColor: 'text-blue-900 dark:text-blue-300',
    },
    {
      title: t('admin.overview.tests'),
      value: data.totalTests,
      subtitle: `${data.activeTests} ${t('admin.overview.activeTests')}`,
      icon: FileText,
      color: 'emerald',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      textColor: 'text-emerald-900 dark:text-emerald-300',
    },
    {
      title: t('admin.overview.totalAttempts'),
      value: data.totalAttempts,
      subtitle: `${data.completedAttempts} ${t('admin.overview.completedAttempts')}`,
      icon: Activity,
      color: 'purple',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      textColor: 'text-purple-900 dark:text-purple-300',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`${card.bgColor} rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.title}
              </h3>
              <Icon className={`w-5 h-5 ${card.iconColor}`} />
            </div>
            
            <div className={`text-3xl font-bold ${card.textColor} mb-2`}>
              {card.value}
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-500">
              {card.subtitle}
            </div>
          </div>
        );
      })}
    </div>
  );
}
