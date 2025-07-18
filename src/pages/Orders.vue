<template>
  <no-auth-empty-state v-if="!user" />
  <loading-orders v-else-if="orders.loading" />
  <no-orders-empty-state v-else-if="orders.data.length === 0" />
  <orders-list
    v-else
    :orders="orderedOrders"
  />
  <router-view v-slot="{ Component }">
    <q-dialog
      class="right-side-dialog"
      :model-value="$route.meta.isDialog"
      :position="$q.screen.lt.sm ? 'bottom' : 'right'"
      maximized
      full-height
      no-route-dismiss
      @hide="onCloseDialog"
    >
      <div class="content">
        <component :is="Component" />
      </div>
    </q-dialog>
  </router-view>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { mapGetters } from 'vuex';
import { reverse, sortBy, prop } from 'ramda';

import { ILoadable } from '@helpers/ILoadable';
import { getOrders } from '@api/orders';
import { IUser } from '@models/IUser';
import { IOrder } from '@models/IOrder';
import NoAuthEmptyState from '@components/pages/orders/NoAuthEmptyState.vue';
import LoadingOrders from '@components/pages/orders/LoadingOrders.vue';
import NoOrdersEmptyState
  from '@components/pages/orders/NoOrdersEmptyState.vue';
import { OrdersList } from '@components/pages/orders/orders-list';

@Options({
  components: {
    NoAuthEmptyState,
    NoOrdersEmptyState,
    LoadingOrders,
    OrdersList,
  },
  computed: {
    ...mapGetters('user', [
      'user',
    ]),
  },
})
export default class Orders extends Vue {
  user!: IUser | null;

  orders: ILoadable<IOrder> = {
    data: [],
    loading: false,
  };

  get orderedOrders(): IOrder[] {
    return reverse(sortBy(prop('createdAt'), this.orders.data));
  }

  created() {
    if (this.user) {
      void this.loadOrders();
    }
  }

  async loadOrders() {
    try {
      this.orders.loading = true;

      this.orders.data = await getOrders();

      this.orders.loading = false;
    } catch {
      this.orders.loading = false;
    }
  }

  onCloseDialog() {
    void this.$router.push('/orders');
  }
}
</script>
