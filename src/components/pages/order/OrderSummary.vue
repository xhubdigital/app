<template>
  <div>
    <div class="subtotal flex">
      <div>{{ $t('Subtotal:') }}</div>
      <q-space />
      <div>{{ $n(subtotal, 'currency') }}</div>
    </div>
    <div class="service-fee flex">
      <div>
        {{ isDelivery ? $t('Taxa de entrega$t') : $t('Taxa de serviço') }}
      </div>
      <q-space />
      <div>
        {{ serviceFee ? $n(serviceFee, 'currency') : $t('Grátis') }}
      </div>
    </div>
    <div class="total flex">
      <div>{{ $t('Total:') }}</div>
      <q-space />
      <div>{{ $n(total, 'currency') }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop } from 'vue-property-decorator';

import { OrderType } from '@models/ICart';
import { IOrder } from '@models/IOrder';

export default class OrderSummary extends Vue {
  @Prop({ required: true }) order!: IOrder;

  get isDelivery() {
    return this.order.type === OrderType.Delivery;
  }

  get subtotal(): number {
    return this.order.subTotal;
  }

  get serviceFee(): number {
    return this.order.serviceFee || 0;
  }

  get total(): number {
    return this.subtotal + this.serviceFee;
  }
}
</script>

<style lang="scss" scoped>
.subtotal {
  font-weight: bold;
}

.service-fee {
  color: $grey-6;
}

.total {
  font-size: 1.1rem;
  font-weight: bold;
}
</style>
