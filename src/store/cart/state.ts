import { ICart, OrderStatus, OrderType } from '@models/ICart';
import { IServiceInfo } from '@models/IServiceInfo';

export interface ICartState {
  activeCart: ICart;
  serviceInfo: {
    data: IServiceInfo,
    loading: boolean,
  };
}

function state(): ICartState {
  return {
    serviceInfo: {
      data: {
        fee: 0,
        waitingTime: 9,
        distance: 0,
      },
      loading: false,
    },
    activeCart: {
      type: OrderType.Delivery,
      status: OrderStatus.Pending,
      paymentInfo: null,
      address: null,
      items: [],
    },
  };
};

export default state;
