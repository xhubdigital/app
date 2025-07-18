<template>
  <q-dialog ref="dialogRef" @hide="hide">
    <q-card class="payment-method-picker">
      <q-card-section class="header">
        {{ $t('Selecionar método de pagamento') }}
      </q-card-section>
      <q-card-section>
        <q-list class="options q-gutter-sm">
          <q-item
            v-for="option in options"
            :key="option.value"
            class="option flex items-center"
            :class="{ 'active': option.value === paymentMethodSelected }"
            clickable
            @click="selectPaymentMethod(option.value)"
          >
            <q-icon
              :name="option.icon"
              size="md"
            />
            <div class="q-pl-sm">
              {{ option.label }}
            </div>
          </q-item>
        </q-list>
        <div
          v-if="isMoney"
          class="row q-pt-md q-col-gutter-md items-center"
        >
          <div class="col">
            <currency-input
              v-model="changeFor"
              label="Troco para"
              autofocus
              :disable="dontNeedChange"
            />
          </div>
          <div class="col-auto">
            <q-btn
              flat
              no-caps
              dense
              color="negative"
              label="Não preciso de troco"
              tag="label"
              @click="toggleDontNeedChange"
            >
              <q-checkbox
                v-model="dontNeedChange"
                color="negative"
              />
            </q-btn>
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="actions flex">
        <q-btn
          flat
          no-caps
          label="Cancelar"
          @click="hide"
        />
        <q-space />
        <q-btn
          color="positive"
          no-caps
          unelevated
          label="Selecionar"
          :disable="paymentMethodSelected === null"
          @click="savePaymentMethod"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Vue, Options, Ref } from 'vue-property-decorator';
import { QDialog } from 'quasar';

import { PaymentMethodType } from 'src/models/ICart';
import CurrencyInput from 'components/form/CurrencyInput.vue';

@Options({
  components: { CurrencyInput },
})
export default class PaymentMethodPicker extends Vue {
  @Ref() dialogRef!: QDialog;

  paymentMethodSelected: PaymentMethodType | null = null;
  changeFor: number = 0;
  dontNeedChange: boolean = false;

  get options() {
    return [
      {
        label: 'Cartão de crédito',
        icon: 'mdi-credit-card',
        value: PaymentMethodType.CreditCardOnDelivery,
      },
      {
        label: 'Cartão de débido',
        icon: 'mdi-credit-card',
        value: PaymentMethodType.DebitCardOnDelivery,
      },
      {
        label: 'Dinheiro',
        icon: 'mdi-cash',
        value: PaymentMethodType.MoneyOnDelivery,
      },
    ];
  }

  get isMoney() {
    return this.paymentMethodSelected === PaymentMethodType.MoneyOnDelivery;
  }

  show() {
    this.dialogRef.show();
  }

  hide() {
    this.dialogRef.hide();
  }

  selectPaymentMethod(value: PaymentMethodType) {
    this.paymentMethodSelected = value;
  }

  savePaymentMethod() {
    this.$emit('ok', {
      type: this.paymentMethodSelected,
      paymentOnDelivery: true,
      changeFor: this.isMoney && !this.dontNeedChange
        ? Number(this.changeFor) : undefined,
    });

    this.hide();
  }

  toggleDontNeedChange() {
    this.dontNeedChange = !this.dontNeedChange;
  }
}
</script>

<style lang="scss" scoped>
.payment-method-picker {
  width: 600px;

  .header {
    background: $primary;
    color: #FFF;
    font-size: 1.2rem;
  }

  .options {
    .option {
      border-radius: $generic-border-radius;

      &.active {
        background: $primary;
        color: #FFF;
      }
    }
  }
}
</style>
