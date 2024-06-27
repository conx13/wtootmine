<template>
  <qrcode-stream
    class="absolute-center text-center"
    :formats="['code_39']"
    :constraints="constr"
    @error="onError"
    @detect="onDetect"
    @camera-on="loadedCameras"
  >
    <q-spinner-ball v-if="loading" color="primary" size="10em" />
  </qrcode-stream>
  <div v-if="errLoad">{{ errTeade }}</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { QrcodeStream } from 'vue-qrcode-reader';

const emit = defineEmits(['leitudKood', 'kaamerad']);

interface DecodedData {
  rawValue: string;
}
const kaamerad = ref([] as MediaDeviceInfo[]);
const loading = ref(true);
const errTeade = ref('');
const errLoad = ref(false);

/* ------------------ Kui on siis võtame mälust kaamera id ------------------ */
const constr = computed(() => {
  const storedCameraId = localStorage.getItem('cameraid');
  if (storedCameraId) {
    // Use the camera ID from local storage
    return { deviceId: { exact: storedCameraId } };
  } else {
    // Use the default environment-facing camera
    return { facingMode: 'environment' };
  }
});

/* --------------------------- Kui leidsime koodi --------------------------- */
const onDetect = (code: DecodedData[]) => {
  emit('leitudKood', code[0].rawValue);
};

/* ------------------------ Kui tekib kaamerga error ------------------------ */
function onError(err: { name: string; message: string }) {
  errLoad.value = true;
  errTeade.value = `[${err.name}]: `;

  if (err.name === 'NotAllowedError') {
    errTeade.value += 'pead andma kaamerale loa kasutamiseks';
  } else if (err.name === 'NotFoundError') {
    errTeade.value += 'ei leidnud ühtegi kaamerat';
  } else if (err.name === 'NotSupportedError') {
    errTeade.value += 'vajalik on turvaline ühendus (HTTPS, localhost)';
  } else if (err.name === 'NotReadableError') {
    errTeade.value += 'kas kaamera on juba kasutusel?';
  } else if (err.name === 'OverconstrainedError') {
    errTeade.value += 'kaamera ei ole kättesaadav';
  } else if (err.name === 'StreamApiNotSupportedError') {
    errTeade.value += 'Stream API ei ole selles brauseris toetatud';
  } else if (err.name === 'InsecureContextError') {
    errTeade.value +=
      'kaamera ligipääs on võimalik ainult turvalise ühenduse kaudud. Kasuta HTTPS või localhost ühendust tavalise HTTP asemel.';
  } else {
    errTeade.value += err.message;
  }
}

/* ------------ Kui kaamera töötab, korjame kaamerate listi kokku ----------- */
const loadedCameras = async () => {
  await navigator.mediaDevices.enumerateDevices().then((devices) => {
    kaamerad.value = devices.filter((i) => i.kind == 'videoinput');
    if (kaamerad.value.length) {
      emit('kaamerad', kaamerad.value);
    }
  });
  loading.value = false;
};
</script>
