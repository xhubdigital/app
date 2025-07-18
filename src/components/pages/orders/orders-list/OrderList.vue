<template>
  <q-page class="container q-pa-md q-pa-md-lg">
    <div
      v-if="openedOrders.length > 0"
      class="open-orders q-pb-md"
    >
      <div class="q-col-gutter-md">
        <div
          v-for="order in openedOrders"
          :key="order.id"
        >
          <order-item :order="order" />
        </div>
      </div>
    </div>
    <div
      v-if="Object.values(groupedOrders).length > 0"
      class="history q-col-gutter-md"
    >
      <div class="history-title">{{ $t('orders.history') }}</div>
      <div
        v-for="group, date in groupedOrders"
        :key="date"
      >
        <div class="date-label q-pb-md">
          {{ date }}
        </div>
        <div class="q-col-gutter-md">
          <div
            v-for="order in group"
            :key="order.id"
          >
            <order-item :order="order" />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';
import moment from 'moment';
import { groupBy } from 'ramda';

import { OrderStatus } from '@models/ICart';
import { IOrder } from '@models/IOrder';

import OrderItem from './OrderItem.vue';

@Options({
  components: {
    OrderItem,
  },
})
export default class OrderList extends Vue {
  @Prop({ required: true }) orders!: IOrder[];

  get openedOrders() {
    return this.orders.filter((order: IOrder) => {
      return order.status !== OrderStatus.Done &&
        order.status !== OrderStatus.Cancelled;
    });
  }

  get historicalOrders() {
    return this.orders.filter((order: IOrder) => {
      return order.status === OrderStatus.Done ||
        order.status === OrderStatus.Cancelled;
    });
  }

  get groupedOrders() {
    const groups = groupBy((order: IOrder) => {
      return moment(order.createdAt).format('DD/MM/YYYY');
    }, this.historicalOrders);

    return groups;
  }
}
</script>

<style lang="scss" scoped>
.history-title {
  font-size: 1.1rem;
  font-weight: bold;
}

.date-label {
  font-weight: bold;
  font-size: 0.8rem;
  color: $grey-6;
  padding-left: 7px;
}
</style>
