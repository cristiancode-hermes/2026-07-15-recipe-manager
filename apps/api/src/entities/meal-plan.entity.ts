import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity.js';
import { MealPlanEntry } from './meal-plan-entry.entity.js';

@Entity('meal_plans')
export class MealPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  weekStart: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.mealPlans)
  @JoinColumn()
  user: User;

  @OneToMany(() => MealPlanEntry, (entry) => entry.mealPlan, { cascade: true })
  entries: MealPlanEntry[];
}
