import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service.js';
import { User } from '../entities/user.entity.js';
import { Recipe } from '../entities/recipe.entity.js';
import { Ingredient } from '../entities/ingredient.entity.js';
import { MealPlan } from '../entities/meal-plan.entity.js';
import { MealPlanEntry } from '../entities/meal-plan-entry.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Recipe, Ingredient, MealPlan, MealPlanEntry]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
