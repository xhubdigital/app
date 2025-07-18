import { IAddress } from './IAddress';
import { OrderStatus, OrderType, PaymentMethod } from './ICart';
import { IComplementGroup } from './IComplementGroup';
import { IComplementGroupOption } from './IComplementGroupOption';
import { IProduct } from './IProduct';

export type IComplementValue = {
  quantity: number;
  price: number;
  complementGroupOption: IComplementGroupOption;
}

export interface IOrderItemComplementValue {
  complementGroup: IComplementGroup;
  values: IComplementValue[];
}

export interface IOrderItem {
  id?: string;
  product: IProduct;
  quantity: number;
  price: number;
  complements: IOrderItemComplementValue[];
  observations: string | null;
}

export interface IOrder {
  id?: string;
  type: OrderType;
  status: OrderStatus;
  cancelReason?: string;
  address: IAddress | null;
  paymentInfo: PaymentMethod | null;
  serviceFee?: number;
  subTotal: number;
  expectedConclusion?: Date;
  items: IOrderItem[];
  createdAt: Date;
}
