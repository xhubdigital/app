<template>
  <div class="row q-col-gutter-sm q-col-gutter-md-md">
    <div
      v-for="address in addresses"
      :key="address.id"
      class="col-12"
    >
      <address-item
        :address="address"
        @selectAddress="$emit('selectAddress', $event)"
        @addressDeleted="onAddressDeleted"
      />
    </div>
    <div class="col-12">
      <q-btn
        :label="$t('profile.newAddress')"
        class="full-width q-py-sm"
        color="positive"
        outline
        @click="$emit('requestNewAddress')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';

import { IAddress } from '@models/IAddress';

import AddressItem from './AddressItem.vue';

@Options({
  components: {
    AddressItem,
  },
})
export default class AddressesList extends Vue {
  @Prop({ required: true }) addresses!: IAddress[];

  onAddressDeleted(address: IAddress) {
    this.$emit('addressDeleted', address);
  }
}
</script>
