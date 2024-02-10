<template>
  <div class="complement-item">
    <div
      v-for="value, key in complementValues"
      :key="key"
    >
      <div>
        <span v-if="isRepeatOption">
          {{ `${value.quantity}x ` }}
        </span>
        {{ `${value.complementGroupOption.label}` }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';
import { filter, values } from 'ramda';

import { ICartItemComplementValue, IComplementValue } from 'src/models/ICart';

@Options({
  components: {},
})
export default class CartItem extends Vue {
  @Prop({ required: true }) complement!: ICartItemComplementValue;

  get isRepeatOption() {
    const { multiple, repeatOption } = this.complement.complementGroup;

    return multiple && repeatOption;
  }

  get complementValues() {
    return filter(
      (value: IComplementValue) => {
        return value.quantity > 0;
      },
      values(this.complement.values),
    );
  }
}
</script>

<style lang="scss" scoped>
.complement-item {
  color: $grey-6;
}
</style>
