<template>
  <StreamBarcodeReader
    v-if="onLoading"
    :deviceID="valitudKaamera"
    @decode="(code: string) => onDecode(code)"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { StreamBarcodeReader } from 'vue-barcode-reader';

const emit = defineEmits(['leitudKood', 'kaamerad']);
const kaamerad = ref([] as MediaDeviceInfo[]);
const valitudKaamera = ref();
const onLoading = ref(false);

/* --------------------- Võtame kui on mälust kaamera ID -------------------- */
onMounted(() => {
  if (localStorage.getItem('cameraid')) {
    valitudKaamera.value = localStorage.getItem('cameraid');
  }
  onLoading.value = true;
  loadedCamera();
});

/* ------------ Kui kaamera töötab, korjame kaamerate listi kokku ----------- */
const loadedCamera = async () => {
  await navigator.mediaDevices.enumerateDevices().then((devices) => {
    kaamerad.value = devices.filter((i) => i.kind == 'videoinput');
    if (kaamerad.value.length) {
      emit('kaamerad', kaamerad.value);
    }
  });
};

/* ------------------------- kui tuvastame ribakoodi ------------------------ */
async function onDecode(code: string) {
  emit('leitudKood', code);
}
</script>
