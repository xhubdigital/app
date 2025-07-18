<template>
  <router-link
    class="order-item"
    :to="`/orders/${order.id}`"
  >
    <div class="header flex q-col-gutter-xs">
      <div class="date">{{ date }}</div>
      <div>{{ $t('•') }}</div>
      <div
        :class="color"
        class="text-bold"
      >
        {{ statusLabel }}
      </div>
      <q-space />
      <div class="count">
        {{ $t('orders.cartItems', { count: countItems }) }}
      </div>
    </div>
    <q-separator />
    <div class="products">
      <div
        v-for="item in order.items.slice(0, 2)"
        :key="item.id"
      >
        {{ item.product.label }}
      </div>
      <div
        v-if="order.items.length > 2"
        class="more-items-label"
      >
        {{ $t('orders.moreItems', { count: order.items.length - 2 }) }}
      </div>
    </div>
  </router-link>
</template>

<script lang="ts">
import { Vue, Prop } from 'vue-property-decorator';
import { sum, pathOr } from 'ramda';
import moment from 'moment';

import { OrderStatus } from '@models/ICart';
import { IOrder } from '@models/IOrder';

export default class OrderItem extends Vue {
  @Prop({ required: true }) order!: IOrder;

  get countItems() {
    return sum(this.order.items.map((item) => item.quantity));
  }

  get date() {
    return moment(this.order.createdAt).format('HH:mm');
  }

  get color() {
    return {
      [OrderStatus.Pending]: 'text-primary',
      [OrderStatus.Production]: 'text-primary',
      [OrderStatus.Delivering]: 'text-primary',
      [OrderStatus.Done]: 'text-positive',
      [OrderStatus.Cancelled]: 'text-negative',
    }[this.order.status];
  }

  get statusLabel() {
    const reason = pathOr<string>('', ['cancelReason'], this.order);

    return {
      [OrderStatus.Pending]: this.$t('orders.statusPending'),
      [OrderStatus.Production]: this.$t('orders.statusProduction'),
      [OrderStatus.Delivering]: this.$t('orders.statusDelivering'),
      [OrderStatus.Done]: this.$t('orders.statusDone'),
      [OrderStatus.Cancelled]: this.$t('orders.statusCancelled', { reason }),
    }[this.order.status];
  }

}
</script>

<style lang="scss" scoped>
.order-item {
  display: block;
  border: 1px solid $grey-4;
  border-radius: 6px;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .2);

  &:hover {
    background: $grey-1;
  }

  .header {
    padding: 6px;

    .date {
      font-weight: bold;
    }

    .count {
      font-size: 0.8rem;
      font-weight: bold;
      color: $grey-6;
    }
  }

  .products {
    padding: 6px;
  }

  .more-items-label {
    font-size: 0.7rem;
    font-weight: bold;
    color: $grey-5;
  }
}
</style>
