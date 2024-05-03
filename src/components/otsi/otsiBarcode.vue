<template>
  {{ props.camera }}:Kaamera
  <div id="reader"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import {
  CameraDevice,
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
} from 'html5-qrcode';

const emit = defineEmits(['result', 'cameras']);

const props = defineProps({
  qrbox: {
    type: Number,
    default: 250,
  },
  fps: {
    type: Number,
    default: 10,
  },
  camera: {
    type: [String, Object],
    default: () => ({
      facingMode: 'environment',
    }),
  },
});

const kaamerad = ref([] as CameraDevice[]);

const onScanSuccess = (decodedText: any, decodedResult: any) => {
  emit('result', decodedText, decodedResult);
  //code.value.stop();
};

const onScanFailure = () => {
  return;
};

const html50rcode = ref();

onMounted(() => {
  const config = {
    fps: props.fps,
    qrbox: props.qrbox,
    formatsToSupport: Html5QrcodeSupportedFormats.CODE_39,
  };

  Html5Qrcode.getCameras().then((kaamerad) => {
    console.log(kaamerad, 'devices');
    emit('cameras', kaamerad);
  });
  console.log(props.camera);

  html50rcode.value = new Html5Qrcode('reader');
  html50rcode.value.start(props.camera, config, onScanSuccess, onScanFailure);
});

onUnmounted(() => {
  html50rcode.value.stop();
});
</script>
