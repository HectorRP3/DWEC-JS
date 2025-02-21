import { Component, DestroyRef, inject, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { CanComponentDeactivate } from '../../shared/guards/leave-page.guard';
import { Restaurant, RestaurantInsert } from '../interfaces/restaurant';
import { RestaurantsService } from '../services/restaurants.service';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { oneCheckedValidator } from '../../shared/validators/oneCheckedValidator';

@Component({
  selector: 'restaurant-form',
  imports: [
    FormsModule,
    EncodeBase64Directive,
    ReactiveFormsModule,
    ValidationClassesDirective,
  ],
  templateUrl: './restaurant-form.component.html',
  styleUrl: './restaurant-form.component.css',
})
export class RestaurantFormComponent implements CanComponentDeactivate {
  #restaurantService = inject(RestaurantsService);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  #fb = inject(NonNullableFormBuilder);

  restaurantForm = this.#fb.group({
    name: [
      '',
      [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ][a-zA-Z]*$/)],
    ],
    description: ['', [Validators.required]],
    cuisine: ['', [Validators.required]],
    image: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}/)]],
    daysOpen: this.#fb.array(new Array(7).fill(true), {
      validators: [oneCheckedValidator],
    }),
  });

  readonly days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  add = output<Restaurant>();
  daysOpen!: boolean[];

  filename = '';

  imageBase64 = '';

  saved = false;

  addRestaurant() {
    const newRestaurant: RestaurantInsert = {
      ...this.restaurantForm.getRawValue(),
      image: this.imageBase64,
      daysOpen: this.days.map((d, i) => String(i)),
    };

    this.#restaurantService
      .addRestaurant(newRestaurant)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (res) => {
          this.saved = true;
          this.#router.navigate(['/restaurants', res.id]);
        },
        error: () => console.log('error'),
      });
  }
  canDeactivate() {
    return (
      this.saved ||
      this.restaurantForm.pristine ||
      confirm('¿Quieres abandonar la página?. Los cambios se perderán...')
    );
  }
}
