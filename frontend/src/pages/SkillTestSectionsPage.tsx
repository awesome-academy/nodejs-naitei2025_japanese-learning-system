/**
 * Skill Test Sections Page
 * Shows sections for skill practice
 * Route: /skills/:testId/sections
 */

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, BookOpen, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { dataService } from '../services';
import type { ITestDetail, ISectionWithParts } from '../types';
import { HTMLRenderer } from '../components/HTMLRenderer';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SkillSectionCard } from '../components/SkillSectionCard';
import { useAuthStore } from '../store/useAuthStore';

export function SkillTestSectionsPage() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [test, setTest] = useState<ITestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [sectionAttempts, setSectionAttempts] = useState<Map<number, any>>(new Map());
  const hasFetchedRef = useRef(false);
  const user = useAuthStore(state => state.user);

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
      const testData = await dataService.getTestDetail(parseInt(testId!));
      setTest(testData);
      
      // Fetch test attempts to check which sections have been attempted
      await fetchSectionAttempts();
    } catch (error) {
      console.error('Failed to fetch test detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSectionAttempts = async () => {
    try {
      if (!user) return;
      // Get all test attempts for this user and test
      const attempts = await dataService.getTestAttempts(user.id, parseInt(testId!));
      console.log('[SkillTestSectionsPage] All test attempts:', attempts);
      // Build a map of section_id -> best section attempt (highest score)
      const sectionAttemptsMap = new Map<number, any>();
      attempts.forEach(testAttempt => {
        const sectionAttempts = testAttempt.section_attempts || (testAttempt as any).sectionAttempts || [];
        console.log('[SkillTestSectionsPage] Section attempts in test attempt:', sectionAttempts);
        sectionAttempts.forEach((sectionAttempt: any) => {
          const sectionId = sectionAttempt.section_id || sectionAttempt.sectionId;
          const score = sectionAttempt.score || 0;
          console.log('[SkillTestSectionsPage] Processing section attempt:', { 
            sectionId, 
            status: sectionAttempt.status, 
            score,
            attemptId: sectionAttempt.id,
          });
          // Only keep the best (highest score) attempt for each section
          if (!sectionAttemptsMap.has(sectionId) || sectionAttemptsMap.get(sectionId).score < score) {
            sectionAttemptsMap.set(sectionId, sectionAttempt);
          }
        });
      });
      console.log('[SkillTestSectionsPage] Final section attempts map (best scores):', Array.from(sectionAttemptsMap.entries()));
      setSectionAttempts(sectionAttemptsMap);
    } catch (error) {
      console.error('Failed to fetch section attempts:', error);
    }
  };

  const handleSectionStart = async (section: ISectionWithParts, isRetry: boolean = false) => {
    try {
      if (!user) return;
      // For skill practice, start section attempt directly
      console.log('[SkillTestSectionsPage] Starting section attempt...', { isRetry });
      const sectionAttempt = await dataService.startSectionAttempt(section.id, isRetry);
      // Navigate to skill exam page with the new section attempt ID
      navigate(`/skills/${testId}/sectionAttempts/${sectionAttempt.id}?mode=exam`);
    } catch (error) {
      console.error('Failed to start section:', error);
    }
  };

  const handleViewResult = (sectionAttemptId: number) => {
    navigate(`/skills/${testId}/sectionAttempts/${sectionAttemptId}?mode=review`);
  };

  const getSectionStatus = (sectionId: number) => {
    return sectionAttempts.get(sectionId);
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

  // Calculate total questions and time from sections
  const totalQuestions = test.sections?.reduce((sum, section) => {
    // Ưu tiên lấy section.question_count nếu có, nếu không thì cộng tổng số câu từ các part
    if (typeof section.question_count === 'number') {
      return sum + section.question_count;
    }
    const sectionQuestions = section.parts?.reduce((partSum, part) => partSum + (part.questions?.length || 0), 0) || 0;
    return sum + sectionQuestions;
  }, 0) || 0;
  const totalTime = test.sections?.reduce((sum, section) => sum + (section.time || 0), 0) || 0;
  const totalSections = test.sections?.length || 0;

  return (
    <div className="min-h-screen pb-12">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-60 -left-40 w-96 h-96 bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative space-y-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(test?.skill ? `/skills/${test.skill}` : '/skills')}
          className="group flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
        >
          <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 group-hover:border-emerald-400 dark:group-hover:border-emerald-500 group-hover:shadow-lg group-hover:shadow-emerald-500/10 transition-all group-hover:-translate-x-1">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-semibold">{t('common.back')}</span>
        </button>

        {/* Hero Section - Skill Practice Theme */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl p-8 shadow-2xl shadow-emerald-500/20">
          {/* Decorative patterns */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24" />
          </div>
          
          {/* Floating particles animation */}
          <div className="absolute inset-0 overflow-hidden">
            <Sparkles className="absolute top-10 left-20 w-6 h-6 text-white/30 animate-pulse" />
            <Sparkles className="absolute top-32 right-32 w-4 h-4 text-white/20 animate-pulse delay-75" />
            <Sparkles className="absolute bottom-20 left-1/2 w-5 h-5 text-white/25 animate-pulse delay-150" />
          </div>
          
          <div className="relative">
           

            {/* Test Title */}
            <HTMLRenderer
              content={test.title}
              className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight drop-shadow-lg"
            />

            
          </div>
        </div>

        {/* Instructions Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl p-6 border border-blue-200 dark:border-blue-800/50">
          <div className="flex items-start gap-4">
            <div className="flex-none p-3 rounded-xl bg-blue-500 text-white">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('skills.practiceGuide')}</h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="flex-none w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center mt-0.5">1</span>
                  <span>{t('skills.selectSectionToPractice')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-none w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center mt-0.5">2</span>
                  <span>{t('skills.completeSectionGuide')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-none w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center mt-0.5">3</span>
                  <span>{t('skills.viewResultsGuide')}</span>
                </li>                
              </ul>
            </div>
          </div>
        </div>

        {/* Section Cards */}
        <div>
          <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                  <Zap className="w-6 h-6" />
                </div>
                {t('skills.selectSectionToPractice')}
              </h2>
              <div className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  {t('skills.sectionCount', { count: test.sections?.length || 0 })}
                </span>
              </div>
          </div>
          
          {test.sections && test.sections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {test.sections.map((section, index) => {
                const sectionAttempt = getSectionStatus(section.id);
                const hasAttempt = sectionAttempt && sectionAttempt.status === 'COMPLETED';
                
                console.log('[SkillTestSectionsPage] Rendering section', section.id, ':', { sectionAttempt, hasAttempt });
                
                return (
                  <SkillSectionCard
                    key={section.id}
                    section={section}
                    index={index}
                    onClick={() => !hasAttempt && handleSectionStart(section, false)}
                    mode="detail"
                    hasAttempt={hasAttempt}
                    onRetry={hasAttempt ? () => handleSectionStart(section, true) : undefined}
                    onViewResult={hasAttempt ? () => handleViewResult(sectionAttempt.id) : undefined}
                  />
                );
              })}
            </div>
          ) : (
              <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900/50 dark:to-slate-800/50 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                <p className="text-lg font-bold text-gray-600 dark:text-gray-400">
                  {t('skills.noSections')}
                </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
