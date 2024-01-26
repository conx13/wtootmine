<template>
  <q-pull-to-refresh @refresh="refresh">
    <q-page>
      <pealkiri
        :pealkiri="`Mitteaktiivsed:` + String(puudujad.length)"
        :text-varv="pealkirjaVärv"
      />

      <!-- content -->
      <div class="absolute-center" v-show="loading">
        <q-spinner color="primary" size="3em" />
      </div>
      <div class="row justify-center" v-show="!loading">
        <div v-if="!puudujadFilter.length">Puudujaid ei olegi!</div>
        <div v-if="puudujadFilter.length" class="col-xs-12 col-lg-3">
          <puudujadGrupid />
          <div v-for="item in puudujadFilter" :key="item.TID">
            <puudujadCard :user="item" />
          </div>
        </div>
      </div>
    </q-page>
  </q-pull-to-refresh>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

import { usePuudujadStore } from 'src/stores/tootmine/puudujad-store';
import puudujadCard from '../../components/puudujad/puudujadCard.vue';
import puudujadGrupid from '../../components/puudujad/puudujadGrupid.vue';
import pealkiri from '../../components/yld/headerComp.vue';

const puudujadStore = usePuudujadStore();
const { puudujadFilter, loading, puudujad } = storeToRefs(puudujadStore);
const valik: string[] = [];
const pealkirjaVärv = 'negative';

//Kui andmeid ei ole, siis võtame baasist
onMounted(() => {
  if (!puudujad.value.length) {
    puudujadStore.getPuudujad();
  }
});

function refresh(done: () => void) {
  puudujadStore.getPuudujad();
  done();
}

//Kui on vaja midagi lisada listi või eemaldada
function muudaListi(nimi: string) {
  if (!valik.includes(nimi)) {
    valik.push(nimi);
  } else {
    valik.splice(valik.indexOf(nimi), 1);
  }
}
</script>

<!-- <style lang="sass">
html
  overscroll-behavior: none
</style> -->
