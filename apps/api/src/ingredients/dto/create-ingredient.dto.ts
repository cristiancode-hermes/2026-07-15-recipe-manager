import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateIngredientDto {
  @ApiProperty({ example: 'Garlic' })
  @IsString()
  name: string;

  @ApiProperty({ example: 3 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 'cloves' })
  @IsString()
  unit: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  recipeId?: number;
}
