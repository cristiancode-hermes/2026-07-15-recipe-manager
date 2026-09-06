import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MealPlan } from './meal-plan.entity.js';
import { Recipe } from './recipe.entity.js';

@Entity('meal_plan_entries')
export class MealPlanEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dayOfWeek: number;

  @Column()
  mealType: string;

  @ManyToOne(() => MealPlan, (mealPlan) => mealPlan.entries)
  @JoinColumn()
  mealPlan: MealPlan;

  @ManyToOne(() => Recipe, (recipe) => recipe.mealPlanEntries)
  @JoinColumn()
  recipe: Recipe;
}
