import { IRestaurant } from './IRestaurant';

export interface IUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  picture?: string;
  restaurant: IRestaurant;
}
