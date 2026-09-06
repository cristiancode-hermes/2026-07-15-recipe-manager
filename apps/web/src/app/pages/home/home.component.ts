import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Recipe } from '../../models';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="space-y-12">
      <!-- Hero -->
      <div class="text-center py-12">
        <h1 class="text-5xl font-bold text-white mb-4">Your Personal <span class="text-primary-400">Recipe Manager</span></h1>
        <p class="text-xl text-surface-400 max-w-2xl mx-auto">Plan your meals, organize recipes, and generate shopping lists — all in one place.</p>
        <div class="flex justify-center gap-4 mt-8">
          <a routerLink="/recipes" class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-colors no-underline">Browse Recipes</a>
          <a routerLink="/meal-plans" class="bg-surface-700 hover:bg-surface-600 text-white px-6 py-3 rounded-xl font-medium transition-colors no-underline">Plan Meals</a>
        </div>
      </div>

      <!-- Features -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-surface-800 rounded-2xl p-6 border border-surface-700">
          <div class="text-4xl mb-4">📖</div>
          <h3 class="text-lg font-semibold text-white mb-2">Recipe Collection</h3>
          <p class="text-surface-400">Store all your favorite recipes with ingredients, instructions, and difficulty ratings.</p>
        </div>
        <div class="bg-surface-800 rounded-2xl p-6 border border-surface-700">
          <div class="text-4xl mb-4">📅</div>
          <h3 class="text-lg font-semibold text-white mb-2">Weekly Meal Plans</h3>
          <p class="text-surface-400">Plan your breakfast, lunch, and dinner for the whole week with ease.</p>
        </div>
        <div class="bg-surface-800 rounded-2xl p-6 border border-surface-700">
          <div class="text-4xl mb-4">🛒</div>
          <h3 class="text-lg font-semibold text-white mb-2">Smart Shopping Lists</h3>
          <p class="text-surface-400">Auto-generate shopping lists from your meal plans — never forget an ingredient.</p>
        </div>
      </div>

      <!-- Latest Recipes -->
      @if (loading()) {
        <div class="text-center py-8 text-surface-400 animate-pulse">Loading recipes...</div>
      } @else if (error()) {
        <div class="text-center py-8 text-red-400">{{ error() }}</div>
      } @else {
        <div>
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-white">Latest Recipes</h2>
            <a routerLink="/recipes" class="text-primary-400 hover:text-primary-300 transition-colors no-underline">View all →</a>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (recipe of recipes(); track recipe.id) {
              <a [routerLink]="['/recipes', recipe.id]" class="bg-surface-800 rounded-2xl overflow-hidden border border-surface-700 hover:border-primary-500/50 transition-all no-underline group">
                <div class="h-40 bg-gradient-to-br from-primary-900 to-surface-800 flex items-center justify-center">
                  <span class="text-6xl opacity-50 group-hover:opacity-75 transition-opacity">
                    {{ recipe.cuisine === 'Italian' ? '🍝' : recipe.cuisine === 'Mexican' ? '🌮' : recipe.cuisine === 'Asian' ? '🍜' : recipe.cuisine === 'American' ? '🍔' : '🍽️' }}
                  </span>
                </div>
                <div class="p-5">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-xs font-medium px-2 py-0.5 rounded-full"
                      [class.bg-green-900]="recipe.difficulty === 'easy'"
                      [class.bg-yellow-900]="recipe.difficulty === 'medium'"
                      [class.bg-red-900]="recipe.difficulty === 'hard'"
                      [class.text-green-300]="recipe.difficulty === 'easy'"
                      [class.text-yellow-300]="recipe.difficulty === 'medium'"
                      [class.text-red-300]="recipe.difficulty === 'hard'">
                      {{ recipe.difficulty }}
                    </span>
                    <span class="text-surface-500 text-xs">{{ recipe.cuisine }}</span>
                  </div>
                  <h3 class="text-white font-semibold text-lg mb-1">{{ recipe.title }}</h3>
                  <p class="text-surface-400 text-sm line-clamp-2">{{ recipe.description }}</p>
                  <div class="flex items-center gap-4 mt-3 text-surface-500 text-xs">
                    <span>⏱ {{ recipe.prepTime + recipe.cookTime }} min</span>
                    <span>👤 {{ recipe.servings }} servings</span>
                  </div>
                </div>
              </a>
            } @empty {
              <div class="col-span-full text-center py-8 text-surface-500">
                No recipes yet. <a routerLink="/recipes/new" class="text-primary-400 hover:underline">Create the first one!</a>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class HomeComponent {
  private readonly api = inject(ApiService);
  readonly recipes = signal<Recipe[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      this.recipes.set(await this.api.getRecipes());
    } catch (e: any) {
      this.error.set(e.message || 'Failed to load recipes');
    } finally {
      this.loading.set(false);
    }
  }
}
