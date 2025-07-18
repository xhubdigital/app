<template>
  <q-dialog
    ref="dialogRef"
    class="right-side-dialog"
    @hide="hide"
  >
    <div class="content">
      <product-page
        v-model:item="edittingCartItem"
        :product="cartItem.product"
        @save="onSaveItemToCart"
        @close="hide"
      />
    </div>
  </q-dialog>
</template>

<script lang="ts">
import { Vue, Options, Ref, Prop } from 'vue-property-decorator';
import { QDialog } from 'quasar';

import { ICartItem } from 'src/models/ICart';
import ProductPage from 'components/pages/product/ProductPage.vue';
import { clone } from 'ramda';

@Options({
  components: {
    ProductPage,
  },
})
export default class EditingCartItemDialog extends Vue {
  @Ref() dialogRef!: QDialog;
  @Prop({ required: true }) cartItem!: ICartItem;

  edittingCartItem: ICartItem | null = null;

  created() {
    this.edittingCartItem = clone(this.cartItem);
  }

  show() {
    this.dialogRef.show();
  }

  hide() {
    this.dialogRef.hide();
  }

  onSaveItemToCart() {
    this.$emit('ok', this.edittingCartItem);
    this.hide();
  }
}
</script>
