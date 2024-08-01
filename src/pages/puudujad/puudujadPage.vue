<template>
  <q-pull-to-refresh @refresh="refresh">
    <q-page padding style="padding-top: 50px">
      <pealkiri
        :pealkiri="`Mitteaktiivsed:` + String(puudujadFilter.length)"
        :klass="`text-${pealkirjaVärv}`"
      />

      <!-- content -->
      <div class="absolute-center" v-show="loading">
        <q-spinner color="primary" size="3em" />
      </div>
      <div class="row justify-center" v-show="!loading">
        <div v-if="!puudujadFilter.length">Puudujaid ei olegi!</div>
        <div v-else class="col-xs-12 col-lg-3">
          <TransitionGroup name="company">
            <div v-for="puudujad in puudujadFilter" :key="puudujad.TID">
              <!-- <puudujadCard :user="item" /> -->
              <userItem
                :tid="puudujad.TID"
                :pilt="puudujad.pilt"
                :pnimi="puudujad.PNIMI"
                :enimi="puudujad.ENIMI"
                :toogrupp_nimi="puudujad.toogrupp_nimi"
                ringiVarv="#c10015"
                jooneVarv="red-2"
                @vajutas-nuppu="tootajaBaasist"
              />
            </div>
          </TransitionGroup>
        </div>
      </div>
      <!-- Kuna on sticki siis peab lõpus asuma -->
      <q-page-sticky
        v-if="puudujadFilter.length"
        expand
        position="top"
        class=""
      >
        <puudujadGrupid />
      </q-page-sticky>
    </q-page>
  </q-pull-to-refresh>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onActivated, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { usePuudujadStore } from '../../stores/tootmine/puudujad-store';
import { useTootajaStore } from '../../stores/tootmine/tootaja-store';
import userItem from '../../components/yld/userItem.vue';
import puudujadGrupid from '../../components/puudujad/puudujadGrupid.vue';
import pealkiri from '../../components/yld/headerComp.vue';

const puudujadStore = usePuudujadStore();
const tootajaStore = useTootajaStore();
const router = useRouter();
const { puudujadFilter, loading, puudujad } = storeToRefs(puudujadStore);
const valik: string[] = [];
const pealkirjaVärv = 'negative';

//Kui andmeid ei ole, siis võtame baasist
onMounted(() => {
  if (!puudujad.value.length) {
    puudujadStore.grupiNimi = '';
    puudujadStore.getPuudujad();
  }
});

//värskendame andmeid
function refresh(done: () => void) {
  puudujadStore.getPuudujad();
  puudujadStore.grupiNimi = '';
  done();
}
//Liigume töötaja kaardile
function tootajaBaasist(tid: number) {
  setTimeout(() => {
    router.push({ name: 'm_tootajaPage', params: { id: tid } });
  }, 150);
  tootajaStore.getTootaja(Number(tid));
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
<style>
.company {
  backface-visibility: hidden;
  z-index: 1;
}

/* moving */
.company-move {
  transition: all 600ms ease-in-out 50ms;
}

/* appearing */
.company-enter-active {
  transition: all 400ms ease-out;
}

/* disappearing */
.company-leave-active {
  transition: all 200ms ease-in;
  position: absolute;
  z-index: 0;
}

/* appear at / disappear to */
.company-enter,
.company-leave-to {
  opacity: 0;
}
</style>
<!-- <style lang="sass">
html
  overscroll-behavior: none
</style> -->
