<template>
  <div class="full-height column">
    <basic-dialog-header
      :title="$t('profile.addresses')"
      @back-click="$emit('backClick')"
    />
    <div class="address-content q-pa-sm q-pa-md-md">
      <div
        v-if="!user"
        class="fit flex flex-center"
      >
        <no-auth-empty-state />
      </div>
      <div
        v-else-if="addresses.loading"
        class="fit flex flex-center"
      >
        <q-spinner
          size="80px"
          color="primary"
        />
      </div>
      <no-addresses-empty-state
        v-else-if="addresses.data.length === 0"
        class="fit"
        @request-new-address="openNewAddressForm"
      />
      <div v-else>
        <addresses-list
          :addresses="addresses.data"
          @request-new-address="openNewAddressForm"
          @selectAddress="selectAddress"
          @addressDeleted="onAddressDeleted"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-property-decorator';
import { mapActions, mapGetters } from 'vuex';

import { ILoadable } from '@helpers/ILoadable';
import { IUser } from '@models/IUser';
import { IAddress } from '@models/IAddress';
import { ICart } from '@models/ICart';
import { getAddresses } from '@api/addresses';

import NewAddress from '@pages/profile/addresses/NewAddress.vue';
import BasicDialogHeader from '@components/dashboard/BasicDialogHeader.vue';
import NoAuthEmptyState
  from '@components/pages/profile/addresses/NoAuthEmptyState.vue';
import NoAddressesEmptyState
  from '@components/pages/profile/addresses/NoAddressesEmptyState.vue';
import AddressesList
  from '@components/pages/profile/addresses/AddressesList.vue';

@Options({
  components: {
    BasicDialogHeader,
    NoAuthEmptyState,
    NoAddressesEmptyState,
    AddressesList,
  },
  computed: {
    ...mapGetters('user', ['user']),
    ...mapGetters('cart', [
      'activeCart',
    ]),
  },
  methods: {
    ...mapActions('cart', [
      'updateDeliveryAddress',
    ]),
  },
})
export default class Addresses extends Vue {
  updateDeliveryAddress!: (address: IAddress | null) => void;
  user!: IUser;
  activeCart!: ICart;

  addresses: ILoadable<IAddress> = {
    data: [],
    loading: false,
  };

  created() {
    if (this.user) {
      void this.loadAddresses();
    }
  }

  async loadAddresses() {
    try {
      this.addresses.loading = true;

      this.addresses.data = await getAddresses();

      this.addresses.loading = false;
    } catch {
      this.addresses.loading = false;
    }
  }

  openNewAddressForm() {
    this.$q.dialog({
      component: NewAddress,
      componentProps: {
        class: 'dialog',
        position: this.$q.screen.lt.sm ? 'bottom' : 'right',
        maximized: true,
        'full-height': true,
      },
    }).onOk((address: IAddress) => {
      this.addresses.data.push(address);

      this.selectAddress(address);
    });
  }

  onAddressDeleted(address: IAddress) {
    this.addresses.data = this.addresses.data.filter((adr: IAddress) => {
      return adr.id !== address.id;
    });

    if (this.activeCart.address?.id === address.id) {
      this.updateDeliveryAddress(null);
    }
  }

  selectAddress(address: IAddress) {
    this.$emit('address-updated', address);

    this.updateDeliveryAddress(address);
  }
}
</script>

<style lang="scss" scoped>
.address-content {
  flex-grow: 1;
}
</style>
