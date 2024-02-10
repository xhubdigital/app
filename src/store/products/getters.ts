import { GetterTree } from 'vuex';

import { IProduct } from '@models/IProduct';

import { StateInterface } from '../index';
import { IProductsState } from './state';

const getters: GetterTree<IProductsState, StateInterface> = {
  categories(state: IProductsState) {
    return state.categories;
  },

  productsMapping(state: IProductsState) {
    const mapping: { [key: string]: IProduct } = {};

    state.categories.forEach((category) => {
      category.products.forEach((product) => {
        mapping[product.id] = product;
      });
    });

    return mapping;
  },
};

export default getters;
