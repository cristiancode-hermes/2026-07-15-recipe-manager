import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from '../entities/recipe.entity.js';
import { Ingredient } from '../entities/ingredient.entity.js';
import { CreateRecipeDto } from './dto/create-recipe.dto.js';
import { UpdateRecipeDto } from './dto/update-recipe.dto.js';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
  ) {}

  async findAll(difficulty?: string, cuisine?: string) {
    const where: Record<string, string> = {};
    if (difficulty) where.difficulty = difficulty;
    if (cuisine) where.cuisine = cuisine;

    return this.recipeRepository.find({
      where: Object.keys(where).length ? where : undefined,
      relations: ['ingredients', 'user'],
    });
  }

  async findOne(id: number) {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: ['ingredients', 'user'],
    });
    if (!recipe) {
      throw new NotFoundException(`Recipe #${id} not found`);
    }
    return recipe;
  }

  async create(dto: CreateRecipeDto, userId: number) {
    const { ingredients, ...recipeData } = dto;

    const recipe = this.recipeRepository.create({
      ...recipeData,
      user: { id: userId },
    });
    const savedRecipe = await this.recipeRepository.save(recipe);

    if (ingredients && ingredients.length > 0) {
      const ingredientEntities = ingredients.map((ing) =>
        this.ingredientRepository.create({
          ...ing,
          recipe: savedRecipe,
        }),
      );
      await this.ingredientRepository.save(ingredientEntities);
    }

    return this.findOne(savedRecipe.id);
  }

  async update(id: number, dto: UpdateRecipeDto, userId: number) {
    const recipe = await this.findOne(id);
    if (recipe.user?.id !== userId) {
      throw new ForbiddenException('You can only update your own recipes');
    }

    const { ingredients, ...recipeData } = dto;

    await this.recipeRepository.update(id, recipeData);

    if (ingredients) {
      await this.ingredientRepository.delete({ recipe: { id } });
      const ingredientEntities = ingredients.map((ing) =>
        this.ingredientRepository.create({
          ...ing,
          recipe: { id },
        }),
      );
      await this.ingredientRepository.save(ingredientEntities);
    }

    return this.findOne(id);
  }

  async remove(id: number, userId: number) {
    const recipe = await this.findOne(id);
    if (recipe.user?.id !== userId) {
      throw new ForbiddenException('You can only delete your own recipes');
    }
    await this.recipeRepository.remove(recipe);
    return { deleted: true };
  }
}
