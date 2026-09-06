import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealPlansController } from './meal-plans.controller.js';
import { MealPlansService } from './meal-plans.service.js';
import { MealPlan } from '../entities/meal-plan.entity.js';
import { MealPlanEntry } from '../entities/meal-plan-entry.entity.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([MealPlan, MealPlanEntry]), AuthModule],
  controllers: [MealPlansController],
  providers: [MealPlansService],
  exports: [MealPlansService],
})
export class MealPlansModule {}
