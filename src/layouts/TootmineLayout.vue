<template>
  <q-layout view="lHh Lpr lFf">
    <!-- <q-ajax-bar ref="bar" color="blue" size="5px" /> -->

    <q-page-container>
      <router-view />
      <q-footer class="bg-white" reveal elevated>
        <q-tabs
          no-caps
          active-color="primary"
          indicator-color="transparent"
          class="text-grey-9 q-pb-sm"
          v-model="tab"
        >
          <q-route-tab
            name="tootmine"
            icon="home"
            label="Tootmine"
            :to="{ name: 'tootminePage' }"
          />
          <q-route-tab
            name="person"
            icon="group"
            label="Töötajad"
            :to="{ name: 'tootajadPage' }"
          />
          <q-route-tab
            name="kasutaja"
            :icon="symOutlinedBarcodeScanner"
            label="Otsi koodi"
            :to="{ name: 'otsiPage' }"
          />
        </q-tabs>
      </q-footer>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from 'src/stores/auth-store';
import { storeToRefs } from 'pinia';
import { symOutlinedBarcodeScanner } from '@quasar/extras/material-symbols-outlined';

const auth = useAuthStore();
const { loggedIn, user } = storeToRefs(auth);

const tab = ref('home');

/* onMounted(() => {
}); */
</script>
<style>
.q-layout {
  background-image: radial-gradient(circle, #f3f6f4, #ffffff);
}
</style>
