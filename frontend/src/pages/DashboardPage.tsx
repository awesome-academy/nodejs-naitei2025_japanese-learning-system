/**
 * Dashboard Page - Shows all available tests with filters
 * Same as TestsPage functionality
 */

import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';
import { dataService } from '../services';
import { dataCache } from '../services/DataCache';
import type { ITest, JLPTLevel } from '../types';
import { TestCardList } from '../components/TestCardList';
import { FilterBar, FilterPill, FilterSelect, FilterDivider } from '../components/filters';

export function DashboardPage() {
  const { t } = useTranslation();

  const [allTests, setAllTests] = useState<ITest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel | 'ALL'>('ALL');
  const [selectedYear, setSelectedYear] = useState<number | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'ATTEMPTED' | 'NOT_ATTEMPTED'>('ALL');

  const levels: Array<JLPTLevel | 'ALL'> = ['ALL', 'N1', 'N2', 'N3', 'N4', 'N5'];
  const years = [2024, 2023, 2022, 2021, 2020];

  const levelLabel = (level: JLPTLevel | 'ALL') => 
    level === 'ALL' ? t('dashboard.allLevels', '🌟 All') : level;

  const statusOptions = [
    { value: 'ALL', label: t('dashboard.status.all', '📋 All Status') },
    { value: 'ATTEMPTED', label: t('dashboard.status.attempted', '✅ Attempted') },
    { value: 'NOT_ATTEMPTED', label: t('dashboard.status.notAttempted', '✨ Not Attempted') },
  ];

  const yearOptions = [
    { value: 'ALL', label: t('dashboard.allYears', '📅 All Years') },
    ...years.map(year => ({ 
      value: year, 
      label: t('dashboard.yearOption', '📅 {{year}}', { year }) 
    })),
  ];

  // Chỉ fetch data 1 lần khi component mount - sử dụng global cache
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      
      try {
        // Check cache trước - nếu có rồi thì dùng luôn
        const cachedTests = dataCache.getTests();
        const cachedAttempts = dataCache.getTestAttempts();
        
        if (cachedTests && cachedAttempts) {
          console.log('[DashboardPage] Using cached data');
          
          const attemptedTestIds = new Set(cachedAttempts.map(a => a.testId));
          const completedTestIds = new Set(
            cachedAttempts.filter(a => a.is_completed).map(a => a.testId)
          );
          
          const updatedTests = cachedTests.map((test: ITest) => ({
            ...test,
            is_attempted: attemptedTestIds.has(test.id),
            is_completed: completedTestIds.has(test.id)
          }));
          
          setAllTests(updatedTests);
          setLoading(false);
          return;
        }
        
        // Nếu đang có request pending, chờ nó xong thay vì tạo request mới
        const pendingTests = dataCache.getPendingTests();
        const pendingAttempts = dataCache.getPendingAttempts();
        
        let testsPromise: Promise<any>;
        let attemptsPromise: Promise<any>;
        
        if (pendingTests) {
          console.log('[DashboardPage] Waiting for pending tests request');
          testsPromise = pendingTests;
        } else {
          console.log('[DashboardPage] Fetching tests - FIRST REQUEST');
          const promise = dataService.getTests({ skill: 'all' });
          dataCache.setPendingTests(promise);
          testsPromise = promise.finally(() => dataCache.setPendingTests(null));
        }
        
        if (pendingAttempts) {
          console.log('[DashboardPage] Waiting for pending attempts request');
          attemptsPromise = pendingAttempts;
        } else {
          console.log('[DashboardPage] Fetching attempts - FIRST REQUEST');
          const promise = dataService.getTestAttempts(1); // Don't pass testId - we want ALL attempts
          dataCache.setPendingAttempts(promise);
          attemptsPromise = promise.finally(() => dataCache.setPendingAttempts(null));
        }
        
        const [testsData, attemptsData] = await Promise.all([testsPromise, attemptsPromise]);
        
        // Save to cache
        dataCache.setTests(testsData);
        dataCache.setTestAttempts(attemptsData);
        
        console.log('[DEBUG] attemptsData:', attemptsData);
        console.log('[DEBUG] Sample attempt:', attemptsData[0]);
        
        const attemptedTestIds = new Set(attemptsData.map((a: any) => a.testId));
        const completedTestIds = new Set(
          attemptsData.filter((a: any) => a.is_completed).map((a: any) => a.testId)
        );
        
        console.log('[DEBUG] Attempted test IDs:', Array.from(attemptedTestIds));
        console.log('[DEBUG] Completed test IDs:', Array.from(completedTestIds));
        
        const updatedTests = testsData.map((test: ITest) => ({
          ...test,
          is_attempted: attemptedTestIds.has(test.id),
          is_completed: completedTestIds.has(test.id)
        }));
        
        console.log('[DEBUG] Sample updated test:', updatedTests[0]);
        
        setAllTests(updatedTests);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []); // Empty deps - chỉ chạy khi mount

  // Filter tests dựa trên state - KHÔNG GỌI API
  const filteredTests = useMemo(() => {
    let filtered = [...allTests];
    
    // Filter by level
    if (selectedLevel !== 'ALL') {
      filtered = filtered.filter(test => test.level === selectedLevel);
    }
    
    // Filter by year
    if (selectedYear !== 'ALL') {
      filtered = filtered.filter(test => test.year === selectedYear);
    }
    
    // Filter by status
    if (selectedStatus === 'ATTEMPTED') {
      filtered = filtered.filter(test => test.is_attempted);
    } else if (selectedStatus === 'NOT_ATTEMPTED') {
      filtered = filtered.filter(test => !test.is_attempted);
    }
    
    return filtered;
  }, [allTests, selectedLevel, selectedYear, selectedStatus]);

  return (
    <div className="space-y-8">
      {/* Page Header - Modern & Clean */}
      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 mb-2">
              {t('dashboard.title', 'Practice Tests')}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {t('dashboard.subtitle', 'Choose a test to start practicing')}
            </p>
          </div>
          {!loading && filteredTests.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 px-4 py-3 rounded-full border border-emerald-200 dark:border-emerald-800">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                {t('dashboard.availablePlural', '{{count}} tests available', { count: filteredTests.length })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Filter Bar - Clean & Reusable Components */}
      <FilterBar>
        {/* Level Pills */}
        <div className="flex items-center gap-2">
          {levels.map((level) => (
            <FilterPill
              key={level}
              label={levelLabel(level)}
              isActive={selectedLevel === level}
              onClick={() => setSelectedLevel(level)}
            />
          ))}
        </div>

        <FilterDivider />

        {/* Status Dropdown */}
        <FilterSelect
          value={selectedStatus}
          onChange={(val) => setSelectedStatus(val as 'ALL' | 'ATTEMPTED' | 'NOT_ATTEMPTED')}
          options={statusOptions}
        />

        {/* Year Dropdown */}
        <FilterSelect
          value={selectedYear}
          onChange={(val) => setSelectedYear(val as number | 'ALL')}
          options={yearOptions}
        />
      </FilterBar>

      {/* Test Grid */}
      <TestCardList 
        tests={filteredTests}
        loading={loading}
        emptyMessage={t('tests.noTests', 'No tests found')}
        emptyDescription={t('dashboard.emptyDescription', 'Try adjusting your filters')}
      />
    </div>
  );
}
