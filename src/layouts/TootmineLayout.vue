<template>
  <q-layout view="lHh Lpr lFf">
    <!-- <q-ajax-bar ref="bar" color="blue" size="5px" /> -->

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer
      class="bg-white text-primary q-mx-sm q-mb-md shadow-1"
      reveal
      reveal-offset="100"
      style="border: 1px solid #eaeaea; border-radius: 50px; overflow: hidden"
    >
      <q-tabs
        no-caps
        dense
        active-color="primary"
        indicator-color="transparent"
        class="text-grey"
        v-model="tab"
      >
        <q-route-tab
          name="tootmine"
          icon="home"
          label="Tootmine"
          :to="{ name: 'tootminePage' }"
        />
        <q-route-tab
          name="kasutaja"
          icon="manage_accounts"
          label="Otsi"
          :to="{ name: 'otsiPage' }"
        />
        <q-route-tab
          name="person"
          icon="group"
          label="Töötajad"
          :to="{ name: 'tootajadPage' }"
        />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from 'src/stores/auth-store';
import { storeToRefs } from 'pinia';

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
