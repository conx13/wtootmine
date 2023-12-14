<template>
  <q-layout view="lHh Lpr lFf">
    <q-footer bordered class="bg-white text-primary" reveal>
      <q-tabs
        no-caps
        dense
        active-color="primary"
        indicator-color="transparent"
        class="text-grey"
        v-model="tab"
      >
        <q-route-tab
          name="home"
          icon="las la-home"
          label="Kodu"
          :to="{ name: 'tootminePage' }"
        />
        <q-route-tab
          name="person"
          icon="las la-users"
          label="Töötajad"
          :to="{ name: 'tootajadPage' }"
        />
      </q-tabs>
    </q-footer>
    <q-ajax-bar ref="bar" color="blue" size="5px" />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from 'src/stores/auth-store';
import { storeToRefs } from 'pinia';

const auth = useAuthStore();
const { loggedIn } = storeToRefs(auth);

const tab = ref('home');

/* onMounted(() => {
}); */
</script>
