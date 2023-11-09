<template>
  <div class="row q-py-xs items-center">
    <div class="col-3 text-right q-mr-md text-grey-7" style="font-size: 1rem">
      {{ reaTekst }}:
    </div>
    <div class="col" style="font-size: 1.1rem">
      {{ reaData }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  reaTekst?: string;
  reaData?: string;
}>();

const reaTekst = computed(() => props.reaTekst);
const reaData = computed(() => props.reaData);
</script>

<style lang="sass">
/* muudame lingi tavaliseks tekstiks */
a
  all: unset
</style>
