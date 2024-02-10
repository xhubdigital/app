<template>
  <div class="row items-center">
    <div class="col-auto q-pr-md">
      <q-avatar
        color="primary"
        text-color="white"
        :icon="isDelivery ? 'mdi-map-marker' : 'mdi-walk'"
      />
    </div>
    <div class="col">
      <div>
        {{ label }}
      </div>
      <div class="text-bold">
        {{ address }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Options } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

import { formatAddress } from 'src/helpers/formatAddress';
import { ICart, OrderType } from 'src/models/ICart';
import { IStore } from 'src/models/IStore';
import { IAddress } from 'src/models/IAddress';

@Options({
  computed: {
    ...mapGetters('store', ['store']),
  },
})
export default class OrderDeliveryInfo extends Vue {
  store!: IStore;

  @Prop({ required: true }) order!: ICart;

  get isDelivery() {
    return this.order.type === OrderType.Delivery;
  }

  get label() {
    return this.isDelivery ? 'Endereço de entrega' : 'Endereço de retirada';
  }

  get address() {
    const address = this.isDelivery
      ? this.order.address
      : this.store.address;

    return formatAddress(address as IAddress);
  }
}
</script>
