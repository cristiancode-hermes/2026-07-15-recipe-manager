import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Recipe } from './recipe.entity.js';

@Entity('ingredients')
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'real' })
  quantity: number;

  @Column()
  unit: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.ingredients)
  @JoinColumn()
  recipe: Recipe;
}
