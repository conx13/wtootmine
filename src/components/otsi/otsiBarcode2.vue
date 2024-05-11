<template>
  {{ onLoading }} Barcode camera app loaded {{ barcodeapploaded }} Barcode
  camera loaded
  <StreamBarcodeReader
    v-if="onLoading"
    :deviceID="valitudKaamera"
    @decode="(a: string, b:any) => onDecode(a, b)"
    @loaded="loadedCamera"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { StreamBarcodeReader } from 'vue-barcode-reader';

const emit = defineEmits(['leitudKood', 'kaamerad']);
const kaamerad = ref([] as MediaDeviceInfo[]);
const valitudKaamera = ref();
const onLoading = ref(false);
const barcodeapploaded = ref(false);

/* --------------------- Võtame kui on mälust kaamera ID -------------------- */
onMounted(() => {
  if (localStorage.getItem('cameraid')) {
    valitudKaamera.value = localStorage.getItem('cameraid');
  }
  onLoading.value = true;
});

/* ------------ Kui kaamera töötab, korjame kaamerate listi kokku ----------- */
const loadedCamera = () => {
  barcodeapploaded.value = true;
  navigator.mediaDevices.enumerateDevices().then((devices) => {
    kaamerad.value = devices.filter((i) => i.kind == 'videoinput');
    if (kaamerad.value.length) {
      emit('kaamerad', kaamerad.value);
    }
  });
};

/* ------------------------- kui tuvastame ribakoodi ------------------------ */
async function onDecode(a: string, b: any) {
  console.log(a, 'leitud kood');
  emit('leitudKood', a);
}
</script>
