import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: process.env.BASE_URL || '/api' });

function setToken(token: string | null) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  api.interceptors.request.use((request) => {
      request.headers
          ? (request.headers.Authorization = `Bearer ${token || ''}`)
          : (request.headers = { Authorization: `Bearer ${token || ''}` });
          return request;
  });
}

function setRestaurant(restaurant: string | null) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  api.interceptors.request.use((request) => {
      request.headers
          ? (request.headers.restaurant = restaurant || '')
          : (request.headers = { restaurant: restaurant || '' });
          return request;
  });
}

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api, setToken, setRestaurant };
