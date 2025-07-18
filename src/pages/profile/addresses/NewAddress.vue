<template>
  <q-dialog
    ref="dialogRef"
    class="right-side-dialog"
    @hide="hide"
  >
    <div class="content">
      <div class="full-height column">
        <basic-dialog-layout
          :title="$t('profile.newAddress')"
          @back-click="hide"
        >
          <v-form v-slot="form">
            <q-form
              class="row q-pa-sm q-pa-md-md q-col-gutter-md"
              @submit="form.handleSubmit(saveAddress)"
            >
              <div class="col-12">
                <v-field
                  v-slot="{ field, handleChange, errorMessage }"
                  :label="$t('common.zipCode')"
                  name="zipCode"
                  rules="required|min:9"
                >
                  <q-input
                    :label="$t('common.zipCode')"
                    autofocus
                    inputmode="number"
                    mask="#####-###"
                    :model-value="field.value"
                    :loading="loadingAddressFromZipCode"
                    :error="!!errorMessage"
                    :error-message="errorMessage"
                    @update:modelValue
                      ="onChangeZipCode(handleChange, form, $event)"
                  />
                </v-field>
              </div>
              <div class="col-6">
                <v-field
                  v-slot="{ field, handleChange, errorMessage }"
                  :label="$t('common.state')"
                  name="state"
                  rules="required"
                >
                  <q-input
                    :label="$t('common.state')"
                    :model-value="field.value"
                    :error="!!errorMessage"
                    :error-message="errorMessage"
                    @update:modelValue="handleChange"
                  />
                </v-field>
              </div>
              <div class="col-6">
                <v-field
                  v-slot="{ field, handleChange, errorMessage }"
                  :label="$t('common.city')"
                  name="city"
                  rules="required"
                >
                  <q-input
                    :label="$t('common.city')"
                    :model-value="field.value"
                    :error="!!errorMessage"
                    :error-message="errorMessage"
                    @update:modelValue="handleChange"
                  />
                </v-field>
              </div>
              <div class="col-12">
                <v-field
                  v-slot="{ field, handleChange, errorMessage }"
                  :label="$t('common.streetName')"
                  name="streetName"
                  rules="required"
                >
                  <q-input
                    :label="$t('common.streetName')"
                    :model-value="field.value"
                    :error="!!errorMessage"
                    :error-message="errorMessage"
                    @update:modelValue="handleChange"
                  />
                </v-field>
              </div>
              <div class="col-6">
                <v-field
                  v-slot="{ field, handleChange, errorMessage }"
                  :label="$t('common.neighborhood')"
                  name="neighborhood"
                  rules="required"
                >
                  <q-input
                    :label="$t('common.neighborhood')"
                    :model-value="field.value"
                    :error="!!errorMessage"
                    :error-message="errorMessage"
                    @update:modelValue="handleChange"
                  />
                </v-field>
              </div>
              <div class="col-6">
                <v-field
                  v-slot="{ field, handleChange, errorMessage }"
                  :label="$t('common.number')"
                  name="number"
                  rules="required"
                >
                  <q-input
                    ref="numberInputRef"
                    :label="$t('common.number')"
                    :model-value="field.value"
                    :error="!!errorMessage"
                    :error-message="errorMessage"
                    @update:modelValue="handleChange"
                  />
                </v-field>
              </div>
              <div class="col-12">
                <v-field
                  v-slot="{ field, handleChange, errorMessage }"
                  :label="$t('common.complement')"
                  name="complement"
                >
                  <q-input
                    :label="$t('common.complement')"
                    :model-value="field.value"
                    :error="!!errorMessage"
                    :error-message="errorMessage"
                    @update:modelValue="handleChange"
                  />
                </v-field>
              </div>
              <div class="flex col-12">
                <q-space />
                <q-btn
                  type="submit"
                  :label="$t('profile.saveAddress')"
                  color="positive"
                  unelevated
                  :loading="saving"
                />
              </div>
            </q-form>
          </v-form>
        </basic-dialog-layout>
      </div>
    </div>
  </q-dialog>
</template>

<script lang="ts">
import { Vue, Options, Ref } from 'vue-property-decorator';
import { Form, Field } from 'vee-validate';
import { QDialog, QInput } from 'quasar';

import { getAddressFromZipCode } from '@api/user';
import { saveAddress } from '@api/addresses';
import { IAddress } from '@models/IAddress';

import BasicDialogLayout from '@layouts/BasicDialogLayout.vue';

interface FormContext {
  validate: () => void;
  setValues: (address: Partial<IAddress>) => void;
}

@Options({
  components: {
    BasicDialogLayout,
    VForm: Form,
    VField: Field,
  },
})
export default class NewAddress extends Vue {
  @Ref() dialogRef!: QDialog;
  @Ref() numberInputRef!: QInput;

  saving: boolean = false;

  loadingAddressFromZipCode: boolean = false;

  show() {
    this.dialogRef.show();
  }

  hide() {
    this.dialogRef.hide();
  }

  onChangeZipCode(
    handleChange: (value: string) => void,
    form: FormContext,
    value: string,
  ) {
    if (value.length === 9) {
      void this.loadAddressFromZipCode(value, form);
    }

    handleChange(value);
  }

  async loadAddressFromZipCode(
    zipCode: string,
    form: FormContext,
  ) {
    try {
      this.loadingAddressFromZipCode = true;

      const address = await getAddressFromZipCode(zipCode);

      form.setValues(address);
      form.validate();

      this.numberInputRef.focus();

      this.loadingAddressFromZipCode = false;
    } catch {
      this.$q.notify({
        color: 'negative',
        message: this.$t('profile.notifications.searchZipCodeError.message'),
        caption: this.$t('profile.notifications.searchZipCodeError.caption'),
      });

      this.loadingAddressFromZipCode = false;
    }
  }

  async saveAddress(address: IAddress) {
    try {
      this.saving = true;

      const savedAddress = await saveAddress(address);

      this.$q.notify({
        color: 'positive',
        message: this.$t('profile.notifications.addressCreatedSuccess.message'),
      });

      this.$emit('ok', savedAddress);
      this.hide();

      this.saving = false;
    } catch (error) {
      this.saving = false;
    }
  }
}
</script>
