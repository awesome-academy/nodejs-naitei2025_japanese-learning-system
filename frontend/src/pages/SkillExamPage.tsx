/**
 * SkillExamPage Component
 * Exam interface for skill practice - same logic as ExamPage but with skill-specific routing
 * Results are NOT saved to history
 */

import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { dataService } from '../services';
import { useExamStore } from '../store/useExamStore';
import { useAuthStore } from '../store/useAuthStore';
import type { ISectionWithParts, IResult } from '../types';
import { ExamLayout } from '../layouts/ExamLayout';
import { HTMLRenderer } from '../components/HTMLRenderer';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Question } from '../components/exam/Question';
import { PassageCard } from '../components/exam/PassageCard';
import { Card, CardHeader } from '../components/ui/Card';

export const SkillExamPage: React.FC = () => {
  const { testId, sectionAttemptId } = useParams<{ testId: string; sectionAttemptId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { initExam, setAnswer, toggleMark, answers, mode } = useExamStore();

  const [section, setSection] = useState<ISectionWithParts | null>(null);
  const [result, setResult] = useState<IResult | null>(null);
  const [loading, setLoading] = useState(true);
  const hasFetchedRef = useRef(false);

  const examMode = searchParams.get('mode') as 'exam' | 'review' || 'exam';

  useEffect(() => {
    if (sectionAttemptId && user) {
      // Reset hasFetchedRef when mode changes to allow reload
      hasFetchedRef.current = false;
      loadSection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionAttemptId, user, examMode]);

  const loadSection = async () => {
    setLoading(true);
    try {
      const currentSectionAttemptId = parseInt(sectionAttemptId!);
      
      // Step 1: Get section attempt detail (includes user answers if PAUSED/COMPLETED)
      const sectionAttempt = await dataService.getSectionAttempt(currentSectionAttemptId);
      const sectionId = sectionAttempt.section_id || (sectionAttempt as any).sectionId;
      
      if (!sectionId) {
        throw new Error('Section ID not found in section attempt');
      }
      
      // Step 2: Get section with questions
      const sectionData = await dataService.getSection(sectionId);
      
      // Step 3: Update status to IN_PROGRESS if NOT_STARTED or PAUSED
      const currentStatus = sectionAttempt.status;
      if (currentStatus === 'NOT_STARTED' || currentStatus === 'PAUSED') {
        await dataService.updateSectionAttempt(currentSectionAttemptId, 'IN_PROGRESS');
      }
      
      // Step 4: Load existing answers if any (for PAUSED/COMPLETED)
      const existingAnswers = (sectionAttempt as any).user_answers || [];

      setSection(sectionData);

      // Initialize exam store
      const timeRemaining = (sectionAttempt as any).time_remaining || sectionData.time_limit * 60;
      initExam(currentSectionAttemptId, sectionData.id, examMode, timeRemaining);

      // Load existing answers if PAUSED or COMPLETED (result mode)
      if (existingAnswers.length > 0) {
        existingAnswers.forEach((ans: any) => {
          if (ans.selected_option_id) {
            setAnswer(ans.question_id, ans.selected_option_id);
          }
          if (ans.is_marked) {
            toggleMark(ans.question_id);
          }
        });
      }
      
      // If review mode, section attempt should have correct answers
      if (examMode === 'review' && sectionAttempt.status === 'COMPLETED') {
        // Answers already loaded with correct_answer from backend
        console.log('[SkillExamPage] Setting result from section attempt:', sectionAttempt);
        console.log('[SkillExamPage] User answers:', (sectionAttempt as any).user_answers);
        setResult(sectionAttempt as any); // Cast to IResult for result display
      }
    } catch (error) {
      console.error('Failed to load section:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (isPause: boolean = false) => {
    if (!sectionAttemptId || !section || !testId) return;

    try {
      const answerList = Array.from(answers.values()).map(answer => ({
        question_id: answer.questionId,
        selected_option_id: answer.selectedOptionId,
        is_marked: answer.isMarked
      }));

      const status = isPause ? 'PAUSED' : 'COMPLETED';
      const timeRemaining = useExamStore.getState().timeRemaining;
      
      const resultData = await dataService.submitSectionAttempt(
        parseInt(sectionAttemptId!),
        answerList,
        status,
        timeRemaining
      );
      
      setResult(resultData);
      
      // Navigate to skill-specific review page
      navigate(`/skills/${testId}/sectionAttempts/${sectionAttemptId}?mode=review`);
    } catch (error) {
      console.error('Failed to submit exam:', error);
    }
  };

  const handleOptionSelect = (questionId: number, optionId: number) => {
    if (mode === 'exam') {
      setAnswer(questionId, optionId);
    }
  };

  const handleToggleMark = (questionId: number) => {
    if (mode === 'exam') {
      toggleMark(questionId);
    }
  };

  const getQuestionResult = (questionId: number) => {
    if (!result) return null;
    const userAnswers = (result as any).user_answers || [];
    const userAnswer = userAnswers.find((a: any) => a.question_id === questionId);
    
    if (!userAnswer) return null;
    
    return {
      question_id: questionId,
      is_correct: userAnswer.selected_option_id === userAnswer.option_correct_id,
      selected_option_id: userAnswer.selected_option_id,
      correct_option_id: userAnswer.option_correct_id
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text={t('common.loading')} />
      </div>
    );
  }

  if (!section) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">{t('exam.sectionNotFound')}</p>
      </div>
    );
  }

  // Count total questions
  const totalQuestions = section.parts.reduce((sum, part) => sum + part.questions.length, 0);
  const questionIds = section.parts.flatMap(part => part.questions.map(q => q.id));
  let questionIndex = 0;

  // Map user_answers to resultQuestions format for ExamLayout
  const resultQuestions = result ? ((result as any).user_answers || []).map((ans: any) => {
    console.log('[SkillExamPage] Mapping answer:', ans);
    return {
      question_id: ans.question_id,
      is_correct: ans.selected_option_id === ans.option_correct_id,
      selected_option_id: ans.selected_option_id
    };
  }) : undefined;

  console.log('[SkillExamPage] Result questions for ExamLayout:', resultQuestions);

  const handlePause = async () => {
    // Submit with PAUSED status
    await handleSubmit(true);
  };

  const handleBackToSections = () => {
    // Navigate back to skill sections page
    navigate(`/skills/${testId}/sections`);
  };

  return (
    <ExamLayout
      totalQuestions={totalQuestions}
      questionIds={questionIds}
      hasAudio={!!section.audio_url}
      audioUrl={section.audio_url}
      onSubmit={handleSubmit}
      onPause={handlePause}
      correctCount={result?.correct_count}
      resultQuestions={resultQuestions}
      testAttemptId={null} // No test attempt ID for skill practice
      isSkillPractice={true}
      onBackToSections={handleBackToSections}
    >
      <div className="space-y-10 py-4">
        {/* Practice Notice Banner - only show in exam mode */}
        {mode === 'exam' && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm">
                ⚠
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-amber-900 dark:text-amber-200 mb-1">
                  {t('skills.skillPracticeModeTitle')}
                </p>
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  {t('skills.skillPracticeModeDesc')}
                </p>
              </div>
            </div>
          </div>
        )}

        {section.parts.map((part) => (
          <Card key={part.id} padding="lg">
            {/* Part Title */}
            <CardHeader>
              <HTMLRenderer
                content={part.title}
                className="text-lg font-bold text-gray-900 dark:text-white leading-relaxed"
              />
            </CardHeader>

            {/* Passage (if exists) */}
            {part.passage && (
              <PassageCard
                title={part.passage.title || undefined}
                content={part.passage.content}
                imageUrl={part.passage.image_url || undefined}
              />
            )}

            {/* Questions */}
            <div>
              {part.questions.map((question) => {
                const questionResult = getQuestionResult(question.id);
                const currentQuestionIndex = questionIndex;
                questionIndex++;
                
                return (
                  <Question
                    key={question.id}
                    question={question}
                    questionNumber={currentQuestionIndex + 1}
                    isReviewMode={mode === 'review'}
                    selectedOptionId={answers.get(question.id)?.selectedOptionId || null}
                    isMarked={answers.get(question.id)?.isMarked || false}
                    correctOptionId={questionResult?.correct_option_id}
                    isCorrect={questionResult?.is_correct}
                    onSelectOption={(optionId) => handleOptionSelect(question.id, optionId)}
                    onToggleMark={() => handleToggleMark(question.id)}
                  />
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </ExamLayout>
  );
};
