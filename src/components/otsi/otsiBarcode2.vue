<template>
  {{ kaamerad }}
  <StreamBarcodeReader @decode="(a: string, b:any) => onDecode(a, b)" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { StreamBarcodeReader } from 'vue-barcode-reader';

const props = defineProps({
  cameraId: {
    type: String,
    default: () => null,
  },
});
const emit = defineEmits(['leitudKood', 'kaamerad']);
const kaamerad = ref();

onMounted(() => {
  navigator.mediaDevices.enumerateDevices().then((devices) => {
    kaamerad.value = devices.filter((i) => i.kind == 'videoinput');
    console.log(kaamerad.value, 'Kaamerad');
    emit('kaamerad', kaamerad);
  });
});

/* ------------------------- kui tuvastame ribakoodi ------------------------ */
async function onDecode(a: string, b: any) {
  console.log(a, 'leitud kood');
  emit('leitudKood', a);
}
</script>
