<template>
  <q-page padding>
    <!-- content -->
    Kasutaja Page
    {{ kasutaja }}
  </q-page>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

import { onMounted } from 'vue';
import { useTootajaStore } from '../../stores/kasutaja/kasutaja-store';

const route = useRoute();
const kasutajaStore = useTootajaStore();

const { kasutaja } = storeToRefs(kasutajaStore);

onMounted(() => {
  kasutajaStore.getKasutaja(Number(route.params.id));
});
</script>
