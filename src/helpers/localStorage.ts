export const USER_TOKEN_KEY = 'ut';
export const REFRESH_TOKEN_KEY = 'rt';
export const ADDRESS_KEY = 'adr_id';
export const CART_KEY = 'c_items';

class LocalStorageHelper {
  get<T>(key: string) {
    const value = localStorage.getItem(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  }

  set(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }
}

export const localStorageHelper = new LocalStorageHelper();
