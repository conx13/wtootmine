<template>
  <q-tabs>
    <q-chip
      size="lg"
      icon="groups"
      v-for="item in puudujadTooGrupid"
      :key="item"
      clickable
      :selected="item == grupiNimi"
      @click="activeGrupp(item)"
      >{{ item }}</q-chip
    >
  </q-tabs>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { usePuudujadStore } from '../../stores/tootmine/puudujad-store';

const puudujadStore = usePuudujadStore();
const { puudujadTooGrupid, grupiNimi } = storeToRefs(puudujadStore);

//Teeme chipi aktiivseks
function activeGrupp(nimi: string) {
  if (grupiNimi.value == nimi) {
    puudujadStore.setPuudujadFilter('');
    console.log('Puudujad tyhi');
  } else {
    puudujadStore.setPuudujadFilter(nimi);
    console.log('Puudujad nimi');
  }
}
</script>
