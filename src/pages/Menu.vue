<template>
  <q-page class="container q-pa-md q-pa-md-lg">
    <div class="q-col-gutter-md">
      <div>
        <menu-header />
      </div>
      <div>
        <div
          v-if="loading"
          class="flex flex-center"
        >
          <q-spinner
            size="64px"
            :color="theme.mainColor"
          />
        </div>
        <div v-else>
          <products-catalog :categories="formattedCategories" />
        </div>
      </div>
    </div>
    <router-view v-slot="{ Component }">
      <q-dialog
        class="right-side-dialog"
        :model-value="$route.meta.isDialog"
        :position="$q.screen.lt.sm ? 'bottom' : 'right'"
        maximized
        full-height
        no-route-dismiss
        @hide="redirectToCatalog"
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
import { mapActions, mapGetters } from 'vuex';
import { clone } from 'ramda';

import { ITheme } from '@models/IStore';
import { IProductCategory } from '@models/IProductCategory';

import MenuHeader from '@components/pages/menu/MenuHeader.vue';
import ProductsCatalog from '@components/pages/menu/ProductsCatalog.vue';

interface IOrderable {
  position: number;
}

function hasProducts(category: IProductCategory): boolean {
  return category.products.length > 0;
}

function sortByPosition(a: IOrderable, b: IOrderable) {
  return a.position - b.position;
}

@Options({
  components: {
    MenuHeader,
    ProductsCatalog,
  },
  computed: {
    ...mapGetters('store', [
      'theme',
    ]),
    ...mapGetters('products', [
      'categories',
    ]),
  },
  methods: {
    ...mapActions('products', [
      'loadProductCategories',
    ]),
  },
})
export default class Menu extends Vue {
  theme!: ITheme;
  categories!: IProductCategory[];
  loadProductCategories!: () => Promise<void>;

  loading: boolean = false;

  get formattedCategories(): IProductCategory[] {
    return clone(this.categories)
      .filter(hasProducts)
      .sort(sortByPosition)
      .map((category: IProductCategory) => {
        return {
          ...category,
          products: category.products
            .sort(sortByPosition),
        };
      });
  }

  created() {
    void this.getProducts();
  }

  async getProducts() {
    this.loading = true;

    await this.loadProductCategories();

    this.loading = false;
  }

  redirectToCatalog() {
    void this.$router.push('/menu');
  }
}
</script>
