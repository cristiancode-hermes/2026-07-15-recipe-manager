import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MealPlan } from '../entities/meal-plan.entity.js';
import { MealPlanEntry } from '../entities/meal-plan-entry.entity.js';
import { CreateMealPlanDto } from './dto/create-meal-plan.dto.js';

@Injectable()
export class MealPlansService {
  constructor(
    @InjectRepository(MealPlan)
    private mealPlanRepository: Repository<MealPlan>,
    @InjectRepository(MealPlanEntry)
    private mealPlanEntryRepository: Repository<MealPlanEntry>,
  ) {}

  async findAll(userId: number) {
    return this.mealPlanRepository.find({
      where: { user: { id: userId } },
      relations: { entries: { recipe: true } },
    });
  }

  async findOne(id: number) {
    const mealPlan = await this.mealPlanRepository.findOne({
      where: { id },
      relations: { entries: { recipe: { ingredients: true } } },
    });
    if (!mealPlan) {
      throw new NotFoundException(`MealPlan #${id} not found`);
    }
    return mealPlan;
  }

  async create(dto: CreateMealPlanDto, userId: number) {
    const { entries, ...planData } = dto;

    const mealPlan = this.mealPlanRepository.create({
      ...planData,
      user: { id: userId },
    });
    const savedPlan = await this.mealPlanRepository.save(mealPlan);

    if (entries && entries.length > 0) {
      const entryEntities = entries.map((entry) =>
        this.mealPlanEntryRepository.create({
          dayOfWeek: entry.dayOfWeek,
          mealType: entry.mealType,
          recipe: { id: entry.recipeId },
          mealPlan: savedPlan,
        }),
      );
      await this.mealPlanEntryRepository.save(entryEntities);
    }

    return this.findOne(savedPlan.id);
  }

  async remove(id: number, userId: number) {
    const mealPlan = await this.mealPlanRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!mealPlan) {
      throw new NotFoundException(`MealPlan #${id} not found`);
    }
    await this.mealPlanRepository.remove(mealPlan);
    return { deleted: true };
  }
}
