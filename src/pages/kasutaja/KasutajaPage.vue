<template>
  <q-page padding>
    <!-- content -->
    <pealkiri pealkiri="Kasutaja" :text-varv="pealkirjaVärv" klass="" />

    <div class="absolute-center" v-if="loading">
      <q-spinner color="primary" size="3em" />
    </div>
    <!-- none -->
    <div v-else>
      <input
        type="file"
        accept=".jpg, .png, .jpeg|image/*"
        name="pilt"
        id="myFile"
        @change="kuiTekkisPilt"
        style="display: none"
      />
      <div class="row justify-center">
        <div class="col-xs-12 col-lg-3">
          <div class="row justify-center">
            <q-btn
              outline
              round
              no-caps
              class="shadow-5"
              color="grey-1"
              @click="pildiDialog = true"
            >
              <q-avatar v-if="piltLoading" size="130px" class="">
                <q-spinner-hourglass color="secondary" />
              </q-avatar>
              <q-avatar
                v-else-if="!kasutaja?.pilt"
                size="130px"
                text-color="grey-5"
                icon="person"
                class="q-ma-xs" />
              <q-avatar v-else size="130px" class="q-ma-xs">
                <q-img
                  ratio="1"
                  :src="`/api/pics/${kasutaja.pilt}`"
                  spinner-color="white"
                >
                </q-img>
                <q-btn
                  rounded
                  outline
                  icon="edit"
                  color="green"
                  style="bottom: -0px; right: -70px"
                /> </q-avatar
            ></q-btn>
          </div>
          <div class="row justify-center">
            <div class="text-h4 q-py-md">
              {{ kasutaja?.pnimi }} {{ kasutaja?.enimi }}
            </div>
          </div>
          <q-separator inset class="q-mb-md" />
          <rida rea-tekst="Telefon" :rea-data="kasutaja?.mob" />
          <rida rea-tekst="Email" :rea-data="kasutaja?.email" />
          <q-separator inset class="q-mb-md" />
          <rida rea-tekst="Asutus" :rea-data="kasutaja?.asutus" />
          <div class="row q-py-xs items-center">
            <div
              class="col-3 text-right q-mr-md text-grey-7"
              style="font-size: 1rem"
            >
              Töökoht:
            </div>
            <div class="col-6" style="font-size: 1.1rem">
              <q-select
                :options="asukohaValik"
                :loading="asukohtLoading"
                :readonly="kasutaja?.roll !== 'admin'"
                v-model="model"
                @update:model-value="updateAsukoht"
                rounded
                outlined
                hide-bottom-space
                behavior="menu"
                dense
                style="font-size: 1.1rem"
              ></q-select>
            </div>
          </div>
          <q-separator inset class="q-mb-md" />
          <rida
            v-if="kasutaja.roll === 'admin'"
            rea-tekst="Roll"
            :rea-data="kasutaja?.roll"
          />
          <rida
            v-if="kasutaja.todate"
            rea-tekst="Aktiivne"
            :rea-data="date.formatDate(kasutaja?.todate, 'DD/MM/YYYY')"
          />
        </div>
      </div>
    </div>
    <q-dialog v-model="pildiDialog">
      <q-card class="my-card" style="width: 250px" bordered>
        <q-card-section class="bg-primary text-white text-center">
          <div class="text-h6">Pilt?</div>
        </q-card-section>
        <q-card-section class="q-pa-xs">
          <q-card-actions vertical>
            <q-btn
              rounded
              outline
              no-caps
              label="Muudame/lisame pildi"
              icon="cloud_upload"
              color="primary"
              @click="valiPilt"
              v-close-popup
            ></q-btn>
            <q-separator inset spaced />
            <q-btn
              no-caps
              rounded
              outline
              icon="delete"
              label="Kustutame pildi"
              color="negative"
              @click="kustutaPilt"
              v-close-popup
            ></q-btn>
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

import { onMounted, ref } from 'vue';
import { useKasutajaStore } from 'src/stores/kasutaja/kasutaja-store';
import pealkiri from '../../components/yld/headerComp.vue';
import rida from '../../components/tootaja/ridaComp.vue';
import { date } from 'quasar';
import { Valikud } from 'src/models/kasutaja/kasutajaModel';

const route = useRoute();

const kasutajaStore = useKasutajaStore();
const {
  kasutaja,
  loading,
  asukohaValik,
  asukModel,
  piltLoading,
  asukohtLoading,
} = storeToRefs(kasutajaStore);
const pealkirjaVärv = 'positive';
const pildiDialog = ref(false);

const model = ref(asukModel);

/* -------------------------- Kui muudame asukohta -------------------------- */
function updateAsukoht(value: Valikud) {
  kasutajaStore.muudaAsuk(value.value);
}
/* ------------------------------ Valime pildi ------------------------------ */
function valiPilt() {
  document.getElementById('myFile')?.click();
}

/* ------- Jälgime, et kui tekib pilt siis laeme selle kohe serverisse ------ */
function kuiTekkisPilt(e: Event) {
  const data = (<HTMLInputElement>e.target)?.files?.[0];
  if (data) {
    kasutajaStore.muudaPilt(data);
  }
}
/* ------------------------ Kustutame kasutaja pildi ------------------------ */
function kustutaPilt() {
  kasutajaStore.muudaPilt();
}
onMounted(() => {
  kasutajaStore.getAsukohad();
  kasutajaStore.getKasutaja(Number(route.params.id), true);
});
</script>
