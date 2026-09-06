import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { MealPlan } from './meal-plan.entity.js';
import { ShoppingListItem } from './shopping-list-item.entity.js';

@Entity('shopping_lists')
export class ShoppingList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  generatedAt: Date;

  @ManyToOne(() => MealPlan, { nullable: true })
  @JoinColumn()
  mealPlan: MealPlan;

  @OneToMany(() => ShoppingListItem, (item) => item.shoppingList, {
    cascade: true,
  })
  items: ShoppingListItem[];
}
