<template>
  <div
    class="address-item flex items-center no-wrap"
    :class="{ active: isActive }"
    @click="$emit('selectAddress', address)"
  >
    <div class="q-pr-sm">
      <q-icon
        name="mdi-map-marker"
        size="sm"
      />
    </div>
    <div class="details">
      <div class="street-name">{{ streetName }}</div>
      <div class="other-info">
        {{ otherInfo }}
      </div>
    </div>
    <div>
      <q-btn
        icon="mdi-dots-horizontal"
        round
        flat
        color="primary"
        @click.stop
      >
        <q-menu>
          <q-list>
            <q-item
              v-close-popup
              clickable
              @click="deleteItem"
            >
              <q-item-section avatar>
                <q-icon name="mdi-delete" />
              </q-item-section>
              <q-item-section>{{ $t('profile.deleteAddress') }}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Options } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

import { IAddress } from '@models/IAddress';
import { ICart } from '@models/ICart';
import { deleteAddress } from '@api/addresses';

@Options({
  computed: {
    ...mapGetters('cart', ['activeCart']),
  },
})
export default class AddressItem extends Vue {
  activeCart!: ICart;

  @Prop({ required: true }) address!: IAddress;

  deleting: boolean = false;

  get isActive() {
    return this.activeCart?.address?.id === this.address.id;
  }

  get streetName() {
    // eslint-disable-next-line max-len
    const { streetName, number } = this.address;

    return `${streetName}, ${number}`;
  }

  get otherInfo() {
    const { state, city, neighborhood, complement } = this.address;

    const complementText = complement ? ` - ${complement}` : '';

    const adr = `${neighborhood}, ${city}/${state}`;

    return adr + complementText;
  }

  async deleteItem() {
    if (!this.address.id) {
      return;
    }

    try {
      this.deleting = true;

      await deleteAddress(this.address.id);

      this.$q.notify({
        color: 'positive',
        message: this.$t('profile.notifications.addressDeletedSuccess.message'),
      });

      this.deleting = false;

      this.$emit('addressDeleted', this.address);
    } catch (error) {
      this.deleting = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.address-item {
  border-radius: $generic-border-radius;
  border: 2px solid $separator-color;
  padding: 8px;
  cursor: pointer;

  .details {
    flex-grow: 1;
  }

  .street-name {
    font-size: 1.1rem;
    font-weight: bold;
  }

  .other-info {
    color: $grey-6;
  }

  &.active {
    border-color: $positive;
  }

  &:not(.active):hover {
    background: $grey-2;
  }
}
</style>
