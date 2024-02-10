<template>
  <div class="full-height column">
    <basic-dialog-layout
      :title="$t('orders.orderDetails')"
      @back-click="$router.back"
    >
      <div class="q-pa-md q-col-gutter-md">
        <div
          v-if="!isEnded"
          class="delivery-prevision"
        >
          <div class="label">
            {{ $t('Previsão de entrega') }}
          </div>
          <div class="time">
            {{ `${startTimeFormatted} - ${endTimeFormatted}` }}
          </div>
        </div>
        <div class="progress-bar">
          <order-progress-bar :order="order" />
        </div>
        <div>
          <q-separator />
        </div>
        <div>
          <order-delivery-info :order="order" />
        </div>
        <div>
          <q-separator />
        </div>
        <div>
          <order-items :order="order" />
        </div>
        <div>
          <q-separator />
        </div>
        <div>
          <order-summary :order="order" />
        </div>
        <div>
          <q-separator />
        </div>
        <div>
          <order-payment-info :order="order" />
        </div>
      </div>
    </basic-dialog-layout>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import moment from 'moment';

import { IOrder } from '@models/IOrder';
import { OrderStatus } from '@models/ICart';
import { IStore } from '@models/IStore';

import BasicDialogLayout from '@layouts/BasicDialogLayout.vue';

import OrderProgressBar from './OrderProgressBar.vue';
import OrderDeliveryInfo from './OrderDeliveryInfo.vue';
import OrderItems from './OrderItems.vue';
import OrderSummary from './OrderSummary.vue';
import OrderPaymentInfo from './OrderPaymentInfo.vue';

@Options({
  components: {
    BasicDialogLayout,
    OrderProgressBar,
    OrderDeliveryInfo,
    OrderItems,
    OrderSummary,
    OrderPaymentInfo,
  },
  computed: {
    ...mapGetters('store', ['store']),
  },
})
export default class OrderDetails extends Vue {
  store!: IStore;

  @Prop({ required: true }) order!: IOrder;

  get isEnded() {
    return this.order.status === OrderStatus.Cancelled ||
      this.order.status === OrderStatus.Done;
  }

  get startTime() {
    return moment(this.order.expectedConclusion);
  }

  get startTimeFormatted() {
    return this.startTime.format('HH:mm');
  }

  get endTimeFormatted() {
    return this.startTime.clone().add(10, 'minutes').format('HH:mm');
  }

  close() {
    void this.$router.back();
  }
}
</script>

<style lang="scss" scoped>
.delivery-prevision {
  .label {
    color: $grey-6;
    font-weight: 700;
  }

  .time {
    font-size: 1.5rem;
    font-weight: bold;
  }
}
</style>
