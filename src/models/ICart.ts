import { IAddress } from './IAddress';
import { IComplementGroup } from './IComplementGroup';
import { IComplementGroupOption } from './IComplementGroupOption';
import { IProduct } from './IProduct';

export enum PaymentMethodType {
  CreditCardOnDelivery = 'credit-card-on-delivery',
  DebitCardOnDelivery = 'debit-card-on-delivery',
  MoneyOnDelivery = 'money-on-delivery',
}

export interface PaymentMethod {
  type: PaymentMethodType;
  changeFor?: number;
}

export enum OrderType {
  Delivery = 'delivery',
  Takeout = 'takeout',
  Local = 'local',
}

export enum OrderStatus {
  Pending = 'pending',
  Cancelled = 'cancelled',
  Production = 'production',
  Delivering = 'delivery',
  Done = 'done',
}

export type IComplementValue = {
  quantity: number;
  complementGroupOption: IComplementGroupOption;
}

export type IComplementValues = {
  [key: string]: IComplementValue;
}

export interface ICartItemComplementValue {
  complementGroup: IComplementGroup;
  values: IComplementValues;
}

export interface ICartItemComplementValues {
  [key: string]: ICartItemComplementValue;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
  complements: ICartItemComplementValues;
  observations: string | null;
}

export interface ICart {
  id?: string;
  type: OrderType;
  status: OrderStatus;
  address: IAddress | null;
  paymentInfo: PaymentMethod | null;
  serviceFee?: number;
  expectedConclusion?: Date;
  items: ICartItem[];
  createdAt?: Date;
}
