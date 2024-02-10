import { values } from 'ramda';

import { ICartItem, ICartItemComplementValue } from 'src/models/ICart';

import { getComplementItemPrice } from './getComplementItemPrice';

export function getCartItemPrice(cartItem: ICartItem) {
  const { quantity, complements } = cartItem;

  const complementsValues = values(complements);

  const totalComplements = complementsValues
    .reduce((curr: number, cValue: ICartItemComplementValue) => {
      return curr + getComplementItemPrice(cValue);
    }, 0);

  return (cartItem.product.price + totalComplements) * quantity;
}
