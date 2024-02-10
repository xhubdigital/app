<template>
  <div class="footer">
    <template v-if="isStoreOpen && activeCart.items.length > 0">
      <router-link
        class="cart flex text-bold text-white"
        to="/cart"
      >
        <div>
          <q-icon
            name="mdi-shopping"
            size="sm"
            class="q-pr-xs"
          />
          {{ $t('cart.cartItems', { count: countItems }) }}
        </div>
        <q-space />
        <div class="price">
          {{ $n(total, 'currency') }}
        </div>
      </router-link>
      <q-separator />
    </template>
    <div class="row menu">
      <router-link
        v-for="link in menuLinks"
        :key="link.label"
        class="col item"
        :class="link.class"
        :to="link.to"
      >
        <q-icon
          :name="link.icon"
        />
        <div class="label">
          {{ link.label }}
        </div>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { mapGetters } from 'vuex';
import { sum } from 'ramda';

import { getCartItemPrice } from '@helpers/getCartItemPrice';
import { ICart } from '@models/ICart';
import { IUser } from '@models/IUser';

@Options({
  components: {},
  computed: {
    ...mapGetters('store', [
      'isStoreOpen',
    ]),
    ...mapGetters('cart', [
      'activeCart',
    ]),
    ...mapGetters('user', [
      'user',
    ]),
  },
})
export default class DashboardFooter extends Vue {
  isStoreOpen!: boolean;
  activeCart!: ICart;
  user!: IUser;

  get countItems() {
    return sum(this.activeCart.items.map((item) => item.quantity));
  }

  get total() {
    return sum(this.activeCart.items.map(getCartItemPrice));
  }

  get menuLinks() {
    const links = [
      {
        class: 'home',
        label: this.$t('dashboard.home'),
        icon: 'mdi-home',
        to: '/',
      },
      {
        class: 'orders',
        label: this.$t('dashboard.orders'),
        icon: 'mdi-receipt',
        to: '/orders',
      },
    ];

    const userLink = this.user ? {
      class: 'profile',
      label: this.$t('dashboard.profile'),
      icon: 'mdi-account',
      to: '/profile',
    } : {
      class: 'signIn',
      label: this.$t('dashboard.signIn'),
      icon: 'mdi-login',
      to: '/sign-in',
    };

    return [...links, userLink];
  }
}
</script>

<style lang="scss" scoped>
.footer {
  margin: 0 auto;
  border-radius: 12px 12px 0 0;
  background: black;
  max-width: 800px;

  .cart {
    background: red;
    cursor: pointer;
    align-items: center;
    padding: 16px;
    border-radius: 12px 12px 0 0;

    .price {
      font-size: 1.2rem;
      font-weight: 300;
    }
  }

  .menu {
    display: flex;
    justify-content: center;

    .item {
      color: white;
      opacity: 0.5;
      padding: 6px;
      display: block;
      text-align: center;
      border-radius: 6px;

      .q-icon {
        font-size: 1.6rem;
      }

      .label {
        font-size: 0.7rem;
        padding-top: 3px;
      }

      &.router-link-exact-active.home, &.router-link-active:not(.home) {
        opacity: 1;
      }

      &:hover:not(.router-link-active) {
        opacity: 0.6;
      }
    }
  }
}
</style>
