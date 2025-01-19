import { ChangeDetectorRef, Component, inject, output } from '@angular/core';
import { Restaurant } from '../interfaces/restaurant';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'restaurant-form',
  imports: [FormsModule],
  templateUrl: './restaurant-form.component.html',
  styleUrl: './restaurant-form.component.css'
})
export class RestaurantFormComponent {
  readonly days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  daysOpen: boolean[]=(new Array(7)).fill(true);
  weekDay: number = new Date().getDay();

  add = output<Restaurant>();

  newRestaurant!: Restaurant;

  filename = '';

  constructor() {
    this.resetForm();
  }

  #changeDetector = inject(ChangeDetectorRef);

  changeImage(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) {
      return;
    }
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.addEventListener('loadend', () => {
      this.newRestaurant.image = reader.result as string;
      this.#changeDetector.markForCheck();
    });
  }

  addRestaurant() {
    this.newRestaurant.daysOpen = this.days
      .map((d, i) => String(i))
      .filter((i) => this.daysOpen[+i]);
    this.add.emit({...this.newRestaurant});
    this.resetForm();
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
