import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module.js';
import { RecipesModule } from './recipes/recipes.module.js';
import { IngredientsModule } from './ingredients/ingredients.module.js';
import { MealPlansModule } from './meal-plans/meal-plans.module.js';
import { ShoppingListsModule } from './shopping-lists/shopping-lists.module.js';
import { SeedModule } from './seed/seed.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'better-sqlite3',
        database: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    AuthModule,
    RecipesModule,
    IngredientsModule,
    MealPlansModule,
    ShoppingListsModule,
    SeedModule,
  ],
})
export class AppModule {}
