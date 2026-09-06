import { IsString, IsInt, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRecipeDto {
  @ApiProperty({ example: 'Spaghetti Carbonara' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'A classic Italian pasta dish' })
  @IsString()
  description: string;

  @ApiProperty({ example: 15 })
  @IsInt()
  @Min(0)
  prepTime: number;

  @ApiProperty({ example: 20 })
  @IsInt()
  @Min(0)
  cookTime: number;

  @ApiProperty({ enum: ['easy', 'medium', 'hard'], example: 'easy' })
  @IsString()
  difficulty: 'easy' | 'medium' | 'hard';

  @ApiProperty({ example: 'Italian' })
  @IsString()
  cuisine: string;

  @ApiProperty({ example: 4 })
  @IsInt()
  @Min(1)
  servings: number;

  @ApiProperty({ example: '1. Boil water...' })
  @IsString()
  instructions: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({
    type: 'array',
    example: [
      { name: 'Spaghetti', quantity: 400, unit: 'g' },
      { name: 'Eggs', quantity: 4, unit: 'pieces' },
    ],
  })
  @IsOptional()
  ingredients?: { name: string; quantity: number; unit: string }[];
}
