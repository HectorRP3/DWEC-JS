// export interface Restaurant extends RestaurantInsert {
//   id: number;
// }

import { User } from '../../shared/interfaces/user';

// export interface RestaurantInsert {
//   name: string;
//   image: string;
//   cuisine: string;
//   description: string;
//   phone: string;
//   daysOpen: string[];
// }

export interface RestaurantInsert {
  name: string;
  description: string;
  cuisine: string;
  daysOpen: string[];
  image: string;
  phone: string;
  address: string;
  lat: number;
  lng: number;
}

export interface Restaurant extends RestaurantInsert {
  id: number;
  creator: User;
  mine: boolean;
  distance: number;
  commented: boolean;
  stars: number;
}
