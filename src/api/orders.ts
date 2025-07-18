import { values } from 'ramda';

import { api } from '@boot/axios';

import {
  ICart,
  ICartItemComplementValue,
  IComplementValue,
} from '@models/ICart';
import { IUser } from '@models/IUser';
import { IOrder } from '@models/IOrder';

export async function getOrders(): Promise<IOrder[]> {
  const response = await api.get<IOrder[]>('orders');

  return response.data;
}

export async function getOrder(id: string): Promise<IOrder> {
  const response = await api.get<IOrder>(`orders/${id}`);

  return response.data;
}

export async function makeOrder(cart: ICart, user: IUser): Promise<ICart> {
  const order = prepareOrder(cart, user);

  const response = await api.post<ICart>('orders', order);

  return response.data;
}

function prepareOrder(cart: ICart, user: IUser) {
  return {
    ...cart,
    address: {
      ...cart.address,
      latitude: 0,
      longitude: 0,
    },
    userName: user.name,
    userPhone: user.phone,
    items: cart.items.map((item) => {
      const complements = values(item.complements);

      return {
        ...item,
        complements: complements
          .map((complement: ICartItemComplementValue) => {
            return {
              ...complement,
              values: values(complement.values)
                .filter((value: IComplementValue) => {
                  return value.quantity;
                }),
            };
          })
          .filter((complement) => {
            return complement.values.length > 0;
          }),
      };
    }),
  };
}
