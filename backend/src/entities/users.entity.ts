// src/modules/users/entities/user.entity.ts
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TestAttempt } from './test_attempts.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 100 })
  full_name: string;

  @Column({ length: 10, default: 'user' })
  role: string;

  @Column({ type: 'longtext', nullable: true })
  image: string;

  @Column({ nullable: true })
  refresh_token: string;

  @OneToMany(() => TestAttempt, (t) => t.user)
  test_attempts: TestAttempt[];
}
