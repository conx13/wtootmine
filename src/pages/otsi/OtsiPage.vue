<template>
  <q-page padding style="padding-top: 145px">
    <!-- <pealkiri pealkiri="Otsi töökoodi" /> -->
    <q-header class="bg-white text-primary" reveal>
      <q-toolbar
        class="bg-white q-py-sm"
        style="
          border: 1px solid #eaeaea;
          border-radius: 0 0 20px 20px;
          border-top: none;
          overflow: hidden;
        "
      >
        <div class="col">
          <q-btn flat round icon="arrow_back_ios" @click="$router.go(-1)" />
        </div>
        <div class="col-10">
          <!-- Otsimise texti riba -->
          <otsiInputRida :otsiText="otsiText" @update:otsiTex="otsiEnter" />
        </div>
        <div class="col">
          <q-btn
            flat
            round
            icon="sym_o_settings_photo_camera"
            :disable="kaamerad.length == 0"
          >
            <q-menu
              auto-close
              transition-show="flip-right"
              transition-hide="flip-left"
            >
              <q-list style="min-width: 100px">
                <q-item
                  clickable
                  v-for="kaamera in kaamerad"
                  :key="kaamera.deviceId"
                  @click="valitudKaamera(kaamera.deviceId)"
                >
                  <q-item-section>{{ kaamera.label }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- {{ kaamerad }}:Kaamerad -->
    <div v-if="naita">
      <otsiBarcode2 @leitud-kood="onDecode" @kaamerad="kaamerateList" />
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

    <q-tab-panels
      v-if="kasOnTegijaid"
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
        :icon="!naita ? 'sym_o_barcode_scanner' : 'sym_o_close'"
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
      <!-- Otsimise texti riba -->
      <!-- <otsiInputRida :otsiText="otsiText" @update:otsiTex="otsiEnter" /> -->
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
//import { StreamBarcodeReader } from '@teckel/vue-barcode-reader';

import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import otsiBarcode2 from 'src/components/otsi/otsiBarcode2.vue';

import { useOtsiStore } from 'src/stores/otsi/otsi-store';
import otsiLeitudTooCard from 'src/components/otsi/otsiLeitudTooCard.vue';
import otsiTegijaKpvCard from 'src/components/otsi/otsiTegijaKpvCard.vue';
import otsiTegijaCard from 'src/components/otsi/otsiTegijaCard.vue';
import otsiEiLeidnudCard from 'src/components/otsi/otsiEiLeidnudCard.vue';
import otsiInputRida from 'src/components/otsi/otsiInputRida.vue';

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

const kaamerad = ref([] as MediaDeviceInfo[]);

//const valitudKaamera = ref();

//kas näitame ribokoodi akent
const naita = ref(false);
//Akttivne tab
const aktiivneTab = ref('kes');
//kas leitud töö on töösse võetud
const poleTöösseVõetud = computed(
  () => leitudTood.value.onresult == 0 && leitudTood.value.ontoos == 0
);
const isMediaStreamAPISupported =
  navigator &&
  navigator.mediaDevices &&
  'enumerateDevices' in navigator.mediaDevices;

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

const kaamerateList = (leitudKaamerad: MediaDeviceInfo[]) => {
  kaamerad.value = leitudKaamerad;
  console.log(kaamerad, 'leitud kaamerad');
};

const valitudKaamera = (cameraId: string) => {
  if (cameraId) {
    localStorage.setItem('cameraid', cameraId);
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
