// src/modules/progress/entities/user-answer.entity.ts
import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { SectionAttempt } from './section_attempts.entity';
import { Question } from './questions.entity';
import { Option } from './options.entity';

@Entity('user_answers')
export class UserAnswer extends BaseEntity {
  @ManyToOne(() => SectionAttempt, (sa) => sa.answers, { onDelete: 'CASCADE' })
  section_attempt: SectionAttempt;

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  question: Question;

  @ManyToOne(() => Option, { nullable: true, onDelete: 'SET NULL' })
  selected_option?: Option | null;

  @Column()
  is_correct: boolean;

  @Column({ default: false })
  is_marked: boolean;
}
