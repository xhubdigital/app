<template>
  <theme-provider
    v-if="!loading"
    :theme="theme"
  >
    <router-view  />
  </theme-provider>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapActions, mapGetters } from 'vuex';
import { ThemeProvider } from 'vue3-styled-components';

import { ITheme } from 'src/models/IStore';

@Options({
  components: { ThemeProvider },
  computed: {
    ...mapGetters('store', ['theme']),
  },
  methods: {
    ...mapActions('store', ['loadStore']),
    ...mapActions('cart', ['initCart']),
    ...mapActions('user', ['autoSignIn']),
  },
})
export default class App extends Vue {
  theme!: ITheme;
  loadStore!: () => Promise<unknown>;
  initCart!: () => Promise<unknown>;
  autoSignIn!: () => Promise<unknown>;

  loading: boolean = true;

  async created() {
    await this.loadStoreConfiguration();
  }

  async loadStoreConfiguration() {
    this.loading = true;

    await this.loadStore();
    await this.checkAuth();

    this.loading = false;

    void this.initCart();
  }

  async checkAuth() {
    const user = await this.autoSignIn();
    const { isAuth, requireAuth } = this.$route.meta;

    if (isAuth && user !== null) {
      void this.$router.push('/');
    } else if (requireAuth && user === null) {
      void this.$router.push({ name: 'auth/sign-in' });
    }
  }
}
</script>
