import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity.js';
import { Ingredient } from './ingredient.entity.js';
import { MealPlanEntry } from './meal-plan-entry.entity.js';

@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  prepTime: number;

  @Column()
  cookTime: number;

  @Column()
  difficulty: 'easy' | 'medium' | 'hard';

  @Column()
  cuisine: string;

  @Column()
  servings: number;

  @Column({ type: 'text' })
  instructions: string;

  @Column({ nullable: true })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.recipes)
  @JoinColumn()
  user: User;

  @OneToMany(() => Ingredient, (ingredient) => ingredient.recipe, {
    cascade: true,
  })
  ingredients: Ingredient[];

  @OneToMany(() => MealPlanEntry, (entry) => entry.recipe)
  mealPlanEntries: MealPlanEntry[];
}
