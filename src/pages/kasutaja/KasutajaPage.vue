<template>
  <q-page padding>
    <!-- content -->
    <pealkiri pealkiri="Kasutaja:" :text-varv="pealkirjaVärv" />
    {{ kasutaja }}
  </q-page>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

import { onMounted } from 'vue';
import { useTootajaStore } from '../../stores/kasutaja/kasutaja-store';
import pealkiri from '../../components/yld/headerComp.vue';

const route = useRoute();
const kasutajaStore = useTootajaStore();
const { kasutaja } = storeToRefs(kasutajaStore);
const pealkirjaVärv = 'positive';

onMounted(() => {
  kasutajaStore.getKasutaja(Number(route.params.id));
});
</script>
