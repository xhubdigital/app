import { IComplementGroupOption } from './IComplementGroupOption';

export interface IComplementGroup {
  id: string;
  label: string;
  position: number;
  required: boolean;
  multiple: boolean;
  repeatOption: boolean;
  maxOptions: number;
  options: IComplementGroupOption[];
}
