import { ActionContext, ActionTree } from 'vuex';

import {
  ADDRESS_KEY,
  CART_KEY,
  localStorageHelper,
} from '@helpers/localStorage';
import { getAddress } from '@api/addresses';
import { getServiceInfo } from '@api/store';
import { ICartItem, OrderType } from '@models/ICart';
import { IAddress } from '@models/IAddress';

import { StateInterface } from '../index';
import { ICartState } from './state';

async function getAddressDetails(addressID: string | null) {
  try {
    return addressID ? await getAddress(addressID) : null;
  } catch {
    return null;
  }
}

const actions: ActionTree<ICartState, StateInterface> = {
  async initCart(context: ActionContext<ICartState, StateInterface>) {
    const addressID = localStorageHelper.get<string>(ADDRESS_KEY);

    const address = await getAddressDetails(addressID);

    context.commit('initCart', address);

    void context.dispatch('updateServiceInfo');

    const cartItems = localStorageHelper.get<ICartItem>(CART_KEY);

    if (cartItems) {
      context.commit('updateItems', cartItems);
    }
  },

  updateLocalStorage(
    context: ActionContext<ICartState, StateInterface>,
  ) {
    const { items } = context.state.activeCart;

    localStorageHelper.set(CART_KEY, items);
  },

  saveItem(
    context: ActionContext<ICartState, StateInterface>,
    data: { cartItem: ICartItem, index?: number },
  ) {
    context.commit('saveItem', data);

    void context.dispatch('updateLocalStorage');
  },

  removeItem(
    context: ActionContext<ICartState, StateInterface>,
    index?: number,
  ) {
    context.commit('removeItem', index);

    void context.dispatch('updateLocalStorage');
  },

  clearCart(
    context: ActionContext<ICartState, StateInterface>,
  ) {
    context.commit('clearCart');

    localStorageHelper.set(CART_KEY, []);
  },

  updateOrderType(
    context: ActionContext<ICartState, StateInterface>,
    type: OrderType,
  ) {
    context.commit('updateOrderType', type);

    void context.dispatch('updateServiceInfo');
  },

  async updateServiceInfo(context: ActionContext<ICartState, StateInterface>) {
    const { address, type } = context.state.activeCart;

    try {
      context.commit('updateServiceInfoLoading', true);

      const addrs = type === OrderType.Delivery ? address : null;
      const serviceInfo = await getServiceInfo(addrs);

      context.commit('updateServiceInfo', serviceInfo);
    } catch {
      context.commit('updateServiceInfo', {
        fee: -1,
        waitingTime: -1,
        distance: -1,
      });
    }

    context.commit('updateServiceInfoLoading', false);
  },

  updateDeliveryAddress(
    context: ActionContext<ICartState, StateInterface>,
    address: IAddress | null,
  ) {
    context.commit('updateDeliveryAddress', address);

    void context.dispatch('updateServiceInfo');
  },
};

export default actions;
