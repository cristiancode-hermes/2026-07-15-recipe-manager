export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Recipe {
  id: number;
  title: string;
  description: string;
  prepTime: number;
  cookTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine: string;
  servings: number;
  instructions: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  ingredients: Ingredient[];
}

export interface CreateRecipeDto {
  title: string;
  description: string;
  prepTime: number;
  cookTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine: string;
  servings: number;
  instructions: string;
  imageUrl?: string;
  ingredients: CreateIngredientDto[];
}

export interface UpdateRecipeDto extends Partial<CreateRecipeDto> {}

export interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  recipeId: number;
}

export interface CreateIngredientDto {
  name: string;
  quantity: number;
  unit: string;
}

export interface MealPlan {
  id: number;
  name: string;
  weekStart: string;
  createdAt: string;
  userId: number;
  entries: MealPlanEntry[];
}

export interface CreateMealPlanDto {
  name: string;
  weekStart: string;
  entries: CreateMealPlanEntryDto[];
}

export interface MealPlanEntry {
  id: number;
  dayOfWeek: number;
  mealType: string;
  recipeId: number;
  mealPlanId: number;
  recipe?: Recipe;
}

export interface CreateMealPlanEntryDto {
  dayOfWeek: number;
  mealType: string;
  recipeId: number;
}

export interface ShoppingList {
  id: number;
  mealPlanId: number;
  generatedAt: string;
  items: ShoppingListItem[];
}

export interface ShoppingListItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
  shoppingListId: number;
}
