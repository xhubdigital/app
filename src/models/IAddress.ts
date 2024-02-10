export interface IAddress {
  id?: string;
  zipCode: string;
  state: string;
  city: string;
  neighborhood: string;
  streetName: string;
  number: string;
  complement?: string;
}
