import { Component, DestroyRef, inject, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { CanComponentDeactivate } from '../../shared/guards/leave-page.guard';
import { Restaurant, RestaurantInsert } from '../interfaces/restaurant';
import { RestaurantsService } from '../services/restaurants.service';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { OneCheckedDirective } from '../../shared/directives/one-checked.directive';

@Component({
  selector: 'restaurant-form',
  imports: [
    FormsModule,
    EncodeBase64Directive,
    ValidationClassesDirective,
    OneCheckedDirective,
  ],
  templateUrl: './restaurant-form.component.html',
  styleUrl: './restaurant-form.component.css',
})
export class RestaurantFormComponent implements CanComponentDeactivate {
  #restaurantService = inject(RestaurantsService);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);

  readonly days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  newRestaurant!: RestaurantInsert;
  add = output<Restaurant>();
  daysOpen!: boolean[];

  filename = '';

  constructor() {
    this.resetForm();
  }

  saved = false;

  addRestaurant() {
    this.newRestaurant.daysOpen = this.days
      .map((d, i) => String(i))
      .filter((i) => this.daysOpen[+i]);
    this.#restaurantService
      .addRestaurant(this.newRestaurant)
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
      confirm('¿Quieres abandonar la página?. Los cambios se perderán...')
    );
  }
  resetForm() {
    this.newRestaurant = {
      name: '',
      description: '',
      cuisine: '',
      image: '',
      daysOpen: [],
      phone: '',
    };
    this.filename = '';
    this.daysOpen = new Array(7).fill(true);
  }
}
