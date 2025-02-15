import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RestaurantDetailsComponent } from './restaurant-details/restaurant-details.component';
import { RestaurantFormComponent } from './restaurant-form/restaurant-form.component';
import { RestaurantsPageComponent } from './restaurants-page/restaurants-page.component';

export const routes: Routes = [
  { path: 'auth/login', component: LoginComponent, title: 'Login | FoodScore' },
  {
    path: 'restaurants',
    children: [
      {
        path: '',
        component: RestaurantsPageComponent,
        title: 'Restaurantes | FoodScore',
      },
      {
        path: 'add',
        title: 'Añadir Restaurante | FoodScore',
        component: RestaurantFormComponent,
      },
      {
        path: ':id',
        // resolve: {
        //   restaurant: restaurantResolver,
        // },
        component: RestaurantDetailsComponent,
      },
    ],
  },
  { path: '', redirectTo: '/restaurants', pathMatch: 'full' },
  { path: '**', redirectTo: '/restaurants' },
];
