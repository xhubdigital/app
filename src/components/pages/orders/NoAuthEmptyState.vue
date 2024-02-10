<template>
  <q-page class="container q-pa-md q-pa-md-lg flex flex-center">
    <div class="empty-state q-col-gutter-md">
      <div class="text-center title">
        {{ $t('orders.notAuthenticated.title') }}
      </div>
      <div class="text-center message">
        {{ $t('orders.notAuthenticated.message') }}
      </div>
      <div class="action">
        <q-btn
          color="positive"
          unelevated
          :label="$t('orders.notAuthenticated.action')"
          to="/sign-in"
        />
      </div>
    </div>
  </q-page>
</template>

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
