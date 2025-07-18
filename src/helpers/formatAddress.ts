import { IAddress } from 'src/models/IAddress';

export function formatAddress(address: IAddress) {
  const { state, city, neighborhood, streetName, number, complement } = address;

  const complementText = complement ? ` - ${complement}` : '';

  const adr = `${streetName}, ${number} - ${neighborhood}, ${city}/${state}`;

  return adr + complementText;
}
