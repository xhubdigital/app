import { MutationTree } from 'vuex';
import { remove } from 'ramda';

import { ADDRESS_KEY, localStorageHelper } from '@helpers/localStorage';
import { IAddress } from '@models/IAddress';
import {
  ICartItem,
  PaymentMethod,
  OrderType,
  OrderStatus,
} from '@models/ICart';
import { IServiceInfo } from '@models/IServiceInfo';

import { ICartState } from './state';

interface CartItemInfo {
  cartItem: ICartItem;
  index?: number;
}

const mutation: MutationTree<ICartState> = {
  initCart(state: ICartState, address: IAddress | null) {
    state.activeCart = {
      address,
      status: OrderStatus.Pending,
      type: OrderType.Delivery,
      paymentInfo: null,
      items: [],
    };
  },

  clearCart(state: ICartState) {
    state.activeCart = {
      ...state.activeCart,
      paymentInfo: null,
      items: [],
    };
  },

  saveItem(state: ICartState, cartItemInfo: CartItemInfo) {
    const { index, cartItem } = cartItemInfo;

    if (index === undefined) {
      state.activeCart?.items.push(cartItem);
    } else {
      state.activeCart.items[index] = (cartItem);
    }
  },

  removeItem(state: ICartState, index: number) {
    state.activeCart.items = remove(index, 1, state.activeCart.items);
  },

  updateItems(state: ICartState, cartItems: ICartItem[]) {
    state.activeCart.items = cartItems;
  },

  updateOrderType(state: ICartState, type: OrderType) {
    state.activeCart.type = type;
  },

  updatePaymentMethod(state: ICartState, paymentInfo: PaymentMethod) {
    state.activeCart.paymentInfo = paymentInfo;
  },

  updateDeliveryAddress(state: ICartState, address: IAddress | null) {
    state.activeCart.address = address;

    if (address) {
      localStorageHelper.set(ADDRESS_KEY, address.id);
    } else {
      localStorageHelper.remove(ADDRESS_KEY);
    }
  },

  updateServiceInfo(state: ICartState, ServiceInfo: IServiceInfo) {
    state.serviceInfo.data = ServiceInfo;
  },

  updateServiceInfoLoading(state: ICartState, loading: boolean) {
    state.serviceInfo.loading = loading;
  },
};

export default mutation;
