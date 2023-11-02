<template>
  <q-page padding>
    <!-- content -->
    <div class="row">
      <div v-if="!puudujadFilter.length">Puudujaid ei olegi!</div>
      <div v-if="puudujadFilter.length" class="col-xs-12 col-lg-3">
        <puudujadGrupid />
        <!-- <div>{{ puudujadFilter.length }}</div> -->
        <div
          class="row-inline q-ma-xs"
          v-for="item in puudujadFilter"
          :key="item.tid"
        >
          <puudujadCard :user="item" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { usePuudujadStore } from 'src/stores/tootmine/puudujad-store';
import puudujadCard from '../../components/puudujad/puudujadCard.vue';
import puudujadGrupid from '../../components/puudujad/puudujadGrupid.vue';

const puudujadStore = usePuudujadStore();
const { puudujadFilter } = storeToRefs(puudujadStore);
const valik: string[] = [];

onMounted(() => {
  console.log('the component is now mounted.');
  //puudujadStore.setPuudujadFilter('');
  puudujadStore.getPuudujad();
});

//Kui on vaja midagi lisada listi või eemaldada
function muudaListi(nimi: string) {
  if (!valik.includes(nimi)) {
    valik.push(nimi);
  } else {
    valik.splice(valik.indexOf(nimi), 1);
  }
}
</script>
