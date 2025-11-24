import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Section } from './sections.entity';
import { Passage } from './passages.entity';
import { Question } from './questions.entity';

@Entity('parts')
export class Part extends BaseEntity {
  @ManyToOne(() => Section, (s) => s.parts, { onDelete: 'CASCADE' })
  section: Section;

  @Column()
  part_number: number;

  @Column({ type: 'text', nullable: true })
  title?: string;

  @OneToMany(() => Passage, (p) => p.part)
  passages: Passage[];

  @OneToMany(() => Question, (q) => q.part)
  questions: Question[];
}
