import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Restaurant } from '../interfaces/restaurant';
import { RestaurantCardComponent } from '../restaurant-card/restaurant-card.component';
import { RestaurantsService } from '../services/restaurants.service';
@Component({
  selector: 'restaurants-page',
  imports: [FormsModule, RestaurantCardComponent],
  templateUrl: './restaurants-page.component.html',
  styleUrl: './restaurants-page.component.css',
})
export class RestaurantsPageComponent {
  #restaurantService = inject(RestaurantsService);
  #detroyRef = inject(DestroyRef);
  weekDay: number = new Date().getDay();

  restaurants = signal<Restaurant[]>([]);
  search = signal('');
  onlyOpen = signal(false);
  moreRestaurants = false;
  page = 0;

  constructor() {
    this.#restaurantService
      .getRestaurants()
      .pipe(takeUntilDestroyed(this.#detroyRef))
      .subscribe((res) => {
        this.restaurants.set(res.restaurants);
        this.moreRestaurants = res.more;
        this.page = res.page;
      });
  }

  filteredRestaurants = computed(() => {
    const searchLower = this.search().toLowerCase();
    const filtered = this.restaurants().filter(
      (r) =>
        r.name.toLowerCase().includes(searchLower) ||
        r.description.toLowerCase().includes(searchLower)
    );

    return this.onlyOpen()
      ? filtered.filter((r) => r.daysOpen.includes(this.weekDay.toString()))
      : filtered;
  });

  deleteRestaurant(restaurant: Restaurant) {
    this.restaurants.update((restaurants) =>
      restaurants.filter((r) => r !== restaurant)
    );
  }

  loadMore() {
    this.#restaurantService
      .getRestaurants('', ++this.page, 0)
      .pipe(takeUntilDestroyed(this.#detroyRef))
      .subscribe((res) => {
        this.restaurants.update((restaurantNow) => [
          ...restaurantNow,
          ...res.restaurants,
        ]);
        this.moreRestaurants = res.more;
        this.page = res.page;
      });
  }
}
