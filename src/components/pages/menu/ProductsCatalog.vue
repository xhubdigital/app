<template>
  <div>
    <div
      v-for="category in categories"
      :key="category.id"
    >
      <div class="category-label">
        {{ category.label }}
      </div>
      <div class="products">
        <router-link
          v-for="product in category.products"
          :key="product.id"
          class="product"
          :to="{ name: 'product/details', params: { id: product.id } }"
        >
          <div class="q-col-gutter-sm">
            <div class="label">
              {{ product.label }}
            </div>
            <div class="description">
              {{ product.description }}
            </div>
            <div class="price">
              {{ $n(product.price, 'currency') }}
            </div>
          </div>
          <q-space />
          <div
            v-if="product.picture"
            class="picture"
          >
            <q-img
              :src="product.picture"
              fit="cover"
            />
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';

import { IProductCategory } from '@models/IProductCategory';

@Options({
  components: {},
})
export default class ProductsCatalog extends Vue {
  @Prop({ required: true }) categories!: IProductCategory[];
};
</script>

<style lang="scss" scoped>
.category-label {
  font-size: 1.4rem;
  font-weight: bold;
  color: rgba(0, 0, 0, .8);
  background: rgba(0, 0, 0, .06);
  padding: 12px;
}

.product {
  padding: 12px;
  display: flex;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, .02);
    cursor: pointer;
  }

  &:not(:first-child) {
    border-top: 1px solid $separator-color;
  }

  .label {
    font-size: 1.1rem;
    font-weight: bold;
  }

  .price {
    font-size: 1.1rem;
    font-weight: bold;
  }

  .picture .q-img {
    margin-left: 12px;
    height: 90px;
    width: 90px;
    border-radius: 8px;
  }
}
</style>
