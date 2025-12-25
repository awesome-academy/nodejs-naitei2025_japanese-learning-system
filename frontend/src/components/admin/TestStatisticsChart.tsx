/**
 * Test Statistics Chart Component - Column Chart Version
 * Displays correct rate for each question by section using column (vertical bar) chart
 */

import { useMemo, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ITestStatistics, ISectionStatistic, IQuestionStatistic } from '../../types';

interface TestStatisticsChartProps {
  data: ITestStatistics;
  testTitle?: string;
  attemptCount?: number;
}

export function TestStatisticsChart({ data, testTitle, attemptCount }: TestStatisticsChartProps) {
  const [selectedSection, setSelectedSection] = useState<number>(0);
  const { t } = useTranslation();

  // Fill missing questions with 0 data
  const fillAllQuestions = (section: ISectionStatistic): IQuestionStatistic[] => {
    const existingQuestions = section.questions;
    const totalQ = section.sectionTotalQuestion || 35;
    const filledQuestions: IQuestionStatistic[] = [];
    for (let i = 1; i <= totalQ; i++) {
      const existing = existingQuestions.find(q => q.questionNumber === i);
      if (existing) {
        // Mẫu số là max(attemptCount, totalCount của từng câu)
        const denominator = Math.max(attemptCount || 0, existing.totalCount || 0);
        filledQuestions.push({
          ...existing,
          totalCount: denominator,
          correctRate: denominator > 0 ? existing.correctCount / denominator : 0,
        });
      } else {
        // Fill missing question with 0 data
        filledQuestions.push({
          questionNumber: i,
          correctCount: 0,
          totalCount: attemptCount || 0,
          correctRate: 0,
        });
      }
    }
    return filledQuestions;
  };

  // Calculate statistics for current section
  const sectionStats = useMemo(() => {
    const section = data.sections[selectedSection];
    if (!section) return null;

    const allQuestions = fillAllQuestions(section);
    const questionsWithData = allQuestions.filter(q => q.totalCount > 0);
    const sectionTotalQuestions = allQuestions.length;
    const avgCorrectRate = questionsWithData.length > 0 
      ? questionsWithData.reduce((sum, q) => sum + q.correctRate, 0) / questionsWithData.length
      : 0;
    
    // Categorize questions by difficulty (only with data)
    const easy = questionsWithData.filter(q => q.correctRate >= 0.7).length;
    const medium = questionsWithData.filter(q => q.correctRate >= 0.4 && q.correctRate < 0.7).length;
    const hard = questionsWithData.filter(q => q.correctRate < 0.4).length;

    return {
      sectionTotalQuestions,
      questionsWithData: questionsWithData.length,
      avgCorrectRate,
      easy,
      medium,
      hard,
      allQuestions,
    };
  }, [data.sections, selectedSection]);

  const currentSection = data.sections[selectedSection];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Compact Header with Section Tabs */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                {t('admin.analytics.difficultyAnalysis')}
              </h3>
              {testTitle && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {testTitle.replace(/<[^>]+>/g, '')}
                </p>
              )}
            </div>
          </div>
          
          {/* Inline Stats */}
          {sectionStats && (
            <div className="flex items-center gap-4 text-xs">
              <div className="text-center">
                <div className="text-gray-500 dark:text-gray-400">{t('admin.stats.total', 'Tổng')}</div>
                <div className="font-bold text-gray-900 dark:text-white">{sectionStats.sectionTotalQuestions}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-500 dark:text-gray-400">{t('admin.stats.hasData', 'Có data')}</div>
                <div className="font-bold text-blue-600 dark:text-blue-400">{sectionStats.questionsWithData}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-500 dark:text-gray-400">{t('admin.stats.avgCorrect', 'TB đúng')}</div>
                <div className="font-bold text-emerald-600 dark:text-emerald-400">
                  {(sectionStats.avgCorrectRate * 100).toFixed(0)}%
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="font-bold text-green-600">{sectionStats.easy}</span>
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                <span className="font-bold text-yellow-600">{sectionStats.medium}</span>
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span className="font-bold text-red-600">{sectionStats.hard}</span>
              </div>
            </div>
          )}
        </div>

        {/* Section Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {data.sections.map((section, index) => (
            <button
              key={index}
              onClick={() => setSelectedSection(index)}
              className={`px-3 py-1.5 rounded-md font-medium text-xs whitespace-nowrap transition-all ${
                selectedSection === index
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {section.sectionName}
            </button>
          ))}
        </div>
      </div>

      {/* Column Chart */}
      <div className="p-4">
        <div className="overflow-x-auto">
          <div className="flex items-end gap-1 min-w-max" style={{ minHeight: '280px' }}>
            {sectionStats?.allQuestions.map((question) => {
              const hasData = question.totalCount > 0;
              const percentage = question.correctRate * 100;
              const height = hasData ? `${Math.max(percentage, 5)}%` : '3%';
              
              let difficultyColor: string;
              if (!hasData) {
                difficultyColor = 'bg-gray-300 dark:bg-gray-600';
              } else if (percentage >= 70) {
                difficultyColor = 'bg-gradient-to-t from-green-600 to-green-400';
              } else if (percentage >= 40) {
                difficultyColor = 'bg-gradient-to-t from-yellow-600 to-yellow-400';
              } else {
                difficultyColor = 'bg-gradient-to-t from-red-600 to-red-400';
              }

              return (
                <div
                  key={question.questionNumber}
                  className="flex flex-col items-center group"
                  style={{ width: '38px' }}
                >
                  {/* Value on top - Only if has data */}
                  <div className="text-[10px] font-bold text-gray-900 dark:text-white mb-1.5 h-4">
                    {hasData ? `${percentage.toFixed(0)}%` : '-'}
                  </div>
                  
                  {/* Column */}
                  <div className="relative w-full flex flex-col items-center justify-end" style={{ height: '220px' }}>
                    <div
                      className={`${difficultyColor} w-full rounded-t transition-all duration-300 group-hover:scale-105 ${hasData ? 'shadow-sm' : 'opacity-40'} relative flex flex-col items-center justify-end pb-1`}
                      style={{ height, minHeight: hasData ? '15px' : '8px' }}
                      title={hasData ? `Câu ${question.questionNumber}: ${question.correctCount}/${question.totalCount} (${percentage.toFixed(1)}%)` : `Câu ${question.questionNumber}: Chưa có dữ liệu`}
                    >
                      {/* Count visible on hover - only if has data */}
                      {hasData && (
                        <span className="text-white text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                          {question.correctCount}/{question.totalCount}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Question number */}
                  <div className={`text-[10px] font-medium mt-1.5 ${hasData ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600'}`}>
                    {question.questionNumber}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Compact Legend */}
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center gap-4 text-[10px]">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-green-500"></div>
              <span className="text-gray-600 dark:text-gray-400">{t('admin.difficulty.easy', 'Dễ ≥70%')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-yellow-500"></div>
              <span className="text-gray-600 dark:text-gray-400">{t('admin.difficulty.medium', 'TB 40-69%')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-red-500"></div>
              <span className="text-gray-600 dark:text-gray-400">{t('admin.difficulty.hard', 'Khó <40%')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded bg-gray-400"></div>
              <span className="text-gray-600 dark:text-gray-400">{t('admin.difficulty.noData', 'Chưa có data')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
