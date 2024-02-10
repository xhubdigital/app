<template>
  <div class="q-col-gutter-md">
    <div class="service-info">
      <div class="flex q-col-gutter-sm items-center">
        <div>
          <q-btn-dropdown
            color="primary"
            :label="selectedTypeLabel"
            unelevated
            menu-anchor="bottom start"
            menu-self="top start"
          >
            <q-list>
              <q-item
                v-for="option in orderTypeOptions"
                :key="option.value"
                v-close-popup
                clickable
                @click="updateOrderType(option.value)"
              >
                <q-item-section>
                  <q-item-label>{{ option.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <div>{{separator}}</div>
        <template v-if="serviceInfoLoading">
          <div>
            <q-skeleton width="150px" />
          </div>
        </template>
        <template v-else>
          <div v-if="isDeliveryWithoutAddress">
            <q-chip
              class="text-bold q-ma-none"
              color="info"
              text-color="white"
            >
              {{ $t('dashboard.selectDeliveryArea') }}
            </q-chip>
          </div>
          <template v-else-if="isInsideDeliveryArea">
            <div class="service-fee">
              {{ serviceFeeLabel }}
            </div>
            <div>{{separator}}</div>
            <div>
              {{ `${waitingTime} minutos` }}
            </div>
            <template v-if="distance > 0">
              <div>{{separator}}</div>
              <div class="distance">
                {{ `${(distance / 1000).toFixed(2)} km` }}
              </div>
            </template>
          </template>
          <template v-else>
            <div>
              <q-chip
                class="text-bold q-ma-none"
                color="negative"
                text-color="white"
              >
                {{ $t('Fora da área de entrega') }}
              </q-chip>
            </div>
          </template>
        </template>
      </div>
    </div>
    <div v-if="isDelivery">
      <div
        class="user-address cursor-pointer"
        @click="openAddressForm"
      >
        <q-icon
          class="q-pr-sm"
          name="mdi-moped"
          size="sm"
        />
        <template v-if="cartDeliveryAddress">
          {{ cartDeliveryAddress }}
        </template>
        <template v-else>
          {{ $t('menu.selectAddress') }}
        </template>
      </div>
    </div>
    <div
      v-else
      class="address"
    >
      <q-icon
        class="q-pr-sm"
        name="mdi-map"
        size="sm"
      />
      {{ storeAddress }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { mapGetters, mapActions } from 'vuex';

import { formatAddress } from '@helpers/formatAddress';
import { IStore } from '@models/IStore';
import { ICart, OrderType } from '@models/ICart';
import AddressFormDialog from '@pages/address/AddressFormDialog.vue';

@Options({
  components: {},
  computed: {
    ...mapGetters('cart', [
      'activeCart',
      'serviceFee',
      'waitingTime',
      'distance',
      'isDeliveryWithoutAddress',
      'isInsideDeliveryArea',
      'serviceInfoLoading',
    ]),
    ...mapGetters('store', [
      'store',
    ]),
  },
  methods: {
    ...mapActions('cart', [
      'updateOrderType',
    ]),
  },
})
export default class MenuHeader extends Vue {
  store!: IStore;
  activeCart!: ICart;
  serviceFee!: number;
  waitingTime!: number;
  distance!: number;
  isDeliveryWithoutAddress!: boolean;
  isInsideDeliveryArea!: boolean;
  serviceInfoLoading!: boolean;
  separator: string = '•';
  updateOrderType!: (type: OrderType) => void;

  get isDelivery() {
    return this.activeCart.type === OrderType.Delivery;
  }

  get serviceFeeLabel() {
    return this.serviceFee ? this.$n(this.serviceFee, 'currency') : 'Grátis';
  }

  get selectedTypeLabel() {
    return {
      [OrderType.Delivery]: 'Entrega',
      [OrderType.Takeout]: 'Retirada',
      [OrderType.Local]: 'Consumir no local',
    }[this.activeCart.type];
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

  get storeAddress() {
    return formatAddress(this.store.address);
  }

  get cartDeliveryAddress() {
    const { address } = this.activeCart;
    return address ? formatAddress(address) : null;
  }

  openAddressForm() {
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
};
</script>

<style lang="scss" scoped>
.service-fee {
  font-weight: bold;
}

.user-address {
  border: 1px solid $separator-color;
  border-radius: $generic-border-radius;
  padding: 8px;
}
</style>
