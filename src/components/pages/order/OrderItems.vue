<template>
  <div>
    <div class="header">
      {{ $t('Itens do pedido') }}
    </div>
    <div class="order-items q-col-gutter-md">
      <div
        v-for="item in order.items"
        :key="item.product.id"
        class="order-item"
      >
        <div class="flex items-center no-wrap">
          <div class="flex items-center no-wrap">
            <div class="quantity">{{ item.quantity }}</div>
            <div class="product-name">{{ item.product.label }}</div>
          </div>
          <q-space />
          <div class="q-pl-sm">
            {{ $n(getItemPrice(item), 'currency') }}
          </div>
        </div>
        <div
          v-for="complement in item.complements"
          :key="complement.complementGroup.id"
        >
          <div
            v-for="value in complement.values"
            :key="value.complementGroupOption.id"
          >
            <template v-if="complement.complementGroup.multiple">
              {{ `${value.quantity}x` }}
            </template>
            {{ value.complementGroupOption.label }}
          </div>
        </div>
        <div v-if="item.observations">
          {{ `Observações: ${item.observations}` }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop } from 'vue-property-decorator';

import { IOrder, IOrderItem } from '@models/IOrder';

export default class OrderItems extends Vue {
  @Prop({ required: true }) order!: IOrder;

  getItemPrice(item: IOrderItem): number {
    const complementsPrice = item.complements.reduce((curr, complement) => {
      const complements = complement.values.reduce((curr, option) => {
        return curr + (option.quantity * option.price);
      }, 0);

      return curr + complements;
    }, 0);

    return (item.price + complementsPrice) * item.quantity;
  }
}
</script>

<style lang="scss" scoped>
.header {
  font-weight: bold;
  font-size: 1.2rem;
  padding-bottom: 8px;
}

.quantity {
  padding: 2px 8px;
  margin-right: 8px;
  background: $grey-3;
  border: 1px solid $grey-5;
  border-radius: 2px;
  font-weight: 700;
}

.product-name {
  font-weight: 700;
}
</style>
