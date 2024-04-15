<template>
  <q-page padding style="padding-top: 195px">
    <pealkiri pealkiri="Otsi töökoodi" />
    <div v-if="naita" class="col">
      <StreamBarcodeReader @decode="(a: string) => onDecode(a)" />
    </div>
    <!-- Kui me otsime tööd: -->
    <div class="absolute-center" v-show="loading">
      <q-spinner color="primary" size="3em" />
    </div>

    <!-- Kui me ei leidnud midagi: -->
    <transition name="fade">
      <otsiEiLeidnudCard v-if="otsinguStaatus === '0'" />
    </transition>
    <!-- Kui me otsime tegijaid -->
    <div class="col text-center" v-show="kesTegiLoading">
      <q-spinner-dots color="primary" size="3em" />
    </div>

    <!-- leitud tegijate kaart -->
    <div v-show="otsinguStaatus === '1'">
      <otsiTooTegijaCard
        v-for="(tegijad, index) in groupedByKpv"
        :key="index"
        :tegijad="tegijad"
        :kpv="index.toString()"
      />
    </div>

    <!-- scanneri otsimise nupp -->
    <q-page-sticky position="bottom">
      <q-btn
        class="q-mb-md"
        :color="naita ? 'negative' : 'primary'"
        round
        push
        size="xl"
        :icon="!naita ? 'sym_o_barcode_scanner' : 'sym_o_close'"
        @click="naita = !naita"
      />
    </q-page-sticky>

    <!-- Otsingu riba -->
    <q-page-sticky
      expand
      position="top"
      class="bg-white q-pb-sm"
      style="
        border: 1px solid #eaeaea;
        border-radius: 0 0 20px 20px;
        border-top: none;
        overflow: hidden;
      "
    >
      <!-- Otsimise texti riba -->
      <otsiInputRida
        :otsiText="otsiText"
        @update:otsiTex="otsiEnter"
      ></otsiInputRida>
      <!-- Leitud töö kaart -->
      <div v-if="otsinguStaatus == '1'" class="row full-width">
        <otsiLeitudTooCard
          :lepnr="leitudTood[0].LEPNR"
          :gnimi="leitudTood[0].GNIMI"
          :too="leitudTood[0].TOO"
          :onToos="leitudTood[0].onresult == 1 && leitudTood[0].ontoos == 1"
        />
      </div>
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { StreamBarcodeReader } from 'vue-barcode-reader';

import { ref } from 'vue';

import { useOtsiStore } from 'src/stores/otsi/otsi-store';

import pealkiri from '../../components/yld/headerComp.vue';
import otsiLeitudTooCard from 'src/components/otsi/otsiLeitudTooCard.vue';
import otsiTooTegijaCard from 'src/components/otsi/otsiTooTegijaCard.vue';
import otsiEiLeidnudCard from 'src/components/otsi/otsiEiLeidnudCard.vue';
import otsiInputRida from 'src/components/otsi/otsiInputRida.vue';

import { storeToRefs } from 'pinia';

const otsiStore = useOtsiStore();
const {
  otsiText,
  leitudTood,
  loading,
  kesTegiLoading,
  groupedByKpv,
  otsinguStaatus,
} = storeToRefs(otsiStore);
const { otsiKoodi, otsiKesTegi, nulliKoik } = otsiStore;

//kas näitame ribokoodi akent
const naita = ref(false);

const visible = ref(true);

//kui tuvastame ribakoodi
function onDecode(a: string) {
  //panem leitud koodi otsingu teksti
  otsiText.value = a;
  naita.value = false;
  //otsime koodi
  otsiKoodiTegijat();
}

//kui vajutame otsingus enterit siis otsime koodi
const otsiEnter = async (tulemus: string) => {
  console.log(tulemus, 'ENTER tulemus');
  otsiText.value = tulemus;
  visible.value = false;
  otsiKoodiTegijat();
};

//Otsime koodi kui tegijaid
const otsiKoodiTegijat = async () => {
  nulliKoik();
  await otsiKoodi();
  // kui on kas aktiivne või on tulemus kirjas, siis otsime tegijaid

  if (otsinguStaatus.value == '1') {
    await otsiKesTegi(leitudTood.value[0].JID);
  }
};
</script>
<style>
.allaNool {
  transform: rotate(0deg);
  transition-duration: 0.5s;
}
.ulesNool {
  transition-duration: 0.5s;
  transform: rotate(180deg);
}
.fade-enter-active {
  transition: opacity 0.5s;
}
.fade-enter-from {
  opacity: 0;
}
</style>
