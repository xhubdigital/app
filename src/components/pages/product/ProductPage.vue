<template>
  <div class="product-page full-height column relative">
    <div class="header q-pa-md bg-transparent">
      <q-btn
        icon="mdi-arrow-left"
        unelevated
        size="sm"
        color="white"
        text-color="green"
        round
        @click="onClose"
      />
    </div>
    <q-scroll-area
      ref="scrollAreaRef"
      class="scroll-area"
    >
      <div class="product-details">
        <div class="image">
          <q-img
            v-if="product.picture"
            fit="cover"
            :src="product.picture"
          />
        </div>
        <div class="info q-pa-md q-col-gutter-md">
          <div class="label">
            {{ product.label }}
          </div>
          <div v-if="product.description" class="description">
            {{ product.description }}
          </div>
          <div v-if="product.price > 0" class="price">
            {{ $n(product.price, 'currency') }}
          </div>
        </div>
        <div class="complements">
          <complement-group
            v-for="item in product.complementGroups"
            :id="`complement-group-${item.complementGroup.id}`"
            :key="item.complementGroup.id"
            v-model="cartItem.complements[item.complementGroup.id]"
            :complement-group="item.complementGroup"
          />
        </div>
        <q-separator />
        <div>
          <div class="q-pa-md">
            <q-icon size="sm" name="mdi-comment-text" />
            {{ $t('Alguma observação?') }}
          </div>
          <div class="q-pb-md q-px-md">
            <q-input
              v-model="cartItem.observations"
              class="observations-field"
              rows="3"
              filled
              dense
              placeholder="Ex: Tirar a cebola, ponto da carne etc"
              type="textarea"
            />
          </div>
        </div>
      </div>
    </q-scroll-area>
    <div class="footer">
      <div class="flex q-pa-md q-col-gutter-md">
        <div class="col-auto flex">
          <div class="quantity-picker flex items-center">
            <number-picker
              v-model="cartItem.quantity"
              :min="1"
            />
          </div>
        </div>
        <div class="col">
          <q-btn
            class="full-width q-py-sm"
            :color="buttonColor"
            unelevated
            no-caps
            :disable="!isStoreOpen"
            @click="saveItem"
          >
            <template v-if="!isStoreOpen">
              <div>{{ $t('Restaurante fechado') }}</div>
            </template>
            <template v-else-if="havePendency">
              <div>
                {{ $t('Selecione todos os complementos obrigatórios') }}
              </div>
            </template>
            <template v-else>
              <div>{{ $t('Adicionar') }}</div>
              <q-space />
              <div>{{ $n(totalPrice, 'currency') }}</div>
            </template>
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop, Model, Ref } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { QScrollArea } from 'quasar';
import { path, values } from 'ramda';

import { IProduct } from '@models/IProduct';
import { IComplementGroupItem } from '@models/IComplementGroupItem';
import {
  ICartItem,
  IComplementValue,
  IComplementValues,
} from '@models/ICart';
import { getCartItemPrice } from '@helpers/getCartItemPrice';

import ComplementGroup from '@components/pages/product/ComplementGroup.vue';
import NumberPicker from '@components/form/NumberPicker.vue';

@Options({
  components: { ComplementGroup, NumberPicker },
  emits: ['close', 'save'],
  computed: {
    ...mapGetters('store', [
      'isStoreOpen',
    ]),
  },
})
export default class ProductPage extends Vue {
  @Model('item') cartItem!: ICartItem;
  @Prop({ required: true }) product!: IProduct;
  @Ref() scrollAreaRef!: QScrollArea;

  isStoreOpen!: boolean;

  get totalPrice() {
    if (!this.cartItem) {
      return 0;
    }

    return getCartItemPrice(this.cartItem);
  }

  get firstPendency() {
    return this.cartItem.product.complementGroups
      .find((complementItem: IComplementGroupItem) => {
        const { complementGroup } = complementItem;

        if (!complementGroup.required) {
          return false;
        }

        const complementValues = path<IComplementValues>(
          ['complements', complementGroup.id, 'values'],
          this.cartItem,
        );

        if (!complementValues) {
          return true;
        }

        return values(complementValues)
          .reduce((total: number, value: IComplementValue) => {
            return total + value.quantity;
          }, 0) === 0;
      });
  }

  get havePendency() {
    return this.firstPendency !== undefined;
  }

  get buttonColor() {
    if (!this.isStoreOpen) {
      return 'negative';
    }

    if (this.havePendency) {
      return 'warning';
    }

    return 'positive';
  }

  onClose() {
    this.$emit('close');
  }

  saveItem() {
    if (this.firstPendency) {
      const { id } = this.firstPendency.complementGroup;
      const element = document.getElementById(`complement-group-${id}`);

      if (!element) {
        return;
      }

      const offset = element.offsetTop;
      this.scrollAreaRef.setScrollPosition('vertical', offset);

      return;
    }

    this.$emit('save', this.cartItem);
  }
}
</script>

<style lang="scss" scoped>
.scroll-area {
  flex-grow: 1;
}

.header {
  position: absolute;
  top: 0;
  z-index: 1000;
}

.footer {
  border-top: 1px solid $separator-color;

  .quantity-picker {
    padding: 0 4px;
    border: 1px solid $separator-color;
    border-radius: $generic-border-radius;
  }
}

.product-details {
  .image {
    min-height: 46px;

    .q-img {
      height: 280px;
    }
  }

  .info {
    .label {
      font-weight: 700;
      font-size: 1.4rem;
    }

    .description {
      font-size: 1rem;
      color: $grey-6;
    }

    .price {
      font-size: 1.4rem;
      font-weight: 100;
    }
  }

  .observations-field {
    ::v-deep .q-field__native {
      resize: none;
    }
  }
}
</style>
