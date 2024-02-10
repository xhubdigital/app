import { pathOr, sum } from 'ramda';
import { GetterTree } from 'vuex';

import { getCartItemPrice } from '@helpers/getCartItemPrice';
import { OrderType } from '@models/ICart';

import { StateInterface } from '../index';
import { ICartState } from './state';

const getters: GetterTree<ICartState, StateInterface> = {
  activeCart(state: ICartState) {
    return state.activeCart;
  },

  serviceInfoLoading(state: ICartState) {
    return state.serviceInfo.loading;
  },

  isInsideDeliveryArea(state: ICartState) {
    return state.serviceInfo.data.waitingTime !== -1;
  },

  isDeliveryWithoutAddress(state: ICartState) {
    return state.activeCart.type === OrderType.Delivery &&
      !state.activeCart.address;
  },

  subTotal(state: ICartState): number {
    return sum(state.activeCart.items.map(getCartItemPrice));
  },

  serviceFee(state: ICartState): number {
    return state.serviceInfo.data.fee;
  },

  waitingTime(state: ICartState): number {
    return state.serviceInfo.data.waitingTime;
  },

  distance(state: ICartState): number {
    return state.serviceInfo.data.distance;
  },

  total(_: ICartState, getters: unknown) {
    return pathOr<number>(0, ['subTotal'], getters) +
      pathOr<number>(0, ['serviceFee'], getters);
  },
};

export default getters;
