<template>
  <div
    v-if="loading || !product || !cartItem"
    class="full-height flex flex-center"
  >
    <q-spinner
      size="80px"
      color="primary"
    />
  </div>
  <product-page
    v-else
    v-model:item="cartItem"
    :product="product"
    @save="onSaveItemToCart"
    @close="onClose"
  />
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { mapActions } from 'vuex';

import { getProduct } from 'src/api/products';
import { IProduct } from 'src/models/IProduct';
import { ICartItem } from 'src/models/ICart';
import ProductPage from 'components/pages/product/ProductPage.vue';

@Options({
  components: { ProductPage },
  methods: {
    ...mapActions('cart', [
      'saveItem',
    ]),
  },
})
export default class Details extends Vue {
  saveItem!: (data: { cartItem: ICartItem, index?: number }) => void;

  product: IProduct | null = null;
  cartItem: ICartItem | null = null;
  loading: boolean = false;

  created() {
    void this.loadProduct();
  }

  async loadProduct() {
    try {
      this.loading = true;

      this.product = await getProduct(this.$route.params.id as string);

      this.cartItem = {
        product: this.product,
        quantity: 1,
        complements: {},
        observations: null,
      };

      this.loading = false;
    } catch {
      this.loading = false;
    }
  }

  onClose() {
    void this.$router.push('/menu');
  }

  onSaveItemToCart() {
    if (!this.cartItem) {
      return;
    }

    this.saveItem({ cartItem: this.cartItem });

    void this.$router.push('/menu');
  }
};
</script>
