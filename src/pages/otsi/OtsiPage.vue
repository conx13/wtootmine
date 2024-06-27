<template>
  <q-page padding style="padding-top: 145px">
    <!-- <pealkiri pealkiri="Otsi töökoodi" /> -->
    <otsiHeader
      v-model="otsiText"
      @otsiEnter="otsiEnter"
      @valitudKaamera="valitudKaamera"
      :foundCameras="foundCameras"
      :aktiivneKaameraId="aktiivneKaameraId"
    ></otsiHeader>
    <!-- {{ kaamerad }}:Kaamerad -->
    <div v-if="naita" class="relative">
      <!-- Ribakoodi otsija aken -->
      <qrcode @leitud-kood="onDecode" @kaamerad="kaamerateList"></qrcode>
    </div>
    <!-- Kui me otsime tööd: -->
    <div class="absolute-center" v-show="loading">
      <q-spinner color="primary" size="3em" />
    </div>
    <!-- Kui me otsime tegijaid -->
    <div class="col text-center" v-show="kesTegiLoading">
      <q-spinner-dots color="primary" size="3em" />
    </div>

    <!-- Kui me ei leidnud midagi: -->
    <transition name="fade">
      <otsiEiLeidnudCard v-if="otsinguStaatus === '0'" />
    </transition>

    <q-tab-panels
      v-if="kasOnTegijaid && !naita"
      swipeable
      infinite
      v-model="aktiivneTab"
      animated
    >
      <q-tab-panel name="kes" class="no-padding">
        <otsiTegijaCard :tegijad="uniqTegijad"> </otsiTegijaCard>
      </q-tab-panel>
      <q-tab-panel name="millal" class="no-padding">
        <!-- leitud tegijate kaart/kaardid -->
        <otsiTegijaKpvCard
          v-for="(tegijad, index) in groupedByKpv"
          :key="index"
          :tegijad="tegijad"
          :kpv="index.toString()"
        />
      </q-tab-panel>
    </q-tab-panels>

    <!-- scanneri otsimise nupp -->
    <q-page-sticky position="bottom">
      <q-btn
        class="q-mb-lg"
        :color="naita ? 'negative' : 'primary'"
        round
        push
        size="xl"
        :icon="!naita ? symOutlinedBarcodeScanner : 'close'"
        @click="naita = !naita"
      />
    </q-page-sticky>

    <!-- Otsingu riba -->
    <q-page-sticky
      v-if="otsinguStaatus == '1' && !naita"
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
      <!-- Leitud töö kaart -->
      <div class="row full-width">
        <otsiLeitudTooCard
          :lepnr="leitudTood.LEPNR"
          :gnimi="leitudTood.GNIMI"
          :too="leitudTood.TOO"
          :onToos="poleTöösseVõetud"
          v-model="aktiivneTab"
        />
      </div>
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { symOutlinedBarcodeScanner } from '@quasar/extras/material-symbols-outlined';

import qrcode from 'src/components/otsi/qrReader.vue';

import { useOtsiStore } from 'src/stores/otsi/otsi-store';
import otsiLeitudTooCard from 'src/components/otsi/otsiLeitudTooCard.vue';
import otsiTegijaKpvCard from 'src/components/otsi/otsiTegijaKpvCard.vue';
import otsiTegijaCard from 'src/components/otsi/otsiTegijaCard.vue';
import otsiEiLeidnudCard from 'src/components/otsi/otsiEiLeidnudCard.vue';
import otsiHeader from 'src/components/otsi/otsiHeader.vue';

const otsiStore = useOtsiStore();
const {
  otsiText,
  leitudTood,
  loading,
  kesTegiLoading,
  groupedByKpv,
  uniqTegijad,
  otsinguStaatus,
  foundCameras,
} = storeToRefs(otsiStore);
const { otsiKoodi, otsiKesTegi, nulliKoik } = otsiStore;

//kas näitame ribokoodi akent
const naita = ref(false);
//Akttivne tab
const aktiivneTab = ref('kes');
//kas leitud töö on töösse võetud
const poleTöösseVõetud = computed(
  () => leitudTood.value.onresult == 0 && leitudTood.value.ontoos == 0
);
//kaamera Id
const aktiivneKaameraId = ref();

onMounted(() => {
  aktiivneKaameraId.value = localStorage.getItem('cameraid');
});

//Kas leitud tööl on tegijaid
const kasOnTegijaid = computed(
  () => otsinguStaatus.value == '1' && !poleTöösseVõetud.value
);

/* ------------------------- kui tuvastame ribakoodi ------------------------ */
async function onDecode(code: string) {
  //panem leitud koodi otsingu teksti
  otsiText.value = code;
  //otsime koodi
  otsiKoodiTegijat();
  naita.value = false;
}

/* ------------- kui vajutame otsingus enterit siis otsime koodi ------------ */
const otsiEnter = () => {
  nulliKoik();
  otsiKoodiTegijat();
};

/* ------------------ Otsime koodi ja kui vaja ka tegijaid ------------------ */
const otsiKoodiTegijat = async () => {
  nulliKoik();
  await otsiKoodi();
  // kui on kas aktiivne või on tulemus kirjas, siis otsime tegijaid
  if (kasOnTegijaid.value) {
    aktiivneTab.value = 'kes';
    await otsiKesTegi(leitudTood.value.JID);
  }
};
/* ------------------------ Tekitame kaamerate listi ------------------------ */
const kaamerateList = (leitudKaamerad: MediaDeviceInfo[]) => {
  foundCameras.value = leitudKaamerad;
};

/* ----------------------- Salvestame valitud kaamera ----------------------- */
const valitudKaamera = (cameraId: string) => {
  if (cameraId) {
    aktiivneKaameraId.value = cameraId;
  }
};
</script>
