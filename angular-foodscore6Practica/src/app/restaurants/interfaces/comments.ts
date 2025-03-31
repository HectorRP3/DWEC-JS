import { User } from '../../profile/interfaces/user';

export interface Comment {
  id?: number;
  stars: number;
  text: string;
  date?: string;
  user?: User;
}
