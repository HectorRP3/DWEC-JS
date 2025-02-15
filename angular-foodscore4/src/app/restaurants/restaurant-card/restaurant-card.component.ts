import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Restaurant } from '../interfaces/restaurant';

@Component({
  selector: 'restaurant-card',
  imports: [RouterLink],
  templateUrl: './restaurant-card.component.html',
  styleUrl: './restaurant-card.component.css',
})
export class RestaurantCardComponent {
  //#restaunrantService = inject(RestaurantsService);
  //#destroyRef = inject(DestroyRef);
  weekDay: number = new Date().getDay();
  readonly days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

  restaurant = input.required<Restaurant>();
  deleted = output<void>();

  getOpenDayNames(daysOpen: string[]) {
    return daysOpen.map((d) => this.days[+d]).join(', ');
  }

  // deleteRestaurant() {
  //   this.#restaunrantService
  //     .deleteRestaurant(this.restaurant().id!)
  //     .pipe(takeUntilDestroyed(this.#destroyRef))
  //     .subscribe(() => this.deleted.emit());
  // }
}
