import { MutationTree } from 'vuex';

import { IUser } from '@models/IUser';

import { IUserState } from './state';

const mutation: MutationTree<IUserState> = {
  setToken(state: IUserState, token: string) {
    state.accessToken = token;
  },

  setRefreshToken(state: IUserState, refreshToken: string) {
    state.refreshToken = refreshToken;
  },

  setUser(state: IUserState, user: IUser) {
    state.user = user;
  },
};

export default mutation;
