import { ActionTree } from 'vuex';

import { setRestaurant, setToken } from '@boot/axios';
import {
  localStorageHelper,
  USER_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from '@helpers/localStorage';
import { getUserData, refreshToken, updateUser, IUpdateUser } from '@api/user';

import { StateInterface } from '../index';
import { IUserState } from './state';

export interface ITokenData {
  accessToken: string;
  refreshToken: string;
}

let loginInterval: NodeJS.Timeout | null;

const actions: ActionTree<IUserState, StateInterface> = {
  async processLogin(context, data: ITokenData) {
    try {
      const { accessToken, refreshToken } = data;

      localStorageHelper.set(USER_TOKEN_KEY, accessToken);
      localStorageHelper.set(REFRESH_TOKEN_KEY, refreshToken);

      setToken(accessToken);

      const user = await getUserData();

      setRestaurant(user.restaurant.id);

      if (!loginInterval) {
        loginInterval = setInterval(() => {
          void context.dispatch('refreshToken');
        }, 30 * 60000);
      }

      context.commit('setToken', accessToken);
      context.commit('setRefreshToken', refreshToken);
      context.commit('setUser', user);

      return user;
    } catch {
      await context.dispatch('logout');
    }
  },

  async autoSignIn(context) {
    try {
      const refreshToken = localStorageHelper.get<string>(REFRESH_TOKEN_KEY);

      if (refreshToken) {
        context.commit('setRefreshToken', refreshToken);

        return await context.dispatch('refreshToken') as Promise<unknown>;
      }
    } catch {
      return context.dispatch('logout');
    }
  },

  async refreshToken(context) {
    if (!context.state.refreshToken) {
      throw new Error('INVALID_REFRESH_TOKEN');
    }

    const loginResponse = await refreshToken(context.state.refreshToken);

    return context.dispatch('processLogin', loginResponse);
  },

  async updateUser(context, userData: IUpdateUser) {
    const user = await updateUser(userData);

    context.commit('setUser', user);
  },

  logout(context) {
    if (loginInterval) {
      clearInterval(loginInterval);
      loginInterval = null;
    }

    localStorageHelper.remove(USER_TOKEN_KEY);
    localStorageHelper.remove(REFRESH_TOKEN_KEY);

    setToken(null);

    context.commit('setToken', null);
    context.commit('setRefreshToken', null);
    context.commit('setUser', null);
    context.commit('cart/updateDeliveryAddress', null, { root: true });
  },
};

export default actions;
