<template>
  <q-page padding style="padding-top: 195px">
    <pealkiri pealkiri="Otsi töökoodi" />
    {{ onvalmis }}:kaamer ok {{ leitudError }}: error
    <!-- {{ kaamerad }}:Kaamerad -->
    <!--     <otsiBarcode
      v-if="naita"
      :qrbox="300"
      :fps="10"
      :camera="valitudKaamera"
      @result="onDecode"
      @cameras="test"
    ></otsiBarcode> -->
    <div v-if="naita">
      <otsiBarcode2 @leitud-kood="onDecode" />
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

    <q-tab-panels v-if="kasOnTegijaid" v-model="aktiivneTab" animated>
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
      <q-fab
        class="q-mb-md"
        color="amber"
        text-color="black"
        :icon="!naita ? 'sym_o_barcode_scanner' : 'sym_o_close'"
        direction="up"
      >
        <q-fab-action
          v-for="kaamera in kaamerad"
          :key="kaamera.id"
          color="amber"
          text-color="black"
          :label="kaamera.label"
          @click="valitudKaamera = kaamera.id"
        />
      </q-fab>
      <q-btn
        class="q-mb-xl"
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
      <otsiInputRida :otsiText="otsiText" @update:otsiTex="otsiEnter" />
      <!-- Leitud töö kaart -->
      <div v-if="otsinguStaatus == '1' && !naita" class="row full-width">
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
//import { StreamBarcodeReader } from '@teckel/vue-barcode-reader';

import { computed, ref } from 'vue';

import { useOtsiStore } from 'src/stores/otsi/otsi-store';

import pealkiri from '../../components/yld/headerComp.vue';
import otsiLeitudTooCard from 'src/components/otsi/otsiLeitudTooCard.vue';
import otsiTegijaKpvCard from 'src/components/otsi/otsiTegijaKpvCard.vue';
import otsiTegijaCard from 'src/components/otsi/otsiTegijaCard.vue';
import otsiEiLeidnudCard from 'src/components/otsi/otsiEiLeidnudCard.vue';
import otsiInputRida from 'src/components/otsi/otsiInputRida.vue';

import { CameraDevice, Html5Qrcode } from 'html5-qrcode';
//import otsiBarcode from 'src/components/otsi/otsiBarcode.vue';
import otsiBarcode2 from 'src/components/otsi/otsiBarcode2.vue';

import { storeToRefs } from 'pinia';

const otsiStore = useOtsiStore();
const {
  otsiText,
  leitudTood,
  loading,
  kesTegiLoading,
  groupedByKpv,
  uniqTegijad,
  otsinguStaatus,
} = storeToRefs(otsiStore);
const { otsiKoodi, otsiKesTegi, nulliKoik } = otsiStore;

const leitud = ref();
const onvalmis = ref(false);
const leitudError = ref();

const kaamerad = ref([] as CameraDevice[]);
const valitudKaamera = ref();

const test = (nimed: any) => {
  kaamerad.value = nimed;
};

//kas näitame ribokoodi akent
const naita = ref(false);
//Akttivne tab
const aktiivneTab = ref('kes');
//kas leitud töö on töösse võetud
const poleTöösseVõetud = computed(
  () => leitudTood.value.onresult == 0 && leitudTood.value.ontoos == 0
);

//Kas leitud tööl on tegijaid
const kasOnTegijaid = computed(
  () => otsinguStaatus.value == '1' && !poleTöösseVõetud.value
);

/* ------------------------- kui tuvastame ribakoodi ------------------------ */
async function onDecode(a: string) {
  //leitud.value = b;
  //panem leitud koodi otsingu teksti
  console.log(a, 'onDecode');

  otsiText.value = a;
  //otsime koodi
  otsiKoodiTegijat();
  naita.value = false;
}

/* ------------- kui vajutame otsingus enterit siis otsime koodi ------------ */
const otsiEnter = async (tulemus: string) => {
  otsiText.value = tulemus;
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
const otsiKaamerad = async () => {
  if (!kaamerad.value[0]) {
    console.log('Korjan kaamerad');

    Html5Qrcode.getCameras().then((devices) => {
      if (devices) {
        kaamerad.value = devices;
      }
    });
  }
};
const onValmis = () => (onvalmis.value = true);

const onError = (err: any) => (leitudError.value = err);
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
