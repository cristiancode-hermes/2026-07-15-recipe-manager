import {
  IsString,
  IsArray,
  IsInt,
  Min,
  Max,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class MealPlanEntryDto {
  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @ApiProperty({ example: 'dinner' })
  @IsString()
  mealType: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  recipeId: number;
}

export class CreateMealPlanDto {
  @ApiProperty({ example: 'Week 1 - Italian Feast' })
  @IsString()
  name: string;

  @ApiProperty({ example: '2026-07-20' })
  @IsString()
  weekStart: string;

  @ApiPropertyOptional({
    type: [MealPlanEntryDto],
    example: [
      { dayOfWeek: 0, mealType: 'dinner', recipeId: 1 },
      { dayOfWeek: 1, mealType: 'lunch', recipeId: 2 },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MealPlanEntryDto)
  entries?: MealPlanEntryDto[];
}
