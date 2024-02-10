import { api } from '@boot/axios';

import { IComplementGroupItem } from '@models/IComplementGroupItem';
import { IProduct } from '@models/IProduct';
import { IProductCategory } from '@models/IProductCategory';

interface IOrderable {
  position: number;
}

function sortByPosition(a: IOrderable, b: IOrderable) {
  return a.position - b.position;
}

function prepareProduct(product: IProduct) {
  return {
    ...product,
    complementGroups: product.complementGroups
      .sort(sortByPosition)
      .map((item: IComplementGroupItem) => {
        return {
          ...item,
          complementGroup: {
            ...item.complementGroup,
            options: item.complementGroup.options.sort(sortByPosition),
          },
        };
      }),
  };
}

export async function getProductCategories(): Promise<IProductCategory[]> {
  const response = await api
    .get<IProductCategory[]>('product-categories/with-products');

  return response.data;
}

export async function getProduct(id: string): Promise<IProduct> {
  const response = await api
    .get<IProduct>(`products/${id}`);

  return prepareProduct(response.data);
}
