import { values } from 'ramda';

import { ICartItemComplementValue, IComplementValue } from 'src/models/ICart';

export function getComplementItemPrice(item: ICartItemComplementValue): number {
  const cValues: IComplementValue[] = values(item.values);

  return cValues.reduce((total: number, cValue: IComplementValue) => {
    return total + (cValue.quantity * cValue.complementGroupOption.price);
  }, 0);
}
