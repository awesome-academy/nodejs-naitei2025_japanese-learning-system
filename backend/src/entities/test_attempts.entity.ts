// src/modules/progress/entities/test-attempt.entity.ts
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './users.entity';
import { Test } from './tests.entity';
import { SectionAttempt } from './section_attempts.entity';

@Entity('test_attempts')
export class TestAttempt extends BaseEntity {
  @ManyToOne(() => User, (u) => u.test_attempts, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Test, { onDelete: 'CASCADE' })
  test: Test;

  @Column({ default: false })
  is_completed: boolean;

  @Column({ type: 'int', nullable: true })
  total_score?: number | null;

  @Column({ type: 'boolean', nullable: true })
  is_passed?: boolean | null;

  @Column({ type: 'timestamp', nullable: true })
  started_at?: Date;

  @Column({ type: 'timestamp', nullable: true })
  completed_at?: Date;

  @OneToMany(() => SectionAttempt, (s) => s.test_attempt)
  section_attempts: SectionAttempt[];
}
