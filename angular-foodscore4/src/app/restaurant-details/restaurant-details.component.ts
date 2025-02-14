import { Component, inject, input, numberAttribute } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { catchError, EMPTY, tap } from 'rxjs';
import { RestaurantsService } from '../services/restaurants.service';

@Component({
  selector: 'restaurant-details',
  imports: [],
  templateUrl: './restaurant-details.component.html',
  styleUrl: './restaurant-details.component.css',
})
export class RestaurantDetailsComponent {
  id = input.required({ transform: numberAttribute });
  #restaurantService = inject(RestaurantsService);
  // restaurant = input.required<Restaurant>();
  weekDay: number = new Date().getDay();
  readonly days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

  #title = inject(Title);
  #router = inject(Router);
  // #destroyRef = inject(DestroyRef);
  // #changeDetertor = inject(ChangeDetectorRef);

  contructor() {
    // effect(() => {
    //   this.#title.setTitle(this.restaurant().name + ' | FoodScore');
    // });
  }

  restaurantResource = rxResource({
    request: () => this.id(),
    loader: ({ request: id }) =>
      this.#restaurantService.getRestaurant(id).pipe(
        tap((r) => this.#title.setTitle(r.name + ' | FoodScore')),
        catchError(() => {
          this.#router.navigate(['/restaurants']);
          return EMPTY;
        })
      ),
  });

  getOpenDayNames(daysOpen: string[]) {
    return daysOpen.map((d) => this.days[+d]).join(', ');
  }
}
