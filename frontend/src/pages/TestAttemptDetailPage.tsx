/**
 * Test Attempt Detail Page
 * Shows 3 section attempts for a specific test attempt
 */

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { dataService } from '../services';
import type { ITestAttempt, ITestDetail } from '../types';
import { HTMLRenderer } from '../components/HTMLRenderer';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuthStore } from '../store/useAuthStore';
import { SectionList } from '../components/SectionList';

export function TestAttemptDetailPage() {
  const { testAttemptId } = useParams<{ testAttemptId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const { t } = useTranslation();

  const [testAttempt, setTestAttempt] = useState<ITestAttempt | null>(null);
  const [testDetail, setTestDetail] = useState<ITestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const hasFetchedRef = useRef(false);
  const prevTestAttemptIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Reset hasFetchedRef khi testAttemptId thay đổi
    if (prevTestAttemptIdRef.current !== testAttemptId) {
      hasFetchedRef.current = false;
      prevTestAttemptIdRef.current = testAttemptId;
    }

    if (testAttemptId && user && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchTestAttempt();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testAttemptId, user, location.key]);

  const fetchTestAttempt = async () => {
    setLoading(true);
    try {
      const attempt = await dataService.getTestAttempt(parseInt(testAttemptId!));
      setTestAttempt(attempt);
      
      // Fetch test detail to get section names
      const testId = (attempt as any).testId || (attempt as any).test_id;
      if (testId) {
        const detail = await dataService.getTestDetail(testId);
        setTestDetail(detail);
      }
    } catch (error) {
      console.error('Failed to fetch test attempt:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-300/50 dark:border-emerald-700/50';
      case 'IN_PROGRESS':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-300/50 dark:border-blue-700/50';
      case 'PAUSED':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-300/50 dark:border-amber-700/50';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400 border-gray-300/50 dark:border-gray-700/50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return `✓ ${t('tests.status.done')}`;
      case 'IN_PROGRESS':
        return `⏱ ${t('tests.status.paused')}`;
      case 'PAUSED':
        return `⏸ ${t('tests.paused')}`;
      default:
        return `○ ${t('tests.status.notStarted')}`;
    }
  };

  const handleSectionClick = (section: any) => {
    if (section.status === 'COMPLETED') {
      // Navigate to review mode
      navigate(`/sectionAttempts/${section.id}?mode=review`);
    } else {
      // Resume or continue
      navigate(`/sectionAttempts/${section.id}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return <LoadingSpinner text="Đang tải..." />;
  }

  if (!testAttempt) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Không tìm thấy test attempt</p>
      </div>
    );
  }

  const totalQuestions = (testAttempt.section_attempts || testAttempt.sections || []).reduce((sum, section) => sum + (section.question_count || 0), 0);
  const totalCorrect = (testAttempt.section_attempts || testAttempt.sections || []).reduce((sum, section) => sum + (section.correct_count || 0), 0);
  const completedSections = (testAttempt.section_attempts || testAttempt.sections || []).filter(s => s.status === 'COMPLETED').length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Back Button */}
      <button
        onClick={() => navigate(`/tests/${testAttempt.testId}`)}
        className="group inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-semibold">Quay lại</span>
      </button>

      {/* Test Attempt Header - Premium Design */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-800">
        {/* Status indicator bar */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${testAttempt.is_completed ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500' : 'bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500'}`}></div>
        
        {/* Background gradient */}
        <div className={`absolute inset-0 ${testAttempt.is_completed ? 'bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5' : 'bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-blue-500/5'}`}></div>
        
        <div className="relative p-8">
          {/* Header with status */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide ${testAttempt.is_completed ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'}`}>
                  {testAttempt.is_completed ? '✓ Hoàn thành' : '⏱ Đang làm'}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(testAttempt.started_at)}
                </span>
              </div>
              <HTMLRenderer
                content={testAttempt.test_title}
                className="text-3xl font-black text-gray-900 dark:text-white leading-tight"
              />
            </div>
            
            {/* Score badge */}
            {testAttempt.is_completed && testAttempt.total_score !== null && (
              <div className="flex-shrink-0 text-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-6 border-2 border-emerald-200 dark:border-emerald-800 shadow-lg">
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 leading-none mb-2">
                  {testAttempt.total_score}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wider">
                  Điểm trung bình
                </div>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          {testAttempt.is_completed && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-slate-800 dark:to-slate-800/50 rounded-xl p-4 border border-gray-200/50 dark:border-slate-700/50">
                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Hoàn thành</div>
                <div className="text-2xl font-black text-gray-900 dark:text-white">{completedSections}/{(testAttempt.section_attempts || testAttempt.sections || []).length}</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-900/10 rounded-xl p-4 border border-emerald-200/50 dark:border-emerald-700/50">
                <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">Câu đúng</div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{totalCorrect}/{totalQuestions}</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/50">
                <div className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-1">Độ chính xác</div>
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                  {totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0}%
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
          Kết quả chi tiết
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
          {(testAttempt.section_attempts || testAttempt.sections || []).length} phần
        </span>
      </div>

      {/* Section Attempts */}
      <SectionList
        sections={(testAttempt.section_attempts || testAttempt.sections || []).map(section => {
          // Find section name from test detail
          const sectionId = (section as any).sectionId || (section as any).section_id;
          const sectionDetail = testDetail?.sections?.find(s => s.id === sectionId);
          
          return {
            id: section.id,
            name: sectionDetail?.name || `Section ${section.id}`,
            time_limit: section.time_limit || sectionDetail?.time_limit,
            question_count: section.question_count,
            status: section.status,
            score: section.score,
            correct_count: section.correct_count,
            time_remaining: section.time_remaining
          };
        })}
        onSectionClick={handleSectionClick}
        mode="attempt"
        showTitle={false}
      />
    </div>
  );
}
