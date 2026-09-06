import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoppingList } from '../entities/shopping-list.entity.js';
import { ShoppingListItem } from '../entities/shopping-list-item.entity.js';
import { MealPlan } from '../entities/meal-plan.entity.js';
import { MealPlanEntry } from '../entities/meal-plan-entry.entity.js';
import { Ingredient } from '../entities/ingredient.entity.js';

@Injectable()
export class ShoppingListsService {
  constructor(
    @InjectRepository(ShoppingList)
    private shoppingListRepository: Repository<ShoppingList>,
    @InjectRepository(ShoppingListItem)
    private shoppingListItemRepository: Repository<ShoppingListItem>,
    @InjectRepository(MealPlan)
    private mealPlanRepository: Repository<MealPlan>,
  ) {}

  async generateFromMealPlan(mealPlanId: number) {
    const mealPlan = await this.mealPlanRepository.findOne({
      where: { id: mealPlanId },
      relations: { entries: { recipe: { ingredients: true } } },
    });

    if (!mealPlan) {
      throw new NotFoundException(`MealPlan #${mealPlanId} not found`);
    }

    // Aggregate ingredients from all recipes in the meal plan
    const ingredientMap = new Map<
      string,
      { name: string; quantity: number; unit: string }
    >();

    for (const entry of mealPlan.entries) {
      if (!entry.recipe?.ingredients) continue;
      for (const ingredient of entry.recipe.ingredients) {
        const key = `${ingredient.name}|${ingredient.unit}`;
        const existing = ingredientMap.get(key);
        if (existing) {
          existing.quantity += ingredient.quantity;
        } else {
          ingredientMap.set(key, {
            name: ingredient.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
          });
        }
      }
    }

    const shoppingList = this.shoppingListRepository.create({
      generatedAt: new Date(),
      mealPlan: { id: mealPlanId },
    });
    const savedList = await this.shoppingListRepository.save(shoppingList);

    const items = Array.from(ingredientMap.values()).map((item) =>
      this.shoppingListItemRepository.create({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        checked: false,
        shoppingList: savedList,
      }),
    );
    await this.shoppingListItemRepository.save(items);

    return this.findOne(savedList.id);
  }

  async findOne(id: number) {
    const list = await this.shoppingListRepository.findOne({
      where: { id },
      relations: { items: true, mealPlan: true },
    });
    if (!list) {
      throw new NotFoundException(`ShoppingList #${id} not found`);
    }
    return list;
  }

  async findByMealPlan(mealPlanId: number) {
    return this.shoppingListRepository.find({
      where: { mealPlan: { id: mealPlanId } },
      relations: { items: true, mealPlan: true },
    });
  }

  async remove(id: number) {
    const list = await this.findOne(id);
    await this.shoppingListRepository.remove(list);
    return { deleted: true };
  }
}
