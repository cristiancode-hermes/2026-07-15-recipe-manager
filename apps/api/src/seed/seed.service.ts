import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'node:crypto';
import { User } from '../entities/user.entity.js';
import { Recipe } from '../entities/recipe.entity.js';
import { Ingredient } from '../entities/ingredient.entity.js';
import { MealPlan } from '../entities/meal-plan.entity.js';
import { MealPlanEntry } from '../entities/meal-plan-entry.entity.js';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
    @InjectRepository(MealPlan)
    private mealPlanRepository: Repository<MealPlan>,
    @InjectRepository(MealPlanEntry)
    private mealPlanEntryRepository: Repository<MealPlanEntry>,
  ) {}

  async seed() {
    const existing = await this.userRepository.findOne({
      where: { email: 'test@example.com' },
    });
    if (existing) {
      console.log('Database already seeded');
      return;
    }

    // Create test user
    const hashedPassword = crypto
      .createHash('sha256')
      .update('password123')
      .digest('hex');
    const user = this.userRepository.create({
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
    });
    await this.userRepository.save(user);

    // Recipes data
    const recipesData = [
      {
        title: 'Spaghetti Carbonara',
        description:
          'A classic Roman pasta dish made with eggs, cheese, pancetta, and pepper.',
        prepTime: 10,
        cookTime: 20,
        difficulty: 'medium' as const,
        cuisine: 'Italian',
        servings: 4,
        instructions:
          '1. Boil pasta in salted water until al dente.\n2. While pasta cooks, fry pancetta until crispy.\n3. Beat eggs with grated Pecorino Romano and black pepper.\n4. Toss hot pasta with pancetta, then quickly stir in egg mixture.\n5. Serve immediately with extra cheese.',
        ingredients: [
          { name: 'Spaghetti', quantity: 400, unit: 'g' },
          { name: 'Pancetta', quantity: 200, unit: 'g' },
          { name: 'Eggs', quantity: 4, unit: 'pieces' },
          { name: 'Pecorino Romano', quantity: 100, unit: 'g' },
          { name: 'Black Pepper', quantity: 2, unit: 'tsp' },
          { name: 'Salt', quantity: 1, unit: 'tsp' },
        ],
      },
      {
        title: 'Chicken Tikka Masala',
        description:
          'Chunks of roasted marinated chicken in a spiced curry sauce.',
        prepTime: 30,
        cookTime: 40,
        difficulty: 'medium' as const,
        cuisine: 'Indian',
        servings: 6,
        instructions:
          '1. Marinate chicken in yogurt and spices for 2 hours.\n2. Grill or bake chicken until charred.\n3. Sauté onions, garlic, and ginger. Add tomato puree and spices.\n4. Simmer sauce, add cream and butter.\n5. Add chicken pieces and simmer for 10 minutes.\n6. Serve with basmati rice and naan.',
        ingredients: [
          { name: 'Chicken Breast', quantity: 800, unit: 'g' },
          { name: 'Yogurt', quantity: 200, unit: 'ml' },
          { name: 'Heavy Cream', quantity: 200, unit: 'ml' },
          { name: 'Tomato Puree', quantity: 400, unit: 'g' },
          { name: 'Onion', quantity: 2, unit: 'pieces' },
          { name: 'Garlic Cloves', quantity: 4, unit: 'pieces' },
          { name: 'Ginger', quantity: 30, unit: 'g' },
          { name: 'Garam Masala', quantity: 2, unit: 'tbsp' },
          { name: 'Butter', quantity: 50, unit: 'g' },
          { name: 'Basmati Rice', quantity: 400, unit: 'g' },
        ],
      },
      {
        title: 'Pad Thai',
        description:
          'Stir-fried rice noodles with shrimp, peanuts, and tamarind sauce.',
        prepTime: 20,
        cookTime: 15,
        difficulty: 'medium' as const,
        cuisine: 'Thai',
        servings: 4,
        instructions:
          '1. Soak rice noodles in warm water for 30 minutes.\n2. Make sauce: tamarind paste, fish sauce, sugar, and lime juice.\n3. Stir-fry shrimp until pink, set aside.\n4. Scramble eggs in the wok. Add noodles and sauce.\n5. Toss with bean sprouts, peanuts, and green onions.\n6. Serve with lime wedges and chili flakes.',
        ingredients: [
          { name: 'Rice Noodles', quantity: 250, unit: 'g' },
          { name: 'Shrimp', quantity: 300, unit: 'g' },
          { name: 'Eggs', quantity: 2, unit: 'pieces' },
          { name: 'Tamarind Paste', quantity: 3, unit: 'tbsp' },
          { name: 'Fish Sauce', quantity: 3, unit: 'tbsp' },
          { name: 'Palm Sugar', quantity: 2, unit: 'tbsp' },
          { name: 'Bean Sprouts', quantity: 150, unit: 'g' },
          { name: 'Peanuts (crushed)', quantity: 60, unit: 'g' },
          { name: 'Lime', quantity: 2, unit: 'pieces' },
        ],
      },
      {
        title: 'Classic Cheeseburger',
        description:
          'Juicy beef patty with melted cheddar, lettuce, tomato, and special sauce.',
        prepTime: 15,
        cookTime: 10,
        difficulty: 'easy' as const,
        cuisine: 'American',
        servings: 4,
        instructions:
          '1. Form ground beef into 4 patties, season with salt and pepper.\n2. Grill or pan-fry patties for 4 minutes each side.\n3. Top with cheddar cheese, cover to melt.\n4. Toast buns on the grill.\n5. Assemble: bun, sauce, lettuce, patty, tomato, pickles, onion.\n6. Serve with fries.',
        ingredients: [
          { name: 'Ground Beef', quantity: 500, unit: 'g' },
          { name: 'Cheddar Cheese', quantity: 4, unit: 'slices' },
          { name: 'Burger Buns', quantity: 4, unit: 'pieces' },
          { name: 'Lettuce', quantity: 4, unit: 'leaves' },
          { name: 'Tomato', quantity: 2, unit: 'pieces' },
          { name: 'Pickles', quantity: 8, unit: 'slices' },
          { name: 'Onion', quantity: 1, unit: 'pieces' },
          { name: 'Ketchup', quantity: 2, unit: 'tbsp' },
        ],
      },
      {
        title: 'Sushi Bowl',
        description:
          'Deconstructed sushi with seasoned rice, fresh fish, and toppings.',
        prepTime: 30,
        cookTime: 20,
        difficulty: 'hard' as const,
        cuisine: 'Japanese',
        servings: 2,
        instructions:
          '1. Cook sushi rice and season with rice vinegar, sugar, and salt.\n2. Slice salmon and tuna into thin pieces.\n3. Slice avocado, cucumber, and mango.\n4. Arrange rice in bowls, top with fish and vegetables.\n5. Drizzle with soy sauce and sesame oil.\n6. Garnish with nori strips, sesame seeds, and pickled ginger.',
        ingredients: [
          { name: 'Sushi Rice', quantity: 300, unit: 'g' },
          { name: 'Rice Vinegar', quantity: 3, unit: 'tbsp' },
          { name: 'Salmon (sashimi grade)', quantity: 150, unit: 'g' },
          { name: 'Tuna (sashimi grade)', quantity: 150, unit: 'g' },
          { name: 'Avocado', quantity: 1, unit: 'pieces' },
          { name: 'Cucumber', quantity: 1, unit: 'pieces' },
          { name: 'Nori Sheets', quantity: 3, unit: 'pieces' },
          { name: 'Soy Sauce', quantity: 2, unit: 'tbsp' },
          { name: 'Sesame Seeds', quantity: 1, unit: 'tbsp' },
        ],
      },
      {
        title: 'Tacos al Pastor',
        description:
          'Marinated pork tacos with pineapple, cilantro, and onion.',
        prepTime: 120,
        cookTime: 20,
        difficulty: 'hard' as const,
        cuisine: 'Mexican',
        servings: 6,
        instructions:
          '1. Marinate pork shoulder in adobo sauce, achiote, and pineapple juice overnight.\n2. Grill or roast pork until charred and cooked through.\n3. Dice grilled pineapple.\n4. Warm corn tortillas on a comal.\n5. Chop pork into small pieces.\n6. Assemble tacos with pork, pineapple, cilantro, and onion.\n7. Serve with salsa verde and lime wedges.',
        ingredients: [
          { name: 'Pork Shoulder', quantity: 800, unit: 'g' },
          { name: 'Pineapple', quantity: 200, unit: 'g' },
          { name: 'Corn Tortillas', quantity: 12, unit: 'pieces' },
          { name: 'Achiote Paste', quantity: 3, unit: 'tbsp' },
          { name: 'White Onion', quantity: 1, unit: 'pieces' },
          { name: 'Fresh Cilantro', quantity: 30, unit: 'g' },
          { name: 'Lime', quantity: 3, unit: 'pieces' },
          { name: 'Salsa Verde', quantity: 200, unit: 'ml' },
        ],
      },
      {
        title: 'Miso Ramen',
        description:
          'Rich miso-based ramen with soft-boiled egg, chashu pork, and toppings.',
        prepTime: 30,
        cookTime: 60,
        difficulty: 'hard' as const,
        cuisine: 'Japanese',
        servings: 4,
        instructions:
          '1. Prepare broth: simmer chicken stock with kombu and bonito flakes.\n2. Sauté garlic, ginger, and miso paste. Add broth.\n3. Cook ramen noodles according to package.\n4. Slice chashu pork and soft-boil eggs.\n5. Assemble bowls: broth, noodles, pork, egg halves, nori, green onions.\n6. Drizzle with chili oil and sesame seeds.',
        ingredients: [
          { name: 'Ramen Noodles', quantity: 400, unit: 'g' },
          { name: 'Chicken Stock', quantity: 1.5, unit: 'L' },
          { name: 'White Miso Paste', quantity: 4, unit: 'tbsp' },
          { name: 'Chashu Pork', quantity: 300, unit: 'g' },
          { name: 'Eggs', quantity: 4, unit: 'pieces' },
          { name: 'Garlic Cloves', quantity: 3, unit: 'pieces' },
          { name: 'Ginger', quantity: 20, unit: 'g' },
          { name: 'Green Onions', quantity: 4, unit: 'pieces' },
          { name: 'Nori Sheets', quantity: 4, unit: 'pieces' },
          { name: 'Sesame Oil', quantity: 1, unit: 'tbsp' },
        ],
      },
      {
        title: 'Caprese Salad',
        description:
          'Simple Italian salad with fresh mozzarella, tomatoes, and basil.',
        prepTime: 10,
        cookTime: 0,
        difficulty: 'easy' as const,
        cuisine: 'Italian',
        servings: 4,
        instructions:
          '1. Slice tomatoes and fresh mozzarella into even rounds.\n2. Arrange alternating on a plate.\n3. Tuck fresh basil leaves between slices.\n4. Drizzle with extra virgin olive oil and balsamic reduction.\n5. Season with flaky salt and black pepper.\n6. Serve at room temperature.',
        ingredients: [
          { name: 'Tomatoes', quantity: 4, unit: 'pieces' },
          { name: 'Fresh Mozzarella', quantity: 250, unit: 'g' },
          { name: 'Fresh Basil', quantity: 20, unit: 'leaves' },
          { name: 'Extra Virgin Olive Oil', quantity: 3, unit: 'tbsp' },
          { name: 'Balsamic Reduction', quantity: 2, unit: 'tbsp' },
          { name: 'Flaky Salt', quantity: 1, unit: 'tsp' },
          { name: 'Black Pepper', quantity: 0.5, unit: 'tsp' },
        ],
      },
    ];

    // Save all recipes with ingredients
    const savedRecipes: Recipe[] = [];
    for (const data of recipesData) {
      const { ingredients, ...recipeData } = data;
      const recipe = this.recipeRepository.create({
        ...recipeData,
        user,
      });
      const savedRecipe = await this.recipeRepository.save(recipe);

      const ingredientEntities = ingredients.map((ing) =>
        this.ingredientRepository.create({
          ...ing,
          recipe: savedRecipe,
        }),
      );
      await this.ingredientRepository.save(ingredientEntities);
      savedRecipes.push(savedRecipe);
    }

    // Create a meal plan with some entries
    const mealPlan = this.mealPlanRepository.create({
      name: 'Week 1 - Global Flavors',
      weekStart: '2026-07-20',
      user,
    });
    await this.mealPlanRepository.save(mealPlan);

    const entriesData = [
      { dayOfWeek: 0, mealType: 'dinner', recipe: savedRecipes[0] }, // Sunday - Carbonara
      { dayOfWeek: 1, mealType: 'dinner', recipe: savedRecipes[1] }, // Monday - Tikka Masala
      { dayOfWeek: 2, mealType: 'dinner', recipe: savedRecipes[2] }, // Tuesday - Pad Thai
      { dayOfWeek: 3, mealType: 'dinner', recipe: savedRecipes[3] }, // Wednesday - Cheeseburger
      { dayOfWeek: 4, mealType: 'dinner', recipe: savedRecipes[6] }, // Thursday - Ramen
      { dayOfWeek: 5, mealType: 'dinner', recipe: savedRecipes[4] }, // Friday - Sushi Bowl
      { dayOfWeek: 6, mealType: 'lunch', recipe: savedRecipes[7] }, // Saturday lunch - Caprese
      { dayOfWeek: 6, mealType: 'dinner', recipe: savedRecipes[5] }, // Saturday dinner - Tacos
    ];

    for (const entryData of entriesData) {
      const entry = this.mealPlanEntryRepository.create({
        ...entryData,
        mealPlan,
      });
      await this.mealPlanEntryRepository.save(entry);
    }

    console.log('Database seeded successfully');
  }
}
