import { IsInt } from 'class-validator';

export class CreateTestAttemptDto {
  @IsInt()
  userId: number;

  @IsInt()
  testId: number;
}
