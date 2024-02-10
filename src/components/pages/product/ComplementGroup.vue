<template>
  <div class="complement-group">
    <div class="header flex items-center">
      <div class="col">
        <div class="title">{{ complementGroup.label }}</div>
        <div class="subtitle">{{ description }}</div>
      </div>
      <div
        v-if="complementGroup.required"
        class="col-auto q-pl-md"
      >
        <q-icon
          v-if="hasValue"
          name="mdi-check"
          size="lg"
          color="positive"
        />
        <q-chip
          v-else
          color="info"
          text-color="white"
        >
          {{ $t('productPage.required') }}
        </q-chip>
      </div>
    </div>
    <div class="options">
      <q-item
        v-for="option in complementGroup.options"
        :key="option.id"
        class="option row"
        :tag="!isNumberPicker ? 'label' : undefined"
      >
        <div class="col">
          {{ option.label }}
        </div>
        <div class="col-auto q-ml-md flex items-center">
          <div
            v-if="option.price > 0"
            class="price"
          >
            {{ `+${$n(option.price, 'currency')}` }}
          </div>
          <div class="field">
            <q-radio
              v-if="isRadio"
              :model-value="getSingleOptionValue()"
              :val="option.id"
              @update:model-value="onUpdateSingleOption(option)"
            />
            <number-picker
              v-else-if="isNumberPicker"
              :model-value="getNumberPickerValue(option)"
              :max="getNumberPickerValue(option) + availableOptions"
              :disable="availableOptions === 0"
              @update:model-value="onUpdateNumberPicker(option, $event)"
            />
            <q-checkbox
              v-else-if="isCheckbox"
              :val="option.id"
              :model-value="getCheckboxValue()"
              @update:model-value="onUpdateCheckbox"
            />
          </div>
        </div>
      </q-item>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop, Model } from 'vue-property-decorator';
import { path, pathOr, sum, map, prop, values } from 'ramda';

import { IComplementGroup } from 'src/models/IComplementGroup';
import { IComplementGroupOption } from 'src/models/IComplementGroupOption';
import { ICartItemComplementValue, IComplementValue } from 'src/models/ICart';
import NumberPicker from 'components/form/NumberPicker.vue';

@Options({
  components: { NumberPicker },
})
export default class ComplementGroup extends Vue {
  @Model('modelValue') complementValue!: ICartItemComplementValue;
  @Prop({ required: true }) complementGroup!: IComplementGroup;

  get isRadio() {
    return this.complementGroup.multiple === false;
  }

  get isCheckbox() {
    return this.complementGroup.multiple && !this.complementGroup.repeatOption;
  }

  get isNumberPicker() {
    return this.complementGroup.multiple && this.complementGroup.repeatOption;
  }

  get hasValue() {
    if (!this.complementValue) {
      return false;
    }

    const complementValues = values(this.complementValue.values);

    return sum(
      map(prop('quantity'), complementValues),
    ) > 0;
  }

  get description() {
    const max = this.complementGroup.maxOptions;

    if (this.isNumberPicker || this.isCheckbox) {
      return `Escolha até ${max} opções.`;
    } else {
      return 'Escolha 1 opção.';
    }
  }

  get availableOptions(): number {
    const max = this.complementGroup.maxOptions;

    if (!this.complementValue) {
      return max;
    }

    if (this.isNumberPicker || this.isCheckbox) {
      const complementValues = values(this.complementValue.values);

      const selectedQuantity = sum(map(prop('quantity'), complementValues));

      return max - selectedQuantity;
    }

    return 0;
  }

  getSingleOptionValue() {
    if (!this.complementValue) {
      return null;
    }

    const valueOptions = values(this.complementValue.values);

    const value = valueOptions.find((value: IComplementValue) => {
      return value.quantity;
    });

    return value ? value.complementGroupOption.id : null;;
  }

  getNumberPickerValue(option: IComplementGroupOption) {
    return pathOr(0, ['values', option.id, 'quantity'], this.complementValue);
  }

  getCheckboxValue() {
    if (!this.complementValue) {
      return [];
    }

    const valueOptions = values(this.complementValue.values);

    const selectedOptions = valueOptions.filter((value: IComplementValue) => {
      return value.quantity === 1;
    });

    return map(path(['complementGroupOption', 'id']), selectedOptions);
  }

  onUpdateSingleOption(option: IComplementGroupOption) {
    this.$emit('update:modelValue', {
      complementGroup: this.complementGroup,
      values: {
        [option.id]: {
          complementGroupOption: option,
          quantity: 1,
        },
      },
    });
  }

  onUpdateNumberPicker(option: IComplementGroupOption, quantity: number) {
    const complementValues = pathOr({}, ['values'], this.complementValue);

    this.$emit('update:modelValue', {
      complementGroup: this.complementGroup,
      values: {
        ...complementValues,
        [option.id]: {
          complementGroupOption: option,
          quantity,
        },
      },
    });
  }

  onUpdateCheckbox(value: string[]) {
    const { maxOptions } = this.complementGroup;

    if (value.length > maxOptions) {
      return;
    }

    const currValues = value.reduce((curr, id: string) => {
      return {
        ...curr,
        [id]: {
          complementGroupOption: this.getOption(id),
          quantity: 1,
        },
      };
    }, {});

    this.$emit('update:modelValue', {
      complementGroup: this.complementGroup,
      values: currValues,
    });
  }

  getOption(id: string) {
    return this.complementGroup.options
      .find((option: IComplementGroupOption) => {
        return option.id === id;
      });
  }
}
</script>

<style lang="scss" scoped>
.complement-group {
  .header {
    background: rgba(0, 0, 0, .06);
    padding: 12px 16px;

    .title {
      font-weight: 700;
      font-size: 1.2rem;
    }

    .subtitle {
      color: $grey-6;
    }
  }

  .option {
    display: flex;
    align-items: center;
    padding: 12px 16px;
  }

  .price {
    font-weight: bold;
  }

  .field {
    padding: 0 8px;
  }
}
</style>
