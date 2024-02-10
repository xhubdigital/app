import { IUser } from '@models/IUser';

export interface IUserState {
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
}

function state(): IUserState {
  return {
    user: null,
    accessToken: null,
    refreshToken: null,
  };
}

export default state;
