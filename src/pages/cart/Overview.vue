<template>
  <div class="full-height column">
    <div class="header flex items-center q-pa-md">
      <q-btn
        icon="mdi-arrow-left"
        unelevated
        size="sm"
        color="green"
        text-color="white"
        round
        to="/menu"
      />
      <div class="title text-bold">
        {{ $t('Sacola') }}
      </div>
      <!-- <div>
        <q-btn
          label="Limpar"
          color="negative"
          flat
          rounded
        />
      </div> -->
    </div>
    <q-separator />
    <q-scroll-area class="scroll-area">
      <div class="cart-overview q-pa-md q-col-gutter-md">
        <div class="order-type">
          <div class="q-pb-md">
            <q-btn-toggle
              unelevated
              spread
              no-caps
              toggle-color="primary"
              color="grey-3"
              text-color="black"
              :options="orderTypeOptions"
              :model-value="activeCart.type"
              @update:model-value="updateOrderType"
            />
          </div>
          <div
            class="row items-center cursor-pointer"
            @click="openAddressField"
          >
            <div class="col-auto q-pr-md">
              <q-avatar
                color="primary"
                text-color="white"
                :icon="addressFieldIcon"
              />
            </div>
            <div class="col">
              <div>
                {{ addressFieldLabel }}
              </div>
              <div class="text-bold">
                {{ address }}
              </div>
            </div>
          </div>
        </div>
        <div class="items-list">
          <cart-item
            v-for="item, index in activeCart.items"
            :key="index"
            :cart-item="item"
            :index="index"
            @edit="onEditCartItem"
            @delete="onDeleteCartItem"
          />
          <q-btn
            flat
            no-caps
            color="primary"
            class="full-width"
            label="Adicionar mais itens"
            to="/menu"
          />
        </div>
        <div class="summary">
          <div class="subtotal flex">
            <div class="label">{{ $t('Subtotal') }}</div>
            <q-space />
            <div>{{ $n(subTotal, 'currency') }}</div>
          </div>
          <div
            v-if="serviceFee !== -1"
            class="service-fee flex"
          >
            <div class="label">
              {{ isDelivery ? $t('Taxa de entrega') : $t('Taxa de serviço') }}
            </div>
            <q-space />
            <div v-if="serviceInfoLoading">
              <q-skeleton width="80px" />
            </div>
            <div v-else>
              {{ serviceFee ? $n(serviceFee, 'currency') : $t('Grátis') }}
            </div>
          </div>
          <div class="total flex">
            <div class="label">{{ $t('Total') }}</div>
            <q-space />
            <div>{{ $n(total, 'currency') }}</div>
          </div>
        </div>
        <div>
          <div
            class="payment-method"
            @click="openPaymentMethodDialog"
          >
            <div
              v-if="activeCart.paymentInfo === null"
              class="empty-payment-method"
            >
              <q-icon
                class="q-pr-sm"
                name="mdi-cash"
                size="md"
              />
              {{ $t('Selecionar método de pagamento') }}
            </div>
            <div
              v-else
              class="q-pa-sm row items-center q-col-gutter-sm"
            >
              <div class="col-auto">
                <q-avatar
                  color="positive"
                  text-color="white"
                  :icon="selectedPaymentTypeData.icon"
                />
              </div>
              <div class="col">
                <div class="text-bold">{{ $t('Pagamento') }}</div>
                <div class="payment-method-value">
                  {{ selectedPaymentTypeData.label }}
                  <template
                    v-if="activeCart.paymentInfo.type === 'money-on-delivery'"
                  >
                    {{ $t(' - ') }}
                    <template v-if="activeCart.paymentInfo.changeFor">
                      {{ $t('Troco para') }}
                      {{ $n(activeCart.paymentInfo.changeFor, 'currency') }}
                    </template>
                    <template v-else>
                      {{ $t('Sem troco') }}
                    </template>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="!user"
          class="flex flex-center no-wrap"
        >
          <div class="on-left">
            <q-icon size="32px" name="mdi-alert-circle" />
          </div>
          <div>
            {{ $t('cart.notAuthenticatedWarning') }}
          </div>
        </div>
      </div>
    </q-scroll-area>
    <div class="footer">
      <div class="q-pa-md q-col-gutter-md">
        <div>
          <q-btn
            class="full-width q-py-md"
            :color="submitButtonColor"
            unelevated
            no-caps
            :loading="makingOrder"
            @click="submitButtonAction"
          >
            <div>{{ submitButtonLabel }}</div>
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Watch } from 'vue-property-decorator';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { path, pathOr } from 'ramda';

