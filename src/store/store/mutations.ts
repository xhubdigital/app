import { MutationTree } from 'vuex';

import { IStore } from '../../models/IStore';
import { IStoreState } from './state';

const mutation: MutationTree<IStoreState> = {
  setStore(state: IStoreState, store: IStore) {
    state.store = store;
  },
};

export default mutation;
