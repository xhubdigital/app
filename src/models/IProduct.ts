import { IComplementGroupItem } from './IComplementGroupItem';

export interface IProduct {
  id: string;
  label: string;
  description?: string;
  price: number;
  picture?: string;
  position: number;
  complementGroups: IComplementGroupItem[];
}
