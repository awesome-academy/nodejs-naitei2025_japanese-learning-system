/**
 * TestDetailPage Component
 * Section selection page with Start/Resume/Review buttons
 */

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { dataService } from '../services';
import type { ITestDetail, ISectionWithParts } from '../types';
import { HTMLRenderer } from '../components/HTMLRenderer';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SectionList } from '../components/SectionList';
import { useAuthStore } from '../store/useAuthStore';

export const TestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [test, setTest] = useState<ITestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const testId = parseInt(id!);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (testId && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchTestDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId]);

  const fetchTestDetail = async () => {
    setLoading(true);
    try {
      const data = await dataService.getTestDetail(testId);
      console.log('[TestDetailPage] Test data:', data);
      console.log('[TestDetailPage] Sections:', data.sections);
      if (data.sections) {
        data.sections.forEach((section, idx) => {
          console.log(`[TestDetailPage] Section ${idx}:`, section);
          console.log(`[TestDetailPage] Section ${idx} parts:`, section.parts);
          if (section.parts) {
            section.parts.forEach((part, pIdx) => {
              console.log(`[TestDetailPage] Part ${pIdx} questions:`, part.questions?.length);
            });
          }
        });
      }
      setTest(data);
    } catch (error) {
      console.error('Failed to fetch test detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionClick = async (section: ISectionWithParts) => {
    try {
      const { user } = useAuthStore.getState();
      if (!user) return;
      
      // This page is for starting NEW test attempts
      // Always create a new test attempt when clicking a section
      console.log('[TestDetailPage] Starting new test attempt...');
      const testAttempt = await dataService.startTestAttempt(testId);
      console.log('[TestDetailPage] Created test attempt:', testAttempt);
      
      // Find the section attempt from the created test attempt
      const sectionAttempts = testAttempt.section_attempts || [];
      console.log('[TestDetailPage] Section attempts:', sectionAttempts);
      console.log('[TestDetailPage] Looking for section_id:', section.id);
      
      const sectionAttempt = sectionAttempts.find(sa => 
        (sa.section_id || (sa as any).sectionId) === section.id
      );
      
      if (!sectionAttempt) {
        console.error('[TestDetailPage] Section attempt not found!');
        console.error('[TestDetailPage] Available section_ids:', sectionAttempts.map(sa => sa.section_id || (sa as any).sectionId));
        throw new Error('Section attempt not found in test attempt');
      }
      
      console.log('[TestDetailPage] Found section attempt:', sectionAttempt);
      
      // Navigate to exam page with the new section attempt ID
      navigate(`/sectionAttempts/${sectionAttempt.id}?mode=exam`);
    } catch (error) {
      console.error('[TestDetailPage] Failed to start section:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner text={t('common.loading')} />;
  }

  if (!test) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">{t('tests.noTests')}</p>
      </div>
    );
  }

  const totalQuestions = test.sections?.reduce((sum, section) => {
    // Use question_count from section if available, otherwise calculate from parts
    const sectionQuestions = (section as any).question_count || 
      section.parts?.reduce((partSum, part) => partSum + (part.questions?.length || 0), 0) || 0;
    return sum + sectionQuestions;
  }, 0) || 0;

  const totalTime = test.sections?.reduce((sum, section) => sum + (section.time_limit || 0), 0) || 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Back Button */}
      <button
        onClick={() => navigate('/tests')}
        className="group inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-semibold">{t('common.back')}</span>
      </button>

      {/* Test Header - Modern & Clean */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-800">
        {/* Gradient accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5 dark:from-emerald-500/10 dark:via-teal-500/10 dark:to-cyan-500/10"></div>
        
        <div className="relative p-8">
          {/* Title & Badge */}
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
              {test.level.replace('JLPT ', '')}
            </div>
            <div className="flex-1">
              <HTMLRenderer
                content={test.title}
                className="text-3xl font-black text-gray-900 dark:text-white mb-2 leading-tight"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('tests.level')} {test.level} • {test.month}/{test.year}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-slate-800 dark:to-slate-800/50 rounded-xl p-4 border border-gray-200/50 dark:border-slate-700/50">
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t('tests.sections')}</div>
              <div className="text-2xl font-black text-gray-900 dark:text-white">{test.sections?.length || 0}</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-900/10 rounded-xl p-4 border border-emerald-200/50 dark:border-emerald-700/50">
              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">{t('tests.questions')}</div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{totalQuestions}</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/50">
              <div className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-1">{t('tests.time')}</div>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{totalTime} {t('tests.minutes')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
          {t('skills.sections')}
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
          {t('skills.sectionCount', { count: test.sections?.length || 0 })}
        </span>
      </div>

      {/* Section Cards */}
      <SectionList
        sections={test.sections || []}
        onSectionClick={handleSectionClick}
        mode="detail"
        showTitle={false}
      />
    </div>
  );
};
