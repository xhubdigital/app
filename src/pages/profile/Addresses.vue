<template>
  <addresses @back-click="$router.back" />
</template>

<script lang="ts">
import { Vue, Options } from 'vue-property-decorator';

import Addresses from '@components/pages/profile/addresses/Addresses.vue';

@Options({
  components: {
    Addresses,
  },
})
export default class AddressesPage extends Vue {
}
</script>
