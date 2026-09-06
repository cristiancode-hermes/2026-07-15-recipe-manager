import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'recipes', loadComponent: () => import('./pages/recipes/recipes.component').then(m => m.RecipesComponent) },
  { path: 'recipes/new', loadComponent: () => import('./pages/recipe-form/recipe-form.component').then(m => m.RecipeFormComponent) },
  { path: 'recipes/:id', loadComponent: () => import('./pages/recipe-detail/recipe-detail.component').then(m => m.RecipeDetailComponent) },
  { path: 'recipes/:id/edit', loadComponent: () => import('./pages/recipe-form/recipe-form.component').then(m => m.RecipeFormComponent) },
  { path: 'meal-plans', loadComponent: () => import('./pages/meal-plans/meal-plans.component').then(m => m.MealPlansComponent) },
  { path: 'meal-plans/new', loadComponent: () => import('./pages/meal-plan-form/meal-plan-form.component').then(m => m.MealPlanFormComponent) },
  { path: 'meal-plans/:id', loadComponent: () => import('./pages/meal-plans/meal-plans.component').then(m => m.MealPlansComponent) },
  { path: 'shopping-list/:mealPlanId', loadComponent: () => import('./pages/shopping-list/shopping-list.component').then(m => m.ShoppingListComponent) },
  { path: '**', redirectTo: '' },
];
