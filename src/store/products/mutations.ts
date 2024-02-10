import { MutationTree } from 'vuex';

import { IProductCategory } from '@models/IProductCategory';

import { IProductsState } from './state';

const mutation: MutationTree<IProductsState> = {
  setProductCategories(state: IProductsState, categories: IProductCategory[]) {
    state.categories = categories;
  },
};

export default mutation;
