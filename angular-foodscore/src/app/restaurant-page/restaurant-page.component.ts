import { Component } from '@angular/core';
import { Restaurant } from '../interfaces/restaurant';
import { FormsModule } from '@angular/forms';
// import { JsonPipe } from '@angular/common';

@Component({
  selector: 'restaurant-page',
  imports: [FormsModule],
  templateUrl: './restaurant-page.component.html',
  styleUrl: './restaurant-page.component.css'
})
export class RestaurantPageComponent {
  image = document.querySelector('input[type="file"]') as HTMLInputElement;
  restaurants:Restaurant[] = [
    {name:"pepe",
      image:"",
      cuisine:"pepe",
      description:"fdasfsda",
      phone:"fdasfds",
      daysOpen:["Sun", "Mon", "Tue", "Wed"]},
  ]
  newRestaurant : Restaurant= {
    name:"",
    image:"",
    cuisine:"",
    description:"",
    phone:"",
    daysOpen:[]
  }
  readonly days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  daysOpen:boolean[]=(new Array(7)).fill(true);
  weakDay:number=new Date().getDay();

  changeImage(event:Event){
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) { return; }
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.addEventListener('loadend', () => {
      this.newRestaurant.image = reader.result as string;
    });
  }

  addRestaurant(){
    this.newRestaurant.daysOpen = this.daysOpen.map((dayBoolean, index) => dayBoolean ? this.days[index] : "");
    this.restaurants.push(this.newRestaurant);
    this.resetResutaurant();
    this.image.value = "";
    /*
    Mirando el pdf del ejercicio ponia una imagen del  <form class="mt-4" (ngSubmit)="addRestaurant()" > 
    y como no sabia si se podia hacer de la otra forma te lo he hecho de esta pero se prodia pasar a la función ngForm
    y resetear más facilmente los campos del formulario
    <form class="mt-4" #restaurantForm="ngForm" (ngSubmit)="addRestaurant(restaurantForm)">
    Ya que se me queda el input de la imagen sin limpiar se vacia pero no se limpia el campo de texto
     */
  }
  resetResutaurant(){
    this.newRestaurant = {
      name:"",
      image:"",
      cuisine:"",
      description:"",
      phone:"",
      daysOpen:[]
    }
    this.daysOpen=(new Array(7)).fill(true);
    
  }
  deleteRestaurant(index:number){
    this.restaurants.splice(index, 1);
  }
}
