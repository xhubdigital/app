<template>
  <q-page class="container q-pa-md q-pa-md-lg flex flex-center">
    <div class="empty-state q-col-gutter-md">
      <div class="text-center title">
        {{ $t('orders.noOrders.title') }}
      </div>
      <div class="text-center message">
        <div>{{ $t('orders.noOrders.message', { userName: user.name }) }}</div>
        <div>{{ $t('orders.noOrders.message2') }}</div>
        <div>{{ $t('orders.noOrders.message3') }}</div>
      </div>
      <div class="action">
        <q-btn
          color="positive"
          unelevated
          :label="$t('orders.noOrders.action')"
          to="/menu"
        />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { mapGetters } from 'vuex';

import { IUser } from '@models/IUser';

@Options({
  computed: {
    ...mapGetters('user', [
      'user',
    ]),
  },
})
export default class NoOrdersEmptyState extends Vue {
  user!: IUser | null;
}
</script>

<style lang="scss" scoped>
.empty-state {
  color: $grey-8;

  .title {
    font-weight: 700;
    font-size: 1.2rem;
  }

  .action {
    display: flex;
    justify-content: center;
  }
}
</style>
