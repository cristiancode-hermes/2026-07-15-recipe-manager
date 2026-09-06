import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipesController } from './recipes.controller.js';
import { RecipesService } from './recipes.service.js';
import { Recipe } from '../entities/recipe.entity.js';
import { Ingredient } from '../entities/ingredient.entity.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe, Ingredient]), AuthModule],
  controllers: [RecipesController],
  providers: [RecipesService],
  exports: [RecipesService],
})
export class RecipesModule {}
