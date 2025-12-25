/**
 * Admin Page - Redesigned
 * Modern admin dashboard with overview, user management, test management, and analytics
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, FileText, TrendingUp, LayoutDashboard } from 'lucide-react';
import { dataService } from '../services';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AdminLayout } from '../layouts/AdminLayout';
import { UsersTab } from '../components/admin/UsersTab';
import { TestsTab } from '../components/admin/TestsTab';
import { AnalyticsTab } from '../components/admin/AnalyticsTab';
import { AdminOverviewCards, type IAdminOverview } from '../components/admin/AdminOverviewCards';
import { API_BASE_URL } from '../services/config';
import { useAuthStore } from '../store/useAuthStore';
import type { IUser, ITest, ILoginHeatmapData, ITestFunnelData, ISkillAnalysisData } from '../types';
import type { ITestStatistics } from '../components/admin';

type TabType = 'overview' | 'analytics' | 'users' | 'tests';

export function AdminPage() {
  const { token } = useAuthStore();
  const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(false);

  // Overview data
  const [overview, setOverview] = useState<IAdminOverview>({
    totalUsers: 0,
    activeUsers: 0,
    totalTests: 0,
    activeTests: 0,
    totalAttempts: 0,
    completedAttempts: 0,
    averageScore: 0,
    passRate: 0,
  });

  // Users
  const [users, setUsers] = useState<IUser[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Tests
  const [tests, setTests] = useState<ITest[]>([]);

  // Analytics
  const [heatmapData, setHeatmapData] = useState<ILoginHeatmapData>({
    columns: [],
    rows: [],
  });
  const [funnelData, setFunnelData] = useState<ITestFunnelData>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
    items: [],
  });
  const [testStatistics, setTestStatistics] = useState<ITestStatistics | null>(null);
  const [skillAnalysisData, setSkillAnalysisData] = useState<ISkillAnalysisData | null>(null);
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(userSearch);
    }, 500);
    return () => clearTimeout(timer);
  }, [userSearch]);

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchOverview();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'tests') {
      fetchTests();
    } else if (activeTab === 'analytics') {
      fetchAnalytics();
      if (!tests.length) fetchTests(); // Load tests for test selector
    }
  }, [activeTab, debouncedSearch]);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const [allUsers, allTests, funnel] = await Promise.all([
        dataService.getAllUsers(),
        dataService.getTests({ skill: 'all' }),
        dataService.getTestFunnel(
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          new Date().toISOString().split('T')[0]
        ),
      ]);

      // Calculate overview stats
      const totalUsers = allUsers.length;
      const activeUsers = allUsers.filter(u => (u as any).is_active !== false).length;
      const totalTests = allTests.length;
      const activeTests = allTests.filter(t => t.is_active).length;
      
      const totalAttempts = funnel.items.reduce((sum, item) => sum + item.started, 0);
      const completedAttempts = funnel.items.reduce((sum, item) => sum + item.completed, 0);
      const passedAttempts = funnel.items.reduce((sum, item) => sum + item.passed, 0);
      
      const passRate = completedAttempts > 0 ? (passedAttempts / completedAttempts) * 100 : 0;
      
      // TODO: Calculate average score from test statistics - endpoint not available
      const averageScore = 0;

      setOverview({
        totalUsers,
        activeUsers,
        totalTests,
        activeTests,
        totalAttempts,
        completedAttempts,
        averageScore,
        passRate,
      });
    } catch (error) {
      console.error('Failed to fetch overview:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await dataService.getAllUsers(debouncedSearch || undefined);
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTests = async () => {
    setLoading(true);
    try {
      const data = await dataService.getTests({ skill: 'all' });
      setTests(data);
    } catch (error) {
      console.error('Failed to fetch tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const authToken = token || localStorage.getItem('token');
      if (!authToken) throw new Error('No token found');

      const [heatmap, funnel, skillAnalysis] = await Promise.all([
        dataService.getLoginHeatmap(),
        dataService.getTestFunnel(funnelData.from, funnelData.to),
        fetch(`${API_BASE_URL}/admin/analytics/content-quality/weak-skill-pie?from=${funnelData.from}&to=${funnelData.to}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }).then(res => res.ok ? res.json() : null),
      ]);

      setHeatmapData(heatmap);
      setFunnelData(funnel);
      setSkillAnalysisData(skillAnalysis);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = async (from: string, to: string) => {
    setLoading(true);
    try {
      const authToken = token || localStorage.getItem('token');
      if (!authToken) throw new Error('No token found');

      const [funnel, skillAnalysis] = await Promise.all([
        dataService.getTestFunnel(from, to),
        fetch(`${API_BASE_URL}/admin/analytics/content-quality/weak-skill-pie?from=${from}&to=${to}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }).then(res => res.ok ? res.json() : null),
      ]);

      setFunnelData(funnel);
      setSkillAnalysisData(skillAnalysis);
    } catch (error) {
      console.error('Failed to fetch funnel data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestSelect = async (testId: number) => {
    setSelectedTestId(testId);
    setLoading(true);
    try {
      const authToken = token || localStorage.getItem('token');
      if (!authToken) throw new Error('No token found');

      const url = `${API_BASE_URL}/admin/analytics/test/${testId}/statistics`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      setTestStatistics(data);
    } catch (error) {
      console.error(`Failed to fetch test statistics for test ${testId}:`, error);
      setTestStatistics(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      {/* Modern Tab Navigation */}
      <div className="mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-1" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`group inline-flex items-center gap-2 px-6 py-4 font-semibold text-sm border-b-2 transition-all ${
                activeTab === 'overview'
                  ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>{t('admin.tabs.overview')}</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`group inline-flex items-center gap-2 px-6 py-4 font-semibold text-sm border-b-2 transition-all ${
                activeTab === 'analytics'
                  ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span>{t('admin.tabs.analytics')}</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`group inline-flex items-center gap-2 px-6 py-4 font-semibold text-sm border-b-2 transition-all ${
                activeTab === 'users'
                  ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>{t('admin.tabs.users')}</span>
            </button>

            <button
              onClick={() => setActiveTab('tests')}
              className={`group inline-flex items-center gap-2 px-6 py-4 font-semibold text-sm border-b-2 transition-all ${
                activeTab === 'tests'
                  ? 'border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>{t('admin.tabs.tests')}</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      {loading && activeTab !== 'analytics' ? (
        <LoadingSpinner text={t('admin.loading')} />
      ) : (
        <>
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <AdminOverviewCards data={overview} loading={loading} />
            </div>
          )}

          {activeTab === 'analytics' && (
            <AnalyticsTab 
              heatmapData={heatmapData}
              funnelData={funnelData}
              tests={tests}
              testStatistics={testStatistics}
              skillAnalysisData={skillAnalysisData}
              selectedTestId={selectedTestId}
              loading={loading}
              onDateRangeChange={handleDateRangeChange}
              onTestSelect={handleTestSelect}
            />
          )}

          {activeTab === 'users' && (
            <UsersTab 
              users={users} 
              userSearch={userSearch}
              onSearchChange={setUserSearch}
              loading={loading}
            />
          )}

          {activeTab === 'tests' && (
            <TestsTab tests={tests} loading={loading} />
          )}
        </>
      )}
    </AdminLayout>
  );
}
