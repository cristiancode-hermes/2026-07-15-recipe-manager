import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingListsController } from './shopping-lists.controller.js';
import { ShoppingListsService } from './shopping-lists.service.js';
import { ShoppingList } from '../entities/shopping-list.entity.js';
import { ShoppingListItem } from '../entities/shopping-list-item.entity.js';
import { MealPlan } from '../entities/meal-plan.entity.js';
import { MealPlanEntry } from '../entities/meal-plan-entry.entity.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ShoppingList,
      ShoppingListItem,
      MealPlan,
      MealPlanEntry,
    ]),
    AuthModule,
  ],
  controllers: [ShoppingListsController],
  providers: [ShoppingListsService],
  exports: [ShoppingListsService],
})
export class ShoppingListsModule {}
