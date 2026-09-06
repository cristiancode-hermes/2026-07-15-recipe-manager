import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';
import { RecipesService } from './recipes.service.js';
import type { CreateRecipeDto } from './dto/create-recipe.dto.js';
import type { UpdateRecipeDto } from './dto/update-recipe.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@ApiTags('Recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private recipesService: RecipesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all recipes (public)' })
  @ApiQuery({ name: 'difficulty', required: false })
  @ApiQuery({ name: 'cuisine', required: false })
  async findAll(
    @Query('difficulty') difficulty?: string,
    @Query('cuisine') cuisine?: string,
  ) {
    return this.recipesService.findAll(difficulty, cuisine);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a recipe by ID (public)' })
  async findOne(@Param('id') id: string) {
    return this.recipesService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new recipe' })
  async create(@Body() dto: CreateRecipeDto, @Req() req: Request) {
    const user = req.user as { id: number };
    return this.recipesService.create(dto, user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a recipe' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRecipeDto,
    @Req() req: Request,
  ) {
    const user = req.user as { id: number };
    return this.recipesService.update(+id, dto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a recipe' })
  async remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as { id: number };
    return this.recipesService.remove(+id, user.id);
  }
}