import { IStore } from '@models/IStore';
import { IUser } from '@models/IUser';
import {
  ICart,
  ICartItem,
  PaymentMethod,
  PaymentMethodType,
  OrderType,
} from '@models/ICart';
import { IProduct } from '@models/IProduct';
import { formatAddress } from '@helpers/formatAddress';
import { makeOrder } from '@api/orders';
import CartItem from '@components/pages/cart/CartItem.vue';
import PaymentMethodPicker
  from '@components/pages/cart/PaymentMethodPicker.vue';
import AddressFormDialog from '@pages/address/AddressFormDialog.vue';

import EditingCartItemDialog from './EditingCartItemDialog.vue';

const paymentTypeMapping = {
  [PaymentMethodType.CreditCardOnDelivery]: {
    label: 'Cartão de crédito',
    icon: 'mdi-credit-card',
  },
  [PaymentMethodType.DebitCardOnDelivery]: {
    label: 'Cartão de débito',
    icon: 'mdi-credit-card',
  },
  [PaymentMethodType.MoneyOnDelivery]: {
    label: 'Dinheiro',
    icon: 'mdi-cash',
  },
};

const newOrderErrorMapping = {
  STORE_CLOSED: 'storeClosedError',
  ITEM_OUT_OF_STOCK: 'itemOutOfStockError',
  COMPLEMENT_OPTION_DISABLED: 'complementOptionDisabledError',
};

@Options({
  components: { CartItem },
  computed: {
    ...mapGetters('store', [
      'store',
      'isStoreOpen',
    ]),
    ...mapGetters('cart', [
      'serviceInfoLoading',
      'activeCart',
      'subTotal',
      'serviceFee',
      'total',
    ]),
    ...mapGetters('user', [
      'user',
    ]),
    ...mapGetters('products', [
      'productsMapping',
    ]),
  },
  methods: {
    ...mapActions('store', [
      'loadStore',
    ]),
    ...mapActions('products', [
      'loadProductCategories',
    ]),
    ...mapActions('cart', [
      'clearCart',
      'saveItem',
      'removeItem',
      'updateOrderType',
    ]),
    ...mapMutations('cart', [
      'updatePaymentMethod',
    ]),
  },
})
export default class Overview extends Vue {
  store!: IStore;
  isStoreOpen!: boolean;
  serviceInfoLoading!: boolean;
  activeCart!: ICart;
  subTotal!: number;
  serviceFee!: number;
  total!: number;
  user!: IUser;
  productsMapping!: { [key: string]: IProduct };
  loadStore!: () => void;
  loadProductCategories!: () => void;
  clearCart!: () => void;
  saveItem!: (data: { cartItem: ICartItem, index?: number }) => void;
  removeItem!: (index: number) => void;
  updateOrderType!: (orderType: OrderType) => void;
  updatePaymentMethod!: (paymentInfo: PaymentMethod) => void;

  makingOrder: boolean = false;

  get firstCartPendency(): string {
    const { address, type, paymentInfo } = this.activeCart;

    if (!address && type === OrderType.Delivery) {
      return 'MISSING_ADDRESS';
    }

    if (this.serviceFee === -1) {
      return 'OUT_OF_DELIVERY_AREA';
    }

    if (!this.user) {
      return 'NOT_AUTHENTICATED';
    }

    if (!paymentInfo) {
      return 'MISSING_PAYMENT_METHOD';
    }

    return 'NO_PENDENCY';
  }

  get submitButtonColor() {
    return this.firstCartPendency === 'OUT_OF_DELIVERY_AREA'
      ? 'negative'
      : 'positive';
  }

  get submitButtonLabel() {
    return {
      MISSING_ADDRESS: 'Selecione o endereço para entrega',
      OUT_OF_DELIVERY_AREA: 'Fora da área de entrega',
      NOT_AUTHENTICATED: 'Acessar minha conta',
      MISSING_PAYMENT_METHOD: 'Selecione o método de pagamento',
      INCOMPLETE_USER_DATA: 'Informe seus dados pessoais',
      NO_PENDENCY: 'Realizar pedido',
    }[this.firstCartPendency];
  }

  get orderTypeOptions() {
    return [
      {
        label: 'Entrega',
        value: OrderType.Delivery,
      },
      {
        label: 'Retirada',
        value: OrderType.Takeout,
      },
      {
        label: 'Consumir no local',
        value: OrderType.Local,
      },
    ];
  }

  get addressFieldIcon() {
    return {
      [OrderType.Delivery]: 'mdi-map-marker',
      [OrderType.Takeout]: 'mdi-walk',
      [OrderType.Local]: 'mdi-store',
    }[this.activeCart.type];
  }

  get addressFieldLabel() {
    return {
      [OrderType.Delivery]: 'Entregar em',
      [OrderType.Takeout]: 'Retirar em',
      [OrderType.Local]: 'Consumir em',
    }[this.activeCart.type];
  }

