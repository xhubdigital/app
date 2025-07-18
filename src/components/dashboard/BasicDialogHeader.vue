<template>
  <div>
    <div class="header flex items-center q-pa-md">
      <q-btn
        icon="mdi-arrow-left"
        unelevated
        size="sm"
        color="green"
        text-color="white"
        round
        @click="$emit('backClick')"
      />
      <div class="title text-bold">
        {{ title }}
      </div>
    </div>
    <q-separator />
  </div>
</template>

<script lang="ts">
import { Vue, Prop } from 'vue-property-decorator';

export default class BasicDialogHeader extends Vue {
  @Prop({ required: true }) title!: string;
}
</script>

<style lang="scss" scoped>
.header {
  .title {
    flex-grow: 1;
    text-align: center;
  }
}
</style>
