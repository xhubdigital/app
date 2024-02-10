<template>
  <div class="item row">
    <div class="col self-center">
      <div class="label">
        {{ `${cartItem.quantity} x ${cartItem.product.label}` }}
      </div>
      <div class="complements">
        <complement-item
          v-for="complement, index in complements"
          :key="index"
          :complement="complement"
        />
      </div>
      <div
        v-if="cartItem.observations"
        class="observations"
      >
        {{ $t('Observações:') + `${cartItem.observations}` }}
      </div>
    </div>
    <div class="col-auto">
      <q-btn
        icon="mdi-dots-horizontal"
        round
        flat
        color="primary"
      >
        <q-menu>
          <q-list>
            <q-item
              v-close-popup
              clickable
              @click="editItem"
            >
              <q-item-section avatar>
                <q-icon name="mdi-pencil" />
              </q-item-section>
              <q-item-section>{{ $t('Alterar') }}</q-item-section>
            </q-item>
            <q-item
              v-close-popup
              clickable
              @click="deleteItem"
            >
              <q-item-section avatar>
                <q-icon name="mdi-delete" />
              </q-item-section>
              <q-item-section>{{ $t('Remover') }}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';
import { values } from 'ramda';

import { ICartItem } from 'src/models/ICart';

import ComplementItem from './ComplementItem.vue';

@Options({
  components: { ComplementItem },
})
export default class CartItem extends Vue {
  @Prop({ required: true }) cartItem!: ICartItem;
  @Prop({ required: true }) index!: number;

  get complements() {
    return values(this.cartItem.complements);
  }

  editItem() {
    this.$emit('edit', this.cartItem, this.index);
  }

  deleteItem() {
    this.$emit('delete', this.cartItem, this.index);
  }
}
</script>

<style lang="scss" scoped>
.item {
  padding: 16px 0;
  border-bottom: 1px solid $separator-color;

  .label {
    font-size: 1rem;
    font-weight: bold;
  }

  .observations {
    color: $grey-6;
  }
}
</style>
