import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Recipe } from '../../models';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Recipes</h1>
        @if (api.isLoggedIn()) {
          <a routerLink="/recipes/new" class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors no-underline">+ New Recipe</a>
        }
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-3 mb-6">
        <select [(ngModel)]="difficultyFilter" (change)="load()" class="bg-surface-700 text-white rounded-lg px-3 py-2 border border-surface-600 text-sm outline-none">
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <select [(ngModel)]="cuisineFilter" (change)="load()" class="bg-surface-700 text-white rounded-lg px-3 py-2 border border-surface-600 text-sm outline-none">
          <option value="">All Cuisines</option>
          <option value="Italian">Italian</option>
          <option value="Mexican">Mexican</option>
          <option value="Asian">Asian</option>
          <option value="American">American</option>
          <option value="Indian">Indian</option>
          <option value="Mediterranean">Mediterranean</option>
        </select>
      </div>

      @if (loading()) {
        <div class="text-center py-12 text-surface-400 animate-pulse">Loading recipes...</div>
      } @else if (error()) {
        <div class="text-center py-12 text-red-400">{{ error() }}</div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (recipe of recipes(); track recipe.id) {
            <a [routerLink]="['/recipes', recipe.id]" class="bg-surface-800 rounded-2xl overflow-hidden border border-surface-700 hover:border-primary-500/50 transition-all no-underline group">
              <div class="h-40 bg-gradient-to-br from-surface-700 to-surface-800 flex items-center justify-center">
                <span class="text-6xl opacity-30 group-hover:opacity-50 transition-opacity">
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
                    [class.text-red-300]="recipe.difficulty === 'hard'">{{ recipe.difficulty }}</span>
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
            <div class="col-span-full text-center py-12 text-surface-500">
              No recipes found matching your filters.
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: []
})
export class RecipesComponent {
  readonly api = inject(ApiService);
  readonly recipes = signal<Recipe[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  difficultyFilter = '';
  cuisineFilter = '';

  constructor() {
    this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const filters: any = {};
      if (this.difficultyFilter) filters.difficulty = this.difficultyFilter;
      if (this.cuisineFilter) filters.cuisine = this.cuisineFilter;
      this.recipes.set(await this.api.getRecipes(filters));
    } catch (e: any) {
      this.error.set(e.message || 'Failed to load recipes');
    } finally {
      this.loading.set(false);
    }
  }
}
