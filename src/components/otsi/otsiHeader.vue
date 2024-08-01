<template>
  <q-header class="bg-white text-primary" reveal>
    <q-toolbar
      class="bg-white q-py-sm"
      style="
        border: 1px solid #eaeaea;
        border-radius: 0 0 20px 20px;
        border-top: none;
        overflow: hidden;
      "
    >
      <div class="col">
        <q-btn flat round icon="arrow_back_ios" @click="$router.go(-1)" />
      </div>
      <div class="col-10">
        <!-- Otsimise texti riba -->
        <otsiInputRida v-model:="otsiText" @enter="otsiEnter" />
      </div>
      <div class="col">
        <q-btn
          flat
          round
          :icon="symOutlinedSettingsPhotoCamera"
          :disable="foundCameras!.length == 0"
        >
          <q-menu
            auto-close
            transition-show="flip-right"
            transition-hide="flip-left"
          >
            <q-list style="min-width: 100px">
              <q-item
                clickable
                v-for="kaamera in foundCameras"
                :key="kaamera.deviceId"
                :active="kaamera.deviceId === aktiivneKaameraId"
                @click="valitudKaamera(kaamera.deviceId)"
              >
                <q-item-section>{{ kaamera.label }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { symOutlinedSettingsPhotoCamera } from '@quasar/extras/material-symbols-outlined';
import { PropType } from 'vue';
import otsiInputRida from '../../components/otsi/otsiInputRida.vue';

defineProps({
  foundCameras: { type: Array as PropType<MediaDeviceInfo[]>, required: true },
  aktiivneKaameraId: { type: String, required: false },
});

const otsiText = defineModel<string>();
const emit = defineEmits(['otsiEnter', 'valitudKaamera']);

/* ------------ Kui vajutame enterit siis saadame tulemuse tagasi ----------- */
const otsiEnter = () => {
  emit('otsiEnter', otsiText.value);
};

/* ----------------------- Salvestame valitud kaamera ----------------------- */
const valitudKaamera = (cameraId: string) => {
  if (cameraId) {
    emit('valitudKaamera', cameraId);
    localStorage.setItem('cameraid', cameraId);
  }
};
</script>
