import { Routes } from '@angular/router';
import { logoutActivateGuard } from './shared/guards/logout-activate.guard';
import { loginActivateGuard } from './shared/guards/login-activate.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [logoutActivateGuard],
    loadChildren: () => import('./auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'restaurants',
    canActivate: [loginActivateGuard],
    loadChildren: () =>
      import('./restaurants/restaurants.routes').then(
        (m) => m.restaurantsRoutes
      ),
  },
  {
    path: 'profile',
    canActivate: [loginActivateGuard],
    loadChildren: () =>
      import('./profile/profile.routes').then((m) => m.profileRoutes),
  },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login' },
];
