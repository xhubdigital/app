<template>
  <v-form v-slot="{ handleSubmit }">
    <q-form @submit="handleSubmit(authWithCode)">
      <v-field
        v-slot="{ field, handleChange, errorMessage }"
        :label="$t('auth.code')"
        name="code"
        rules="required|min:6"
      >
        <q-input
          autofocus
          inputmode="number"
          maxlength="6"
          :label="$t('auth.code')"
          :model-value="field.value"
          :error="!!errorMessage"
          :error-message="errorMessage"
          @update:modelValue="handleChange"
        />
      </v-field>
      <div class="q-pt-md flex justify-center">
        <q-btn
          type="submit"
          color="primary"
          unelevated
          :label="$t('auth.submitCode')"
          :loading="loading"
        />
      </div>
    </q-form>
  </v-form>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';
import { Form, Field } from 'vee-validate';
import { mapActions } from 'vuex';

import { authWithCode } from '@api/user';
import { ITokenData } from '@store/user/actions';

interface IAuthData {
  code: string;
}

@Options({
  components: {
    VForm: Form,
    VField: Field,
  },
  methods: {
    ...mapActions('user', ['processLogin']),
  },
})
export default class ValidateCodeForm extends Vue {
  processLogin!: (data: ITokenData) => Promise<never>;

  @Prop({ required: true }) codeId!: string;

  loading: boolean = false;

  async authWithCode(signInData: IAuthData) {
    try {
      this.loading = true;

      const { code } = signInData;

      const response = await authWithCode({ code, codeId: this.codeId });

      await this.processLogin(response);

      this.$emit('auth');

      this.loading = false;
    } catch {
      this.loading = false;
    }
  }

  getPhoneMask(phone: string = '') {
    return phone.length <= 14 ? '(##) ####-#####' : '(##) #####-####';
  }
}
</script>
