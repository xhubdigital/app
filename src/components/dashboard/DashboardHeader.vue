<template>
  <div>
    <base-header>
      <div class="container">
        <div class="store-logo">
          <q-img
            class="store-img"
            :src="store.picture"
          />
        </div>
      </div>
      <div class="is-restaurant-open-badge container">
        <q-chip
          class="value text-bold"
          size="md"
          :color="isStoreOpen ? 'positive' : 'negative'"
          text-color="white"
        >
          {{ isStoreOpen ? $t('dashboard.opened') : $t('dashboard.closed') }}
        </q-chip>
      </div>
    </base-header>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import styled from 'vue3-styled-components';
import { pathOr } from 'ramda';
import { mapGetters } from 'vuex';

import { IStore } from 'src/models/IStore';

const BaseHeader = styled.div`
  background-color: ${pathOr('#000', ['theme', 'mainColor'])};
  background-image: url(${pathOr('', ['theme', 'banner'])});
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
`;

@Options({
  components: { BaseHeader },
  computed: {
    ...mapGetters('store', [
      'store',
      'isStoreOpen',
    ]),
  },
})
export default class DashboardHeader extends Vue {
  store!: IStore;
  isStoreOpen!: boolean;
};
</script>

<style lang="scss" scoped>
.hub4u-logo {
  display: flex;
  justify-content: center;
  padding: 6px;
}

.store-logo {
  padding: 6px;
  display: flex;
  justify-content: center;
  padding: 1.4rem;

  .q-img {
    width: 100px;
    border-radius: 10rem;
  }
}

.is-restaurant-open-badge {
  position: relative;

  .value {
    position: absolute;
    right: 12px;
    bottom: 4px;
  }
}
</style>
