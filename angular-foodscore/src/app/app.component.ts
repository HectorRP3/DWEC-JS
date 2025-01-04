import { Component } from '@angular/core';
import { RestaurantPageComponent } from "./restaurant-page/restaurant-page.component";

@Component({
  selector: 'app-root',
  imports: [RestaurantPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = "FoodScore";
}
