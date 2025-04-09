import { leavePageGuard } from '../shared/guards/leave-page.guard';
import { numericIdGuard } from '../shared/guards/numeric-id.guard';

export const restaurantsRoutes = [
  {
    path: '',
    loadComponent: () =>
      import('./restaurants-page/restaurants-page.component').then(
        (m) => m.RestaurantsPageComponent
      ),
    title: 'Restaurantes | FoodScore',
    data: { animation: 'restaurantsPage' },
  },
  {
    path: 'add',
    title: 'Añadir Restaurante | FoodScore',
    loadComponent: () =>
      import('./restaurant-form/restaurant-form.component').then(
        (m) => m.RestaurantFormComponent
      ),
    canDeactivate: [leavePageGuard],
  },
  {
    path: ':id',
    canActivate: [numericIdGuard],
    loadComponent: () =>
      import('./restaurant-details/restaurant-details.component').then(
        (m) => m.RestaurantDetailsComponent
      ),
    data: { animation: 'restaurantsDetail' },
  },
  {
    path: 'edit/:id',
    canActivate: [numericIdGuard],
    canDeactivate: [leavePageGuard],
    title: 'Editar Restaurante | FoodScore',
    loadComponent: () =>
      import('./restaurant-form/restaurant-form.component').then(
        (m) => m.RestaurantFormComponent
      ),

    data: { animation: 'restaurantEdit' },
  },
];
