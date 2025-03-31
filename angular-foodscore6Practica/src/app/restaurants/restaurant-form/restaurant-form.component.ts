import {
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { CanComponentDeactivate } from '../../shared/guards/leave-page.guard';
import { GaAutocompleteDirective } from '../../shared/ol-maps/ga-autocomplete.directive';
import { OlMapDirective } from '../../shared/ol-maps/ol-map.directive';
import { OlMarkerDirective } from '../../shared/ol-maps/ol-marker.directive';
import { SearchResult } from '../../shared/ol-maps/search-result';
import { oneCheckedValidator } from '../../shared/validators/oneCheckedValidator';
import { Restaurant, RestaurantInsert } from '../interfaces/restaurant';
import { RestaurantsService } from '../services/restaurants.service';
import { Title } from '@angular/platform-browser';
import { catchError, EMPTY, tap } from 'rxjs';

@Component({
  selector: 'restaurant-form',
  imports: [
    FormsModule,
    EncodeBase64Directive,
    ReactiveFormsModule,
    ValidationClassesDirective,
    OlMapDirective,
    OlMarkerDirective,
    GaAutocompleteDirective,
  ],
  templateUrl: './restaurant-form.component.html',
  styleUrl: './restaurant-form.component.css',
})
export class RestaurantFormComponent implements CanComponentDeactivate {
  #restaurantService = inject(RestaurantsService);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  #fb = inject(NonNullableFormBuilder);
  coordinates = signal<[number, number]>([-0.5, 38.5]);
  #title = inject(Title);
  readonly days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  add = output<Restaurant>();
  filename = '';
  imageBase64 = '';
  saved = false;
  postActivete = signal(false);
  id = input<number>();

  restauranResource = rxResource({
    request: () => this.id(),
    loader: ({ request: id }) =>
      this.#restaurantService.getRestaurant(id).pipe(
        tap((r) => {
          this.coordinates.set([r.lng, r.lat]);
          this.#title.setTitle(r.name + ' | FoodScore');
        }),
        catchError(() => {
          this.#router.navigate(['/restaurants']);
          return EMPTY;
        })
      ),
  });

  constructor() {
    effect(() => {
      if (this.restauranResource.value()) {
        this.restaurantForm.controls.name.setValue(
          this.restauranResource.value()!.name
        );
        this.restaurantForm.controls.description.setValue(
          this.restauranResource.value()!.description
        );
        this.restaurantForm.controls.cuisine.setValue(
          this.restauranResource.value()!.cuisine
        );
        this.imageBase64 = this.restauranResource.value()!.image;
        this.filename = this.restauranResource.value()!.image.split('/').pop()!;
        this.restaurantForm.controls.phone.setValue(
          this.restauranResource.value()!.phone.toString()
        );
        this.restaurantForm.controls.address.setValue(
          this.restauranResource.value()!.address
        );
        this.restaurantForm.controls.lat.setValue(
          this.restauranResource.value()!.lat
        );
        this.restaurantForm.controls.lng.setValue(
          this.restauranResource.value()!.lng
        );
        this.restaurantForm.controls.daysOpen.setValue(
          new Array(7)
            .fill(false)
            .map((_, i) =>
              this.restauranResource.value()!.daysOpen.includes(String(i))
            )
        );
        this.changePlace({
          address: this.restauranResource.value()!.address,
          coordinates: [
            this.restauranResource.value()!.lng,
            this.restauranResource.value()!.lat,
          ],
        });
        this.postActivete.set(false);
      } else {
        this.postActivete.set(true);
      }
    });
  }

  restaurantForm = this.#fb.group({
    name: [
      '',
      [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*[a-zA-Z]$/)],
    ],
    description: ['', [Validators.required]],
    cuisine: ['', [Validators.required]],
    image: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{8}/)]],
    daysOpen: this.#fb.array(new Array(7).fill(true), {
      validators: [oneCheckedValidator],
    }),
    address: ['', [Validators.required]],
    lat: [0, [Validators.required]],
    lng: [0, [Validators.required]],
  });

  addRestaurant() {
    const newRestaurant: RestaurantInsert = {
      ...this.restaurantForm.getRawValue(),
      image: this.imageBase64,
      daysOpen: this.days
        .map((d, i) => String(i))
        .filter((i) => this.restaurantForm.value.daysOpen?.[+i]),
      phone: this.restaurantForm.controls.phone.value.toString(),
    };
    if (this.restauranResource.value()) {
      this.#restaurantService
        .putRestaurant(newRestaurant, this.restauranResource.value()!.id)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe({
          next: () => {
            this.saved = true;
            this.#router.navigate([
              '/restaurants',
              this.restauranResource.value()!.id,
            ]);
          },
          error: (err) => {
            console.error(err);
          },
        });
    } else {
      this.#restaurantService
        .addRestaurant(newRestaurant)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe({
          next: (res) => {
            this.saved = true;
            this.#router.navigate(['/restaurants', res.id]);
          },
          error: (err) => {
            console.error(err);
          },
        });
    }
  }

  changePlace(result: SearchResult) {
    this.coordinates.set(result.coordinates);
    this.restaurantForm.controls.lat.setValue(result.coordinates[1]);
    this.restaurantForm.controls.lng.setValue(result.coordinates[0]);
    this.restaurantForm.controls.address.setValue(result.address);
  }

  canDeactivate() {
    return (
      this.saved ||
      this.restaurantForm.pristine ||
      confirm('¿Quieres abandonar la página?. Los cambios se perderán...')
    );
  }
}
