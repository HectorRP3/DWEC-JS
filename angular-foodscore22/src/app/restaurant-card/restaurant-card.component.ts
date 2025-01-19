import { Component, input, output } from '@angular/core';
import { Restaurant } from '../interfaces/restaurant';

@Component({
  selector: 'restaurant-card',
  imports: [],
  templateUrl: './restaurant-card.component.html',
  styleUrl: './restaurant-card.component.css'
})
export class RestaurantCardComponent {
  readonly days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  weekDay: number = new Date().getDay();
  daysOpen: boolean[]=(new Array(7)).fill(true);
  
  restaurant = input.required<Restaurant>();

  delete = output<void>();

  getOpenDayNames(daysOpen: string[]) {
    return daysOpen.map((d) => this.days[+d]).join(', ');
  }

   deleteRestaurant() {
    this.delete.emit();
  }
}
