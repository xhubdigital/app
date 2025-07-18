<template>
  <div class="full-height">
    <basic-dialog-layout
      :title="$t('profile.personalData')"
      @back-click="$router.back"
    >
      <div class="q-pa-sm q-pa-md-md">
        <v-form
          v-slot="{ handleSubmit, meta }"
          :initial-values="user"
        >
          <q-form
            class="row q-col-gutter-md"
            @submit="handleSubmit(saveUserData)"
          >
            <div class="col-12">
              <v-field
                v-slot="{ field, handleChange, errorMessage }"
                :label="$t('profile.name')"
                name="name"
                rules="required"
              >
                <q-input
                  autofocus
                  :label="$t('profile.name')"
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
                class="col-12"
                :label="$t('profile.phone')"
                name="phone"
              >
                <!-- rules="required|min:14" -->
                <q-input
                  inputmode="tel"
                  :label="$t('auth.phone')"
                  :mask="getPhoneMask(field.value)"
                  :model-value="field.value"
                  :error="!!errorMessage"
                  :error-message="errorMessage"
                  readonly
                  @update:modelValue="handleChange"
                />
              </v-field>
            </div>
            <div class="col-12 q-pt-md flex justify-center">
              <q-btn
                type="submit"
                color="primary"
                unelevated
                :label="$t('profile.update')"
                :loading="saving"
                :disable="!meta.dirty"
              />
            </div>
          </q-form>
        </v-form>
      </div>
    </basic-dialog-layout>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { Form, Field } from 'vee-validate';
import { mapActions, mapGetters } from 'vuex';

import { IUser } from '@models/IUser';
import { IUpdateUser } from '@api/user';

import BasicDialogLayout from '@layouts/BasicDialogLayout.vue';

@Options({
  components: {
    BasicDialogLayout,
    VForm: Form,
    VField: Field,
  },
  computed: {
    ...mapGetters('user', ['user']),
  },
  methods: {
    ...mapActions('user', ['updateUser']),
  },
})
export default class PersonalData extends Vue {
  user!: IUser;
  updateUser!: (userData: IUpdateUser) => Promise<void>;

  saving: boolean = false;

  getPhoneMask(phone: string = '') {
    return phone.length <= 14 ? '(##) ####-#####' : '(##) #####-####';
  }

  async saveUserData(userData: IUpdateUser) {
    try {
      this.saving = true;

      await this.updateUser(userData);

      this.$q.notify({
        type: 'positive',
        message: this.$t('profile.notifications.updateSuccess.message'),
      });

      this.saving = false;
    } catch (error) {
      this.$q.notify({
        type: 'negative',
        message: this.$t('profile.notifications.updateError.message'),
      });

      this.saving = false;
    }
  }
}
</script>
