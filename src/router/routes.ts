import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/menu',
    redirect: '/',
  },
  {
    name: 'restaurant/menu',
    path: '/',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [
      {
        path: '/',
        component: () => import('pages/Menu.vue'),
        children: [
          {
            name: 'product/details',
            path: '/product/:id',
            component: () => import('pages/product/Details.vue'),
            meta: {
              isDialog: true,
            },
          },
          {
            name: 'cart/overview',
            path: '/cart',
            component: () => import('pages/cart/Overview.vue'),
            meta: {
              isDialog: true,
            },
          },
          {
            name: 'order/details',
            path: '/order/:id',
            component: () => import('pages/order/Details.vue'),
            meta: {
              isDialog: true,
            },
          },
        ],
      },
      {
        name: 'restaurant/about',
        path: '/about',
        component: () => import('pages/Index.vue'),
      },
      {
        name: 'restaurant/orders',
        path: '/orders',
        component: () => import('pages/Orders.vue'),
        children: [
          {
            name: 'orders/details',
            path: ':id',
            component: () => import('pages/order/Details.vue'),
            meta: {
              isDialog: true,
            },
          },
        ],
      },
      {
        name: 'auth/sign-in',
        path: '/sign-in',
        component: () => import('pages/auth/Auth.vue'),
        meta: {
          isAuth: true,
        },
      },
      {
        name: 'profile/main',
        path: '/profile',
        component: () => import('pages/profile/Profile.vue'),
        meta: {
          requireAuth: true,
        },
        children: [
          {
            name: 'profile/personal-data',
            path: 'info',
            component: () => import('pages/profile/PersonalData.vue'),
            meta: {
              isDialog: true,
              requireAuth: true,
            },
          },
          {
            name: 'profile/addresses',
            path: 'addresses',
            component: () => import('pages/profile/Addresses.vue'),
            meta: {
              isDialog: true,
              requireAuth: true,
            },
          },
        ],
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
