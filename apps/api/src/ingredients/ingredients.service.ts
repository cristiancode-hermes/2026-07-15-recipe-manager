import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingredient } from '../entities/ingredient.entity.js';
import { CreateIngredientDto } from './dto/create-ingredient.dto.js';
import { UpdateIngredientDto } from './dto/update-ingredient.dto.js';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
  ) {}

  async findByRecipe(recipeId: number) {
    return this.ingredientRepository.find({
      where: { recipe: { id: recipeId } },
      relations: { recipe: true },
    });
  }

  async findOne(id: number) {
    const ingredient = await this.ingredientRepository.findOne({
      where: { id },
      relations: { recipe: true },
    });
    if (!ingredient) {
      throw new NotFoundException(`Ingredient #${id} not found`);
    }
    return ingredient;
  }

  async create(dto: CreateIngredientDto) {
    const ingredient = this.ingredientRepository.create({
      name: dto.name,
      quantity: dto.quantity,
      unit: dto.unit,
      recipe: dto.recipeId ? { id: dto.recipeId } : undefined,
    });
    return this.ingredientRepository.save(ingredient);
  }

  async update(id: number, dto: UpdateIngredientDto) {
    const ingredient = await this.findOne(id);
    Object.assign(ingredient, dto);
    return this.ingredientRepository.save(ingredient);
  }

  async remove(id: number) {
    const ingredient = await this.findOne(id);
    await this.ingredientRepository.remove(ingredient);
    return { deleted: true };
  }
}