  get isDelivery() {
    return this.activeCart.type === OrderType.Delivery;
  }

  get address() {
    if (!this.isDelivery) {
      return formatAddress(this.store.address);
    }

    return this.activeCart.address
      ? formatAddress(this.activeCart.address)
      : 'Selecionar um endereço para entrega';
  }

  get selectedPaymentTypeData(): { label: string; icon: string } {
    if (!this.activeCart.paymentInfo) {
      return { label: '', icon: '' };
    }

    return paymentTypeMapping[this.activeCart.paymentInfo.type];
  }

  @Watch('activeCart.items')
  onChangeCartItems() {
    this.checkRedirect();
  }

  mounted() {
    this.checkRedirect();
  }

  checkRedirect() {
    if (this.activeCart.items.length === 0 || !this.isStoreOpen) {
      void this.$router.push('/menu');
    }
  }

  openAddressField() {
    if (this.activeCart.type !== OrderType.Delivery) {
      return;
    }

    this.$q.dialog({
      component: AddressFormDialog,
      componentProps: {
        class: 'dialog',
        position: this.$q.screen.lt.sm ? 'bottom' : 'right',
        maximized: true,
        'full-height': true,
      },
    });
  }

  openPaymentMethodDialog() {
    this.$q.dialog({
      component: PaymentMethodPicker,
    }).onOk(this.updatePaymentMethod);
  }

  redirectToAuthPage() {
    void this.$router.push('/sign-in');
  }

  async makeOrder() {
    try {
      this.makingOrder = true;

      const order: ICart = await makeOrder(this.activeCart, this.user);

      if (order.id) {
        await this.$router.push(`/order/${order.id}`);

        this.clearCart();
      }

      this.makingOrder = false;
    } catch (error) {
      const notifications = 'cart.notifications';
      const errorMessage: string =
        pathOr('', ['response', 'data', 'message'], error);

      const errorKey = pathOr(
        'makeOrderGenericError',
        [errorMessage],
        newOrderErrorMapping,
      );

      const meta = this.buildErrorMetaObj(errorMessage, error);

      console.log({ meta });

      this.$q.notify({
        type: 'negative',
        message: this.$t(`${notifications}.${errorKey}.message`, meta),
        caption: this.$t(`${notifications}.${errorKey}.caption`, meta),
      });

      switch (errorMessage) {
        case 'STORE_CLOSED': this.loadStore(); break;
        case 'ITEM_OUT_OF_STOCK': this.loadProductCategories(); break;
        case 'COMPLEMENT_OPTION_DISABLED': this.loadProductCategories(); break;
      }
    } finally {
      this.makingOrder = false;
    }
  }

  buildErrorMetaObj(errorMessage: string, error: unknown) {
    // eslint-disable-next-line max-len
    const productId = path(['response', 'data', 'meta', 'productId'], error) as string;

    switch (errorMessage) {
      case 'COMPLEMENT_OPTION_DISABLED': return {
        product: path([productId, 'label'], this.productsMapping),
      };
      default: return {};
    }
  }

  submitButtonAction() {
    switch (this.firstCartPendency) {
      case 'MISSING_ADDRESS':        return this.openAddressField();
      case 'MISSING_PAYMENT_METHOD': return this.openPaymentMethodDialog();
      case 'NOT_AUTHENTICATED':      return this.redirectToAuthPage();
      case 'NO_PENDENCY':            return this.makeOrder();
    }
  }

  onEditCartItem(item: ICartItem, index: number) {
    this.$q.dialog({
      component: EditingCartItemDialog,
      componentProps: {
        cartItem: item,
        class: 'dialog',
        position: this.$q.screen.lt.sm ? 'bottom' : 'right',
        maximized: true,
        'full-height': true,
      },
    }).onOk((cartItem: ICartItem) => {
      this.saveItem({ cartItem, index });
    });
  }

  onDeleteCartItem(_: ICartItem, index: number) {
    this.removeItem(index);
  }
}
</script>

<style lang="scss" scoped>
.scroll-area {
  flex-grow: 1;
}

.header {
  .title {
    flex-grow: 1;
    text-align: center;
  }
}

.summary {
  .subtotal {
    font-weight: bold;
  }

  .service-fee {
    color: $grey-6;
  }

  .total {
    font-size: 1rem;
    font-weight: bold;
  }
}

.payment-method {
  border: 1px solid $separator-color;
  border-radius: $generic-border-radius;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  .empty-payment-method {
    color: $positive;
    padding: 12px;
    font-weight: bold;
    font-size: 1rem;
  }

  .payment-method-value {
    font-size: 1rem;
  }
}

.footer {
  border-top: 1px solid $separator-color;
}
</style>
