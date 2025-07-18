<template>
  <q-page>
    <div class="container">
      <div>{{ $t('test') }}</div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';

@Options({
  components: {},
})
export default class PageIndex extends Vue {
}
</script>
