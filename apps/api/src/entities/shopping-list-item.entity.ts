import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ShoppingList } from './shopping-list.entity.js';

@Entity('shopping_list_items')
export class ShoppingListItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'real' })
  quantity: number;

  @Column()
  unit: string;

  @Column({ default: false })
  checked: boolean;

  @ManyToOne(() => ShoppingList, (list) => list.items)
  @JoinColumn()
  shoppingList: ShoppingList;
}
