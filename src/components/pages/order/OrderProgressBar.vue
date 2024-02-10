<template>
  <div class="progress-bar">
    <div class="row q-col-gutter-sm">
      <div class="col-2">
        <q-linear-progress
          rounded
          size="md"
          v-bind="pendingStatus"
        />
      </div>
      <div class="col-5">
        <q-linear-progress
          rounded
          size="md"
          v-bind="productionStatus"
        />
      </div>
      <div class="col-5">
        <q-linear-progress
          rounded
          size="md"
          v-bind="deliveryStatus"
        />
      </div>
    </div>
    <div class="status flex items-center">
      <div class="dot flex">
        <q-badge
          :color="color"
          rounded
        />
      </div>
      <div class="label q-py-xs q-px-sm">
        {{ label }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Prop } from 'vue-property-decorator';
import { pathOr } from 'ramda';

import { ICart, OrderStatus } from 'src/models/ICart';

export default class OrderProgressBar extends Vue {
  @Prop({ required: true }) order!: ICart;

  get status() {
    return this.order.status;
  }

  get color() {
    return {
      [OrderStatus.Pending]: 'primary',
      [OrderStatus.Production]: 'primary',
      [OrderStatus.Delivering]: 'primary',
      [OrderStatus.Done]: 'positive',
      [OrderStatus.Cancelled]: 'negative',
    }[this.status];
  }

  get label() {
    const reason = pathOr<string>('', ['cancelReason'], this.order);

    return {
      [OrderStatus.Pending]: this.$t('orders.statusPending'),
      [OrderStatus.Production]: this.$t('orders.statusProduction'),
      [OrderStatus.Delivering]: this.$t('orders.statusDelivering'),
      [OrderStatus.Done]: this.$t('orders.statusDone'),
      [OrderStatus.Cancelled]: this.$t('orders.statusCancelled', { reason }),
    }[this.status];
  }

  get pendingStatus() {
    return {
      color: this.color,
      indeterminate: {
        [OrderStatus.Pending]: true,
        [OrderStatus.Production]: false,
        [OrderStatus.Delivering]: false,
        [OrderStatus.Done]: false,
        [OrderStatus.Cancelled]: false,
      }[this.status],
      value: {
        [OrderStatus.Pending]: 0,
        [OrderStatus.Production]: 1,
        [OrderStatus.Delivering]: 1,
        [OrderStatus.Done]: 1,
        [OrderStatus.Cancelled]: 1,
      }[this.status],
    };
  }

  get productionStatus() {
    return {
      color: this.color,
      indeterminate: {
        [OrderStatus.Pending]: false,
        [OrderStatus.Production]: true,
        [OrderStatus.Delivering]: false,
        [OrderStatus.Done]: false,
        [OrderStatus.Cancelled]: false,
      }[this.status],
      value: {
        [OrderStatus.Pending]: 0,
        [OrderStatus.Production]: 1,
        [OrderStatus.Delivering]: 1,
        [OrderStatus.Done]: 1,
        [OrderStatus.Cancelled]: 1,
      }[this.status],
    };
  }

  get deliveryStatus() {
    return {
      color: this.color,
      indeterminate: {
        [OrderStatus.Pending]: false,
        [OrderStatus.Production]: false,
        [OrderStatus.Delivering]: true,
        [OrderStatus.Done]: false,
        [OrderStatus.Cancelled]: false,
      }[this.status],
      value: {
        [OrderStatus.Pending]: 0,
        [OrderStatus.Production]: 0,
        [OrderStatus.Delivering]: 1,
        [OrderStatus.Done]: 1,
        [OrderStatus.Cancelled]: 1,
      }[this.status],
    };
  }
}
</script>
