import { api } from '@boot/axios';
import { IAddress } from '@models/IAddress';
import { IServiceInfo } from '@models/IServiceInfo';
import { IStore } from '@models/IStore';

export async function getStoreByURL(url: string): Promise<IStore> {
  const response = await api.get<IStore>('/restaurants/by-url', {
    params: { url },
  });

  return response.data;
}

export function getBaseStore(): Partial<IStore> {
  return {
    theme: {
      mainColor: '#000',
    },
  };
}

export async function getServiceInfo(
  address: IAddress | null,
): Promise<IServiceInfo> {
  const response = await api
    .post<IServiceInfo>('restaurants/service-info', address);

  return response.data;
}
