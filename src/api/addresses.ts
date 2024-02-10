import { api } from '@boot/axios';

import { IAddress } from '@models/IAddress';

export async function saveAddress(address: IAddress): Promise<IAddress> {
  const response = await api.post<IAddress>('clients/addresses', address);

  return response.data;
}

export async function getAddresses(): Promise<IAddress[]> {
  const response = await api.get<IAddress[]>('clients/addresses');

  return response.data;
}

export async function getAddress(id: string): Promise<IAddress> {
  const response = await api.get<IAddress>(`clients/addresses/${id}`);

  return response.data;
}

export async function deleteAddress(id: string): Promise<unknown> {
  const response = await api.delete<unknown>(`clients/addresses/${id}`);

  return response.data;
}
