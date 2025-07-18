import { IAddress } from './IAddress';

export interface ITheme {
  mainColor: string;
}

export interface IServiceFee {
  range: number;
  fee: number;
  waitingTime: number;
}

export interface IWorkHour {
  weekDay: number;
  startTime: number;
  endTime: number;
}

export interface IStore {
  id: string;
  name: string;
  picture?: string;
  banner?: string;
  address: IAddress;
  theme: ITheme;
  serviceFees: IServiceFee[];
  workHours: IWorkHour[];
}
