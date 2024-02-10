<template>
  <div class="q-pa-md q-pa-md-lg flex flex-center">
    <div class="empty-state q-col-gutter-md">
      <div class="text-center title">
        {{ $t('profile.noAddresses.title') }}
      </div>
      <div class="text-center message">
        {{ $t('profile.noAddresses.message') }}
      </div>
      <div class="action">
        <q-btn
          color="positive"
          unelevated
          :label="$t('profile.noAddresses.action')"
          @click="$emit('requestNewAddress')"
        />
      </div>
    </div>
  </div>
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
