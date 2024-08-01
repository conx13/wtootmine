<template>
  <div class="col q-px-sm">
    <div class="flex no-wrap overflow-auto hide-scrollbar bg-white">
      <q-chip
        v-for="item in puudujadTooGrupid"
        :key="item"
        size="lg"
        icon="groups"
        color="negative"
        outline
        :removable="item == grupiNimi"
        clickable
        @click="activeGrupp(item)"
        @remove="grupiNimi = ''"
        >{{ item }}</q-chip
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { usePuudujadStore } from 'stores/tootmine/puudujad-store';

const puudujadStore = usePuudujadStore();
const { puudujadTooGrupid, grupiNimi } = storeToRefs(puudujadStore);

//Teeme chipi aktiivseks
function activeGrupp(nimi: string) {
  if (grupiNimi.value == nimi) {
    grupiNimi.value = '';
  } else {
    puudujadStore.setPuudujadFilter(nimi);
  }
}
</script>
