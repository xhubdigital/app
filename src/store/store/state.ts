import { IStore } from 'src/models/IStore';

export interface IStoreState {
  store: IStore | null;
}

function state(): IStoreState {
  return {
    store: null,
  };
};

export default state;
