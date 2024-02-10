<template>
  <q-page class="container q-pa-sm q-pa-md-md">
    <div>
      <q-list>
        <template
          v-for="link, index in links"
          :key="index"
        >
          <q-item
            v-ripple:grey-5
            clickable
            class="link"
            :class="link.class"
            :to="link.to"
            @click="link.onClick"
          >
            <q-item-section avatar>
              <q-avatar :icon="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-bold">
                {{ link.label }}
              </q-item-label>
              <q-item-label
                v-if="link.caption"
                caption
              >
                {{ link.caption }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </div>
    <router-view v-slot="{ Component }">
      <q-dialog
        class="right-side-dialog"
        :model-value="$route.meta.isDialog"
        :position="$q.screen.lt.sm ? 'bottom' : 'right'"
        maximized
        full-height
        no-route-dismiss
        @hide="redirectToProfile"
      >
        <div class="content">
          <component :is="Component" />
        </div>
      </q-dialog>
    </router-view>
  </q-page>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { mapActions } from 'vuex';

@Options({
  components: {},
  methods: {
    ...mapActions('user', ['logout']),
  },
})
export default class Profile extends Vue {
  logout!: () => void;

  get links() {
    return [
      {
        icon: 'mdi-book-account',
        label: this.$t('profile.personalData'),
        caption: this.$t('profile.personalDataCaption'),
        to: '/profile/info',
      },
      {
        icon: 'mdi-map',
        label: this.$t('profile.addresses'),
        caption: this.$t('profile.addressesCaption'),
        to: '/profile/addresses',
      },
      {
        icon: 'mdi-logout',
        label: this.$t('profile.logout'),
        class: 'sign-out',
        onClick: () => this.signOut(),
      },
    ];
  }

  signOut() {
    this.logout();

    void this.$router.push('/menu');
  }

  redirectToProfile() {
    void this.$router.push('/profile');
  }
}
</script>

<style lang="scss" scoped>
.q-separator {
  margin: 0 8px;
}

.link {
  border-radius: 12px;
  padding: 8px;

  &.q-router-link--exact-active, &.q-router-link--active {
    color: black;
  }

  &.sign-out {
    color: $negative;
  }
}
</style>
