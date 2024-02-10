import { GetterTree } from 'vuex';

import { StateInterface } from '../index';
import { IUserState } from './state';

const getters: GetterTree<IUserState, StateInterface> = {
  user(state: IUserState) {
    return state.user;
  },
};

export default getters;
