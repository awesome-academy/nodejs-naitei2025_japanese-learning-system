export class SectionAttemptResponseDto {
  id: number;
  sectionId: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED';
  score?: number | null;
  correct_count: number;
  time_remaining: number;
}

export class TestAttemptResponseDto {
  id: number;
  testId: number;
  is_completed: boolean;
  total_score?: number | null;
  is_passed?: boolean | null;
  started_at?: Date;
  completed_at?: Date;
  section_attempts: SectionAttemptResponseDto[];
}
