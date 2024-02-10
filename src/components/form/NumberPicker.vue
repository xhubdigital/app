<template>
  <div
    class="number-picker flex items-center"
    :class="{ disable }"
  >
    <div>
      <q-btn
        icon="mdi-minus"
        unelevated
        size="sm"
        color="white"
        text-color="red"
        round
        @click="decrease"
      />
    </div>
    <div class="value">{{ value || 0 }}</div>
    <div>
      <q-btn
        icon="mdi-plus"
        unelevated
        size="sm"
        color="white"
        text-color="green"
        round
        :disable="disable"
        @click="increase"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { Model, Prop } from 'vue-property-decorator';

@Options({
  components: {},
})
export default class NumberPicker extends Vue {
  @Model('modelValue') value!: number;
  @Prop({ default: 0 }) min!: number;
  @Prop() max!: number;
  @Prop({ default: false }) disable!: boolean;

  decrease() {
    if ((this.value - 1) < this.min) {
      return;
    }

    this.$emit('update:modelValue', this.value - 1);
  }

  increase() {
    if ((this.value + 1) > this.max) {
      return;
    }

    this.$emit('update:modelValue', this.value + 1);
  }
}
</script>

<style lang="scss" scoped>
.number-picker {
  .value {
    font-size: 1rem;
    font-weight: bold;
    min-width: 40px;
    text-align: center;
  }

  &.disable .value {
    color: $grey-8;
  }
}
</style>
