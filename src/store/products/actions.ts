import { ActionContext, ActionTree } from 'vuex';

import { getProductCategories } from '@api/products';

import { StateInterface } from '../index';
import { IProductsState } from './state';

const actions: ActionTree<IProductsState, StateInterface> = {
  async loadProductCategories(
    context: ActionContext<IProductsState, StateInterface>,
  ) {
    const categories = await getProductCategories();

    context.commit('setProductCategories', categories);
  },
};

export default actions;
