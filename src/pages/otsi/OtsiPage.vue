<template>
  <q-page padding style="padding-top: 65px">
    <pealkiri pealkiri="Otsi töökoodi" />
    <!-- content -->
    <div v-if="naita" class="col">
      <StreamBarcodeReader @decode="(a: string) => onDecode(a)" />
    </div>
    <!-- Kui me otsime: -->
    <div class="absolute-center" v-show="loading">
      <q-spinner color="primary" size="3em" />
    </div>

    <!-- Kui me ei leidnud midagi: -->
    <transition name="fade">
      <q-card
        v-if="otsinguStaatus === '0'"
        flat
        bordered
        class="q-mt-xs"
        style="
          border-radius: 20px;
          border-color: red;
          border-style: solid;
          border-width: 1px;
        "
      >
        <q-card-section
          class="text-negative text-center"
          style="font-size: 18px"
        >
          Sellise koodiga tööd ei leidnud!
        </q-card-section>
      </q-card>
    </transition>
    <!-- Kui me otsime tegijaid -->
    <div class="col text-center" v-show="kesTegiLoading">
      <q-spinner-dots color="primary" size="3em" />
    </div>
    <!-- leitud tegijate kaart -->
    <div
      v-for="(tegijad, index) in groupedByKpv"
      :key="index"
      v-show="otsinguStaatus === '1'"
    >
      {{ tegijad }}
    </div>

    <!-- barcode aken -->
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
    <q-page-sticky expand position="top">
      <q-toolbar class="">
        <div class="col">
          <q-form @submit="otsiEnter()">
            <q-input
              class="bg-white"
              ref="otsi_input"
              rounded
              outlined
              type="number"
              enterKeyHint="search"
              placeholder="Otsi töökoodi:"
              input-style="font-size: 20px"
              v-model="otsiText"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
              <template v-if="otsiText" v-slot:append>
                <q-icon
                  size="30px"
                  name="close"
                  @click.stop.prevent="otsiText = ''"
                ></q-icon>
              </template>
            </q-input>
          </q-form>
        </div>
      </q-toolbar>
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

const otsi_input = ref();
const koodiEiLeitud = ref(false);

//kui tuvastame ribakoodi
function onDecode(a: string) {
  otsiText.value = a;
  naita.value = false;
  otsiKoodiTegijat();
}

//kui vajutame otsingus enterit
const otsiEnter = async () => {
  // võtame otsingult fookuse ära
  otsi_input.value.blur();
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

const otsiTegijaid = (jid: number) => {
  visible.value = !visible.value;
  if (visible.value) {
    otsiKesTegi(jid);
  }
  console.log('Kes tegi test 2');
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
