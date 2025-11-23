// src/modules/tests/entities/passage.entity.ts
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Part } from './parts.entity';
import { Question } from './questions.entity';

@Entity('passages')
export class Passage extends BaseEntity {
  @ManyToOne(() => Part, (p) => p.passages, { onDelete: 'CASCADE' })
  part: Part;

  @Column({ length: 255, nullable: true })
  title?: string;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ length: 500, nullable: true })
  image_url?: string;

  @OneToMany(() => Question, (q) => q.passage)
  questions: Question[];
}
