import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Recipe, CreateRecipeDto, UpdateRecipeDto, MealPlan, CreateMealPlanDto, ShoppingList, AuthResponse } from '../models';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api';

  // Auth
  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    return lastValueFrom(this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, { email, password, name }));
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return lastValueFrom(this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, { email, password }));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Recipes
  async getRecipes(filters?: { difficulty?: string; cuisine?: string }): Promise<Recipe[]> {
    let params: any = {};
    if (filters?.difficulty) params.difficulty = filters.difficulty;
    if (filters?.cuisine) params.cuisine = filters.cuisine;
    return lastValueFrom(this.http.get<Recipe[]>(`${this.baseUrl}/recipes`, { params }));
  }

  async getRecipe(id: number): Promise<Recipe> {
    return lastValueFrom(this.http.get<Recipe>(`${this.baseUrl}/recipes/${id}`));
  }

  async createRecipe(dto: CreateRecipeDto): Promise<Recipe> {
    return lastValueFrom(this.http.post<Recipe>(`${this.baseUrl}/recipes`, dto, this.authHeaders()));
  }

  async updateRecipe(id: number, dto: UpdateRecipeDto): Promise<Recipe> {
    return lastValueFrom(this.http.put<Recipe>(`${this.baseUrl}/recipes/${id}`, dto, this.authHeaders()));
  }

  async deleteRecipe(id: number): Promise<void> {
    return lastValueFrom(this.http.delete<void>(`${this.baseUrl}/recipes/${id}`, this.authHeaders()));
  }

  // Meal Plans
  async getMealPlans(): Promise<MealPlan[]> {
    return lastValueFrom(this.http.get<MealPlan[]>(`${this.baseUrl}/meal-plans`, this.authHeaders()));
  }

  async getMealPlan(id: number): Promise<MealPlan> {
    return lastValueFrom(this.http.get<MealPlan>(`${this.baseUrl}/meal-plans/${id}`, this.authHeaders()));
  }

  async createMealPlan(dto: CreateMealPlanDto): Promise<MealPlan> {
    return lastValueFrom(this.http.post<MealPlan>(`${this.baseUrl}/meal-plans`, dto, this.authHeaders()));
  }

  async deleteMealPlan(id: number): Promise<void> {
    return lastValueFrom(this.http.delete<void>(`${this.baseUrl}/meal-plans/${id}`, this.authHeaders()));
  }

  // Shopping Lists
  async getShoppingList(mealPlanId: number): Promise<ShoppingList> {
    return lastValueFrom(this.http.get<ShoppingList>(`${this.baseUrl}/shopping-lists/${mealPlanId}`, this.authHeaders()));
  }

  async generateShoppingList(mealPlanId: number): Promise<ShoppingList> {
    return lastValueFrom(this.http.post<ShoppingList>(`${this.baseUrl}/shopping-lists/${mealPlanId}`, {}, this.authHeaders()));
  }

  async toggleShoppingItem(listId: number, itemId: number, checked: boolean): Promise<void> {
    return lastValueFrom(this.http.patch<void>(`${this.baseUrl}/shopping-lists/${listId}/items/${itemId}`, { checked }, this.authHeaders()));
  }

  private authHeaders() {
    const token = this.getToken();
    return { headers: { Authorization: `Bearer ${token}` } };
  }
}
