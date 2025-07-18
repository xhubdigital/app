import { IProductCategory } from '@models/IProductCategory';

export interface IProductsState {
  categories: IProductCategory[];
}

function state(): IProductsState {
  return {
    categories: [],
  };
};

export default state;
