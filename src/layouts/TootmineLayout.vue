<template>
  <q-layout view="lHh Lpr lFf">
    <!-- <q-ajax-bar ref="bar" color="blue" size="5px" /> -->

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer bordered class="bg-white text-primary" reveal>
      <q-tabs
        no-caps
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
          label="Kasutaja"
          :to="{ name: 'kasutajaPage', params: { id: user?.id } }"
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
