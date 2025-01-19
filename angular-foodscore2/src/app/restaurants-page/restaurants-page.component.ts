import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Restaurant } from '../interfaces/restaurant';
import { RestaurantFormComponent } from '../restaurant-form/restaurant-form.component';
import { RestaurantCardComponent } from "../restaurant-card/restaurant-card.component";

@Component({
  selector: 'restaurants-page',
  imports: [FormsModule, RestaurantFormComponent, RestaurantCardComponent,RestaurantCardComponent],
  templateUrl: './restaurants-page.component.html',
  styleUrl: './restaurants-page.component.css',
})
export class RestaurantsPageComponent {
  restaurants=signal<Restaurant[]>([]);
  readonly days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  weekDay: number = new Date().getDay();
  daysOpen: boolean[]=(new Array(7)).fill(true);
  search = signal("");
  showOpens = signal<boolean>(false);

  restaurantFiltered = computed(()=> this.restaurants().filter((r)=>{
      if(this.showOpens()){
        return (r.daysOpen[this.weekDay] === "0") && (r.name.toLowerCase().includes(this.search().toLowerCase()) 
          || r.description.toLowerCase().includes(this.search().toLowerCase()))
      }else{
        return r.name.toLowerCase().includes(this.search().toLowerCase()) || r.description.toLowerCase().includes(this.search().toLowerCase())
      }
    }));
  addRestaurant(restaurant:Restaurant){
    this.restaurants.update(r=>r.concat(restaurant))
  }

  deleteRestaurant(restaurant: Restaurant) {
    this.restaurants.update(restaurants=>restaurants.filter(r=> r!==restaurant));
  }

  toggleOpens(){
    this.showOpens.update(s=>!s);
  }
}
