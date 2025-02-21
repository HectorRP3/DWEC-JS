export interface Restaurant extends RestaurantInsert {
  id:number;
}

export interface RestaurantInsert {
  name: string;
  image: string;
  cuisine: string;
  description: string;
  phone: string;
  daysOpen: string[];
}