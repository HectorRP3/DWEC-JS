import { Component, DestroyRef, inject, output } from '@angular/core';
import { Restaurant, RestaurantInsert } from '../interfaces/restaurant';
import { FormsModule } from '@angular/forms';
import { EncodeBase64Directive } from '../directives/encode-base64.directive';
import { RestaurantsService } from '../services/restaurants.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'restaurant-form',
  imports: [FormsModule,EncodeBase64Directive,JsonPipe],
  templateUrl: './restaurant-form.component.html',
  styleUrl: './restaurant-form.component.css'
})
export class RestaurantFormComponent {
  #restaurantService = inject(RestaurantsService);
  #destroyRef = inject(DestroyRef);
  readonly days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  newRestaurant!: RestaurantInsert;
  add = output<Restaurant>();
  daysOpen!: boolean[];

  filename = '';
  
  constructor() {
    this.resetForm();
  }

  
  addRestaurant() {
    this.newRestaurant.daysOpen = this.days
      .map((d, i) => String(i))
      .filter((i) => this.daysOpen[+i]);
    this.#restaurantService
    .addRestaurant(this.newRestaurant)
    .pipe(takeUntilDestroyed(this.#destroyRef))
    .subscribe((res)=>{
      this.add.emit(res);
      this.resetForm();
      this.newRestaurant.image="";
    }
    )
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
