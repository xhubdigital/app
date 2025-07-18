<template>
  <div>
    <div class="flex">
      <div>{{ $t('Pagamento na entrega:') }}</div>
      <q-space />
      <div class="text-bold">{{ paymentOption }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop } from 'vue-property-decorator';

import { ICart, PaymentMethodType } from 'src/models/ICart';

export default class OrderPaymentInfo extends Vue {
  @Prop({ required: true }) order!: ICart;

  get paymentOption(): string {
    const { paymentInfo } = this.order;

    if (!paymentInfo) {
      return '';
    }

    const { type, changeFor } = paymentInfo;

    if (type === PaymentMethodType.MoneyOnDelivery) {
      const changeLabel = changeFor
        ? `Troco para ${this.$n(changeFor, 'currency')}`
        : 'Sem troco';

      return `Dinheiro - ${changeLabel}`;
    }

    return {
      [PaymentMethodType.CreditCardOnDelivery]: 'Cartão de crédito',
      [PaymentMethodType.DebitCardOnDelivery]: 'Cartão de débito',
    }[type];
  }
}
</script>
