<template>
  <div class="full-height column">
    <basic-dialog-header
      :title="title"
      @back-click="$emit('backClick')"
    />
    <q-scroll-area class="scroll-area">
      <slot />
    </q-scroll-area>
  </div>
</template>

<script lang="ts">
import { Vue, Options, Prop } from 'vue-property-decorator';

import BasicDialogHeader from '@components/dashboard/BasicDialogHeader.vue';

@Options({
  components: {
    BasicDialogHeader,
  },
})
export default class BasicDialogLayout extends Vue {
  @Prop({ required: true }) title!: string;
}
</script>

<style lang="scss" scoped>
.scroll-area {
  flex-grow: 1;
}
</style>
