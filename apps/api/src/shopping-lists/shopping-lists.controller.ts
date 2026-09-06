import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ShoppingListsService } from './shopping-lists.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@ApiTags('Shopping Lists')
@Controller('shopping-lists')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ShoppingListsController {
  constructor(private shoppingListsService: ShoppingListsService) {}

  @Post('generate/:mealPlanId')
  @ApiOperation({ summary: 'Generate a shopping list from a meal plan' })
  async generate(@Param('mealPlanId') mealPlanId: string) {
    return this.shoppingListsService.generateFromMealPlan(+mealPlanId);
  }

  @Get('meal-plan/:mealPlanId')
  @ApiOperation({ summary: 'Get shopping lists by meal plan ID' })
  async findByMealPlan(@Param('mealPlanId') mealPlanId: string) {
    return this.shoppingListsService.findByMealPlan(+mealPlanId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a shopping list by ID' })
  async findOne(@Param('id') id: string) {
    return this.shoppingListsService.findOne(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a shopping list' })
  async remove(@Param('id') id: string) {
    return this.shoppingListsService.remove(+id);
  }
}
