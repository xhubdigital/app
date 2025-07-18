<template>
  <div
    v-if="loading || !order"
    class="full-height flex flex-center"
  >
    <q-spinner
      size="80px"
      color="primary"
    />
  </div>
  <order-details
    v-else
    :order="order"
  />
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

import { getOrder } from '@api/orders';
import { IOrder } from '@models/IOrder';

import OrderDetails from 'components/pages/order/OrderDetails.vue';

@Options({
  components: { OrderDetails },
})
export default class Details extends Vue {
  loading: boolean = false;
  order: IOrder | null = null;

  interval: number | undefined = undefined;

  get orderId(): string {
    const { id } = this.$route.params;

    return id as string;
  }

  created() {
    void this.loadOrder();
  }

  mounted() {
    this.interval = setInterval(
      () => void this.reloadOrder(),
      10000,
    ) as unknown as number;
  }

  beforeUnmount() {
    clearInterval(this.interval);
  }

  async loadOrder() {
    try {
      this.loading = true;

      this.order = await getOrder(this.orderId);

      this.loading = false;
    } catch {
      this.loading = false;
    }
  }

  async reloadOrder() {
    this.order = await getOrder(this.orderId);
  }
}
</script>
