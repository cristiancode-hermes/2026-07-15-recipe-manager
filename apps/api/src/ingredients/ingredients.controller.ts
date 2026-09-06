import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IngredientsService } from './ingredients.service.js';
import type { CreateIngredientDto } from './dto/create-ingredient.dto.js';
import type { UpdateIngredientDto } from './dto/update-ingredient.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@ApiTags('Ingredients')
@Controller('ingredients')
export class IngredientsController {
  constructor(private ingredientsService: IngredientsService) {}

  @Get('recipe/:recipeId')
  @ApiOperation({ summary: 'Get ingredients for a recipe (public)' })
  async findByRecipe(@Param('recipeId') recipeId: string) {
    return this.ingredientsService.findByRecipe(+recipeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an ingredient by ID (public)' })
  async findOne(@Param('id') id: string) {
    return this.ingredientsService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create an ingredient' })
  async create(@Body() dto: CreateIngredientDto) {
    return this.ingredientsService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an ingredient' })
  async update(@Param('id') id: string, @Body() dto: UpdateIngredientDto) {
    return this.ingredientsService.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an ingredient' })
  async remove(@Param('id') id: string) {
    return this.ingredientsService.remove(+id);
  }
}
