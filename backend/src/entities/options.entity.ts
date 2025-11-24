// src/modules/tests/entities/option.entity.ts
import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Question } from './questions.entity';

@Entity('options')
export class Option extends BaseEntity {
  @ManyToOne(() => Question, (q) => q.options, { onDelete: 'CASCADE' })
  question: Question;

  @Column({ type: 'text' })
  content: string;

  @Column()
  order_index: number;

  @Column({ default: false })
  is_correct: boolean;
}
