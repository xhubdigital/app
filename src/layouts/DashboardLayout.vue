<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <dashboard-header />
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-transparent">
      <dashboard-footer />
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

import DashboardHeader from '@components/dashboard/DashboardHeader.vue';
import DashboardFooter from '@components/dashboard/DashboardFooter.vue';

@Options({
  components: {
    DashboardHeader,
    DashboardFooter,
  },
})
export default class DashboardLayout extends Vue {
};
</script>
