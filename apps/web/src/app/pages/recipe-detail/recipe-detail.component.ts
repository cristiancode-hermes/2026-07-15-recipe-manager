import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Recipe } from '../../models';
import { DatePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, TitleCasePipe],
  template: `
    @if (loading()) {
      <div class="text-center py-12 text-surface-400 animate-pulse">Loading recipe...</div>
    } @else if (error()) {
      <div class="text-center py-12 text-red-400">{{ error() }}</div>
    } @else if (recipe(); as r) {
      <div class="max-w-4xl mx-auto">
        <a routerLink="/recipes" class="text-primary-400 hover:text-primary-300 mb-4 inline-block no-underline">← Back to Recipes</a>

        <div class="bg-surface-800 rounded-2xl border border-surface-700 overflow-hidden">
          <div class="h-48 bg-gradient-to-br from-primary-900 via-surface-800 to-surface-800 flex items-center justify-center">
            <span class="text-8xl opacity-40">
              {{ r.cuisine === 'Italian' ? '🍝' : r.cuisine === 'Mexican' ? '🌮' : r.cuisine === 'Asian' ? '🍜' : r.cuisine === 'American' ? '🍔' : '🍽️' }}
            </span>
          </div>
          <div class="p-6 md:p-8">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h1 class="text-3xl font-bold text-white mb-2">{{ r.title }}</h1>
                <div class="flex items-center gap-3">
                  <span class="text-xs font-medium px-2 py-0.5 rounded-full"
                    [class.bg-green-900]="r.difficulty === 'easy'"
                    [class.bg-yellow-900]="r.difficulty === 'medium'"
                    [class.bg-red-900]="r.difficulty === 'hard'"
                    [class.text-green-300]="r.difficulty === 'easy'"
                    [class.text-yellow-300]="r.difficulty === 'medium'"
                    [class.text-red-300]="r.difficulty === 'hard'">{{ r.difficulty }}</span>
                  <span class="text-surface-400">{{ r.cuisine }} Cuisine</span>
                </div>
              </div>
              @if (api.isLoggedIn()) {
                <a [routerLink]="['/recipes', r.id, 'edit']" class="bg-surface-700 hover:bg-surface-600 text-white px-4 py-2 rounded-lg text-sm transition-colors no-underline">Edit</a>
              }
            </div>

            <p class="text-surface-300 mb-6">{{ r.description }}</p>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-4 mb-6">
              <div class="bg-surface-700/50 rounded-xl p-4 text-center">
                <div class="text-surface-400 text-xs uppercase tracking-wide">Prep Time</div>
                <div class="text-white font-bold text-xl">{{ r.prepTime }}m</div>
              </div>
              <div class="bg-surface-700/50 rounded-xl p-4 text-center">
                <div class="text-surface-400 text-xs uppercase tracking-wide">Cook Time</div>
                <div class="text-white font-bold text-xl">{{ r.cookTime }}m</div>
              </div>
              <div class="bg-surface-700/50 rounded-xl p-4 text-center">
                <div class="text-surface-400 text-xs uppercase tracking-wide">Servings</div>
                <div class="text-white font-bold text-xl">{{ r.servings }}</div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Ingredients -->
              <div>
                <h2 class="text-xl font-semibold text-white mb-4">🧂 Ingredients</h2>
                <ul class="space-y-2">
                  @for (ing of r.ingredients; track ing.id) {
                    <li class="flex items-center gap-3 text-surface-300">
                      <span class="w-2 h-2 rounded-full bg-primary-500"></span>
                      <span>{{ ing.quantity }} {{ ing.unit }} — {{ ing.name }}</span>
                    </li>
                  }
                </ul>
              </div>

              <!-- Instructions -->
              <div>
                <h2 class="text-xl font-semibold text-white mb-4">📝 Instructions</h2>
                <div class="text-surface-300 whitespace-pre-line leading-relaxed">{{ r.instructions }}</div>
              </div>
            </div>

            <div class="text-surface-500 text-xs mt-8 pt-4 border-t border-surface-700">
              Added {{ r.createdAt | date:'mediumDate' }}
              @if (r.updatedAt !== r.createdAt) {
                · Updated {{ r.updatedAt | date:'mediumDate' }}
              }
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: []
})
export class RecipeDetailComponent {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  readonly recipe = signal<Recipe | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.recipe.set(await this.api.getRecipe(id));
    } catch (e: any) {
      this.error.set(e.message || 'Failed to load recipe');
    } finally {
      this.loading.set(false);
    }
  }
}
