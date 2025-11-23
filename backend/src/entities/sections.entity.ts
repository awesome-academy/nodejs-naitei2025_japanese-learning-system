import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Test } from './tests.entity';
import { Part } from './parts.entity';

@Entity('sections')
export class Section extends BaseEntity {
  @ManyToOne(() => Test, (t) => t.sections, { onDelete: 'CASCADE' })
  test: Test;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 500, nullable: true })
  audio_url?: string;

  @Column()
  time_limit: number; // minutes

  @Column()
  order_index: number;

  @OneToMany(() => Part, (p) => p.section)
  parts: Part[];
}
