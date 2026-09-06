import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Recipe, Ingredient } from '../../models';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="max-w-3xl mx-auto">
      <a routerLink="/recipes" class="text-primary-400 hover:text-primary-300 mb-4 inline-block no-underline">← Back to Recipes</a>
      <h1 class="text-3xl font-bold text-white mb-8">{{ isEdit ? 'Edit Recipe' : 'New Recipe' }}</h1>

      @if (submitError()) {
        <div class="bg-red-900/50 text-red-300 px-4 py-3 rounded-lg mb-6">{{ submitError() }}</div>
      }

      <form (ngSubmit)="onSubmit()" class="space-y-6">
        <div class="bg-surface-800 rounded-2xl p-6 border border-surface-700 space-y-4">
          <h2 class="text-lg font-semibold text-white">Basic Info</h2>
          <div>
            <label class="block text-surface-400 text-sm mb-1">Title *</label>
            <input [(ngModel)]="title" name="title" required class="w-full bg-surface-700 text-white rounded-lg px-4 py-2.5 border border-surface-600 focus:border-primary-500 outline-none" />
          </div>
          <div>
            <label class="block text-surface-400 text-sm mb-1">Description</label>
            <textarea [(ngModel)]="description" name="description" rows="3" class="w-full bg-surface-700 text-white rounded-lg px-4 py-2.5 border border-surface-600 focus:border-primary-500 outline-none"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-surface-400 text-sm mb-1">Prep Time (min)</label>
              <input [(ngModel)]="prepTime" name="prepTime" type="number" class="w-full bg-surface-700 text-white rounded-lg px-4 py-2.5 border border-surface-600 focus:border-primary-500 outline-none" />
            </div>
            <div>
              <label class="block text-surface-400 text-sm mb-1">Cook Time (min)</label>
              <input [(ngModel)]="cookTime" name="cookTime" type="number" class="w-full bg-surface-700 text-white rounded-lg px-4 py-2.5 border border-surface-600 focus:border-primary-500 outline-none" />
            </div>
            <div>
              <label class="block text-surface-400 text-sm mb-1">Difficulty</label>
              <select [(ngModel)]="difficulty" name="difficulty" class="w-full bg-surface-700 text-white rounded-lg px-4 py-2.5 border border-surface-600 focus:border-primary-500 outline-none">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label class="block text-surface-400 text-sm mb-1">Cuisine</label>
              <select [(ngModel)]="cuisine" name="cuisine" class="w-full bg-surface-700 text-white rounded-lg px-4 py-2.5 border border-surface-600 focus:border-primary-500 outline-none">
                <option value="Italian">Italian</option>
                <option value="Mexican">Mexican</option>
                <option value="Asian">Asian</option>
                <option value="American">American</option>
                <option value="Indian">Indian</option>
                <option value="Mediterranean">Mediterranean</option>
              </select>
            </div>
            <div>
              <label class="block text-surface-400 text-sm mb-1">Servings</label>
              <input [(ngModel)]="servings" name="servings" type="number" class="w-full bg-surface-700 text-white rounded-lg px-4 py-2.5 border border-surface-600 focus:border-primary-500 outline-none" />
            </div>
          </div>
        </div>

        <!-- Ingredients -->
        <div class="bg-surface-800 rounded-2xl p-6 border border-surface-700 space-y-4">
          <h2 class="text-lg font-semibold text-white">Ingredients</h2>
          @for (ing of ingredients; track i; let i = $index) {
            <div class="flex gap-2 items-start">
              <input [(ngModel)]="ing.name" [name]="'ing_name_' + i" placeholder="Ingredient" class="flex-1 bg-surface-700 text-white rounded-lg px-3 py-2 border border-surface-600 focus:border-primary-500 outline-none text-sm" />
              <input [(ngModel)]="ing.quantity" [name]="'ing_qty_' + i" type="number" step="0.25" placeholder="Qty" class="w-20 bg-surface-700 text-white rounded-lg px-3 py-2 border border-surface-600 focus:border-primary-500 outline-none text-sm" />
              <input [(ngModel)]="ing.unit" [name]="'ing_unit_' + i" placeholder="Unit" class="w-24 bg-surface-700 text-white rounded-lg px-3 py-2 border border-surface-600 focus:border-primary-500 outline-none text-sm" />
              <button type="button" (click)="removeIngredient(i)" class="text-red-400 hover:text-red-300 p-2 bg-transparent border-none cursor-pointer">✕</button>
            </div>
          }
          <button type="button" (click)="addIngredient()" class="text-primary-400 hover:text-primary-300 text-sm bg-transparent border-none cursor-pointer">+ Add ingredient</button>
        </div>

        <!-- Instructions -->
        <div class="bg-surface-800 rounded-2xl p-6 border border-surface-700 space-y-4">
          <h2 class="text-lg font-semibold text-white">Instructions</h2>
          <textarea [(ngModel)]="instructions" name="instructions" rows="8" class="w-full bg-surface-700 text-white rounded-lg px-4 py-2.5 border border-surface-600 focus:border-primary-500 outline-none font-mono text-sm"></textarea>
        </div>

        <div class="flex gap-3">
          <button type="submit" class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors" [disabled]="saving()">
            {{ saving() ? 'Saving...' : (isEdit ? 'Update Recipe' : 'Create Recipe') }}
          </button>
          <a routerLink="/recipes" class="bg-surface-700 hover:bg-surface-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors no-underline">Cancel</a>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class RecipeFormComponent {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  isEdit = false;
  recipeId = 0;

  title = '';
  description = '';
  prepTime = 30;
  cookTime = 20;
  difficulty: string = 'medium';
  cuisine = 'Italian';
  servings = 4;
  instructions = '';
  ingredients: { name: string; quantity: number; unit: string }[] = [{ name: '', quantity: 1, unit: 'cups' }];

  readonly saving = signal(false);
  readonly submitError = signal<string | null>(null);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.recipeId = Number(id);
      this.loadRecipe();
    }
  }

  async loadRecipe(): Promise<void> {
    try {
      const r = await this.api.getRecipe(this.recipeId);
      this.title = r.title;
      this.description = r.description;
      this.prepTime = r.prepTime;
      this.cookTime = r.cookTime;
      this.difficulty = r.difficulty;
      this.cuisine = r.cuisine;
      this.servings = r.servings;
      this.instructions = r.instructions;
      this.ingredients = r.ingredients.map(i => ({ name: i.name, quantity: i.quantity, unit: i.unit }));
    } catch (e: any) {
      this.submitError.set('Failed to load recipe');
    }
  }

  addIngredient(): void {
    this.ingredients.push({ name: '', quantity: 1, unit: 'cups' });
  }

  removeIngredient(index: number): void {
    this.ingredients.splice(index, 1);
  }

  async onSubmit(): Promise<void> {
    if (!this.title.trim()) {
      this.submitError.set('Title is required');
      return;
    }

    this.saving.set(true);
    this.submitError.set(null);
    try {
      const dto = {
        title: this.title,
        description: this.description,
        prepTime: this.prepTime,
        cookTime: this.cookTime,
        difficulty: this.difficulty as 'easy' | 'medium' | 'hard',
        cuisine: this.cuisine,
        servings: this.servings,
        instructions: this.instructions,
        ingredients: this.ingredients.filter(i => i.name.trim()),
      };

      if (this.isEdit) {
        await this.api.updateRecipe(this.recipeId, dto);
      } else {
        await this.api.createRecipe(dto as any);
      }
      this.router.navigate(['/recipes']);
    } catch (e: any) {
      this.submitError.set(e.error?.message || e.message || 'Failed to save recipe');
    } finally {
      this.saving.set(false);
    }
  }
}
