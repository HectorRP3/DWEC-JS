import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Restaurant } from '../interfaces/restaurant';
import { RestaurantCardComponent } from '../restaurant-card/restaurant-card.component';
import { RestaurantsService } from '../services/restaurants.service';
import { ProfileService } from '../../profile/services/profile.service';
@Component({
  selector: 'restaurants-page',
  imports: [FormsModule, RestaurantCardComponent],
  templateUrl: './restaurants-page.component.html',
  styleUrl: './restaurants-page.component.css',
})
export class RestaurantsPageComponent {
  #restaurantService = inject(RestaurantsService);
  #profileService = inject(ProfileService);
  #detroyRef = inject(DestroyRef);
  weekDay: number = new Date().getDay();
  creator = input<string>();
  restaurants = signal<Restaurant[]>([]);
  search = signal('');
  searchDebounce = toSignal(
    toObservable(this.search).pipe(debounceTime(600), distinctUntilChanged())
  );
  moreRestaurants = false;
  page = signal(1);
  open = signal(0);
  nombreUsuario = signal<string>('');
  filter = computed(() => {
    let filter = 'Restaurants: ';
    if (this.nombreUsuario()) {
      filter += ' Filtrado por creador: ' + this.nombreUsuario();
    }
    if (this.search() !== '') {
      filter += ' Filtrado por nombre: ' + this.search();
    }
    return (filter +=
      this.open() === 1 ? ' Filtro por: abiertos' : ' Filtrado por: Todos');
  });

  constructor() {
    //effect para detectar un cambio en el search y si esta vacio lo dejo igual en las mismas paginas
    effect(() => {
      const valor = this.searchDebounce();
      untracked(() => {
        if (valor === this.search() && valor !== '' && this.search() !== '') {
          this.page.set(1);
        }
      });
    });
    effect(() => {
      let restaurants;
      if (this.creator()) {
        restaurants = this.#restaurantService.getRestaurants(
          this.searchDebounce(),
          this.page(),
          this.open(),
          this.creator()
        );
        this.#profileService
          .getProfile(Number(this.creator()))
          .subscribe((res) => {
            this.nombreUsuario.set(res.name);
          });
      } else {
        this.nombreUsuario.set('');
        restaurants = this.#restaurantService.getRestaurants(
          this.searchDebounce(),
          this.page(),
          this.open()
        );
      }
      restaurants.pipe(takeUntilDestroyed(this.#detroyRef)).subscribe((res) => {
        this.restaurants.update((restaurants) => {
          if (this.page() === 1) {
            return res.restaurants;
          } else {
            return [...restaurants, ...res.restaurants];
          }
        });
        this.moreRestaurants = res.more;
        this.page.set(res.page);
      });
    });
  }
  deleteRestaurant(restaurant: Restaurant) {
    this.restaurants.update((restaurants) =>
      restaurants.filter((r) => r !== restaurant)
    );
  }

  changeOpen() {
    this.page.set(1);
    this.open.update((open) => (open === 0 ? 1 : 0));
  }

  loadMore() {
    this.page.update((page) => page + 1);
  }
}
