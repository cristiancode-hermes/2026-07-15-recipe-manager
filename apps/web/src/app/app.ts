import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-surface-800 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-8">
            <a routerLink="/" class="flex items-center gap-2 text-primary-400 font-bold text-xl no-underline">
              <span class="text-2xl">🍳</span>
              <span>Recipe Manager</span>
            </a>
            <div class="flex gap-4">
              <a routerLink="/recipes" routerLinkActive="text-primary-400" class="text-surface-300 hover:text-white transition-colors no-underline">Recipes</a>
              <a routerLink="/meal-plans" routerLinkActive="text-primary-400" class="text-surface-300 hover:text-white transition-colors no-underline">Meal Plans</a>
            </div>
          </div>
          <div class="flex items-center gap-4">
            @if (!api.isLoggedIn()) {
              <button (click)="showAuth = true" class="bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Sign In</button>
            } @else {
              <span class="text-surface-400 text-sm">{{ userName }}</span>
              <button (click)="logout()" class="text-surface-400 hover:text-red-400 text-sm transition-colors">Logout</button>
            }
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 py-6">
      <router-outlet />
    </main>

    @if (showAuth) {
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" (click)="showAuth = false">
        <div class="bg-surface-800 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl" (click)="$event.stopPropagation()">
          <h2 class="text-2xl font-bold text-white mb-6">{{ isLogin ? 'Sign In' : 'Create Account' }}</h2>
          
          <div class="space-y-4">
            @if (!isLogin) {
              <div>
                <label class="block text-surface-400 text-sm mb-1">Name</label>
                <input [(ngModel)]="authName" class="w-full bg-surface-700 text-white rounded-lg px-4 py-2.5 border border-surface-600 focus:border-primary-500 outline-none" placeholder="Your name" />
              </div>
            }
            <div>
              <label class="block text-surface-400 text-sm mb-1">Email</label>
              <input [(ngModel)]="authEmail" type="email" class="w-full bg-surface-700 text-white rounded-lg px-4 py-2.5 border border-surface-600 focus:border-primary-500 outline-none" placeholder="you@example.com" />
            </div>
            <div>
              <label class="block text-surface-400 text-sm mb-1">Password</label>
              <input [(ngModel)]="authPassword" type="password" class="w-full bg-surface-700 text-white rounded-lg px-4 py-2.5 border border-surface-600 focus:border-primary-500 outline-none" placeholder="••••••••" />
            </div>
            @if (authError) {
              <div class="text-red-400 text-sm">{{ authError }}</div>
            }
            <button (click)="submitAuth()" class="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg transition-colors" [disabled]="authLoading">
              {{ authLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account') }}
            </button>
          </div>

          <p class="text-surface-400 text-sm mt-4 text-center">
            {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
            <button (click)="isLogin = !isLogin; authError = ''" class="text-primary-400 hover:underline ml-1 bg-transparent border-none cursor-pointer">
              {{ isLogin ? 'Sign up' : 'Sign in' }}
            </button>
          </p>
        </div>
      </div>
    }
  `,
  styles: []
})
export class AppComponent {
  readonly api = inject(ApiService);
  showAuth = false;
  isLogin = true;
  authEmail = '';
  authPassword = '';
  authName = '';
  authError = '';
  authLoading = false;

  get userName(): string {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).name : '';
  }

  async submitAuth(): Promise<void> {
    this.authError = '';
    this.authLoading = true;
    try {
      const res = this.isLogin
        ? await this.api.login(this.authEmail, this.authPassword)
        : await this.api.register(this.authEmail, this.authPassword, this.authName);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      this.showAuth = false;
      this.authEmail = '';
      this.authPassword = '';
      this.authName = '';
    } catch (e: any) {
      this.authError = e.error?.message || e.message || 'Authentication failed';
    } finally {
      this.authLoading = false;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
