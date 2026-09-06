import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Recipe } from './recipe.entity.js';
import { MealPlan } from './meal-plan.entity.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Recipe, (recipe) => recipe.user)
  recipes: Recipe[];

  @OneToMany(() => MealPlan, (mealPlan) => mealPlan.user)
  mealPlans: MealPlan[];
}
