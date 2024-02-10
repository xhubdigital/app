import { IProduct } from './IProduct';

export interface IProductCategory {
  id: string;
  label: string;
  position: number;
  products: IProduct[];
}
