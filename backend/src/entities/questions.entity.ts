// src/modules/tests/entities/question.entity.ts
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Part } from './parts.entity';
import { Passage } from './passages.entity';
import { Option } from './options.entity';

@Entity('questions')
export class Question extends BaseEntity {
  @ManyToOne(() => Part, (p) => p.questions, { onDelete: 'CASCADE' })
  part: Part;

  @ManyToOne(() => Passage, (ps) => ps.questions, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  passage?: Passage | null;

  @Column()
  question_number: number;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ length: 500, nullable: true })
  image_url?: string;

  @Column({ length: 500, nullable: true })
  audio_url?: string;

  @Column({ type: 'text', nullable: true })
  explanation?: string;

  @OneToMany(() => Option, (o) => o.question)
  options: Option[];
}
