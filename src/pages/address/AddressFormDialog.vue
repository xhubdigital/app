<template>
  <q-dialog
    ref="dialogRef"
    class="right-side-dialog"
    @hide="hide"
  >
    <div class="content">
      <addresses @back-click="hide" />
    </div>
  </q-dialog>
</template>

<script lang="ts">
import { Vue, Options, Ref } from 'vue-property-decorator';
import { QDialog } from 'quasar';

import Addresses from '@components/pages/profile/addresses/Addresses.vue';

@Options({
  components: {
    Addresses,
  },
})
export default class AddressFormDialog extends Vue {
  @Ref() dialogRef!: QDialog;

  show() {
    this.dialogRef.show();
  }

  hide() {
    this.dialogRef.hide();
  }
}
</script>
