import { Restaurant } from './restaurant';
import { Comment } from './comments';
export interface SingleRestaurantResponse {
  restaurant: Restaurant;
}

export interface RestaurantsResponse {
  restaurants: Restaurant[];
  more: boolean;
  page: number;
  count: number;
}

export interface TokenResponse {
  accessToken: string;
}

export interface AvatarResponse {
  avatar: string;
}

export interface CommentsResponse {
  comments: Comment[];
}

export interface SingleCommentResponse {
  comment: Comment;
}
