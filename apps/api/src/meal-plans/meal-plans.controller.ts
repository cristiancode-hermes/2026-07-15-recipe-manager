import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { MealPlansService } from './meal-plans.service.js';
import type { CreateMealPlanDto } from './dto/create-meal-plan.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@ApiTags('Meal Plans')
@Controller('meal-plans')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MealPlansController {
  constructor(private mealPlansService: MealPlansService) {}

  @Get()
  @ApiOperation({ summary: 'Get all meal plans for the current user' })
  async findAll(@Req() req: Request) {
    const user = req.user as { id: number };
    return this.mealPlansService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a meal plan by ID' })
  async findOne(@Param('id') id: string) {
    return this.mealPlansService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new meal plan' })
  async create(@Body() dto: CreateMealPlanDto, @Req() req: Request) {
    const user = req.user as { id: number };
    return this.mealPlansService.create(dto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a meal plan' })
  async remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as { id: number };
    return this.mealPlansService.remove(+id, user.id);
  }
}
