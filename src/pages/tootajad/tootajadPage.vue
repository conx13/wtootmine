<template>
  <q-page style="padding-top: 50px" padding>
    <!-- content -->
    <pealkiri pealkiri="Töötajad" text-varv="black" klass="" />

    <div v-for="tootaja in tootajad" :key="tootaja.TID">
      <userItem
        :tid="tootaja.TID"
        :pilt="tootaja?.pilt"
        :pnimi="tootaja.PNIMI"
        :enimi="tootaja.ENIMI"
        :toogrupp_nimi="tootaja.toogrupp_nimi"
        @vajutasNuppu="tootajaBaasist"
      />
    </div>

    <!-- Kuna on sticki siis peab lõpus asuma -->
    <q-page-sticky expand position="top">
      <q-toolbar class="bg-white">
        <div class="col-9">
          <q-form @submit="otsi()">
            <q-input
              ref="select_input"
              rounded
              outlined
              dense
              inputmode="text"
              enterKeyHint="search"
              v-model="otsiText"
              placeholder="Otsi töötajat:"
              input-style="font-size: 18px;"
              :loading="loadingOtsi"
            >
              <template v-if="otsiText && !loadingOtsi" v-slot:append>
                <q-icon
                  name="cancel"
                  @click.stop.prevent="otsiText = ''"
                  class="cursor-pointer"
                />
              </template>
              <template v-slot:prepend>
                <q-icon name="person_search" />
              </template>
            </q-input>
          </q-form>
        </div>
        <div class="col">
          <q-toggle
            v-model="kasAktiivsed"
            false-value="0"
            true-value="1"
            label="Akt."
          />
        </div>
      </q-toolbar>
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import pealkiri from 'src/components/yld/headerComp.vue';
import userItem from 'src/components/yld/userItem.vue';
import { useTootajadStore } from 'src/stores/tootajad/tootajad_store';
import { useTootajaStore } from 'src/stores/tootmine/tootaja-store';
import { storeToRefs } from 'pinia';

const router = useRouter();
const tootajadStore = useTootajadStore();
const tootajaStore = useTootajaStore();
const { otsiText, kasAktiivsed, tootajad, loadingOtsi } =
  storeToRefs(tootajadStore);
//kasutame input fookuse jaoks
const select_input = ref();

/* -------------------- teeme otsingu järgi päringu baasi ------------------- */
function otsi() {
  // võtame otsingult fookuse ära
  select_input.value.blur();
  //otsime baasist töötajaid
  tootajadStore.getTootajad();
}

/* ------------------------- Näitame töötaja kaarti ------------------------- */
function tootajaBaasist(tid: number) {
  tootajaStore.getTootaja(Number(tid));
  setTimeout(() => {
    router.push({ name: 'tootajaPage', params: { id: tid } });
  }, 150);
}
</script>
