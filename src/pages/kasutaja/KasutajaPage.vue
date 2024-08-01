<template>
  <q-page padding>
    <!-- content -->
    <pealkiri pealkiri="Kasutaja" :text-varv="pealkirjaVärv" klass="" />
    <div class="absolute-center" v-if="loading">
      <q-spinner color="primary" size="3em" />
    </div>
    <div v-else>
      <!-- pildi üleslaadimise väli, peidetud -->
      <input
        type="file"
        accept=".jpg, .png, .jpeg, image/*"
        name="pilt"
        id="myFile"
        @change="kuiTekkisPilt"
        style="display: none"
      />
      <div class="row justify-center">
        <div class="col-xs-12 col-lg-3">
          <div class="row justify-center">
            <q-btn outline round no-caps class="shadow-5" color="grey-1">
              <!-- Kui laeme serverist pilti -->
              <q-avatar v-if="piltLoading" size="130px">
                <q-spinner-hourglass color="secondary" />
              </q-avatar>

              <!-- Kui pilti ei ole: -->
              <q-avatar
                v-else-if="!kasOnPilt"
                size="130px"
                text-color="grey-5"
                icon="person"
                class="q-ma-xs"
              >
              </q-avatar>

              <!-- Kui on pilt siis näitame -->
              <q-avatar v-else size="130px" class="q-ma-xs">
                <q-img
                  ratio="1"
                  :src="`/api/kasutaja/pics/${kasutaja.pilt}`"
                  spinner-color="white"
                >
                </q-img>
              </q-avatar>
              <!-- Uue pildi valik ja vana kustutamine -->
              <q-menu :offset="[40, 10]" auto-close>
                <q-item clickable v-ripple @click="valiPilt">
                  <q-item-section style="font-size: 1.1rem">
                    {{ uuePildiText }}
                  </q-item-section>
                  <q-item-section avatar>
                    <q-icon :name="symOutlinedAddAPhoto" />
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item
                  clickable
                  v-ripple
                  @click="kustutaPilt"
                  v-if="kasOnPilt"
                >
                  <q-item-section style="font-size: 1.1rem"
                    >Kustutame pildi</q-item-section
                  >
                  <q-item-section avatar>
                    <q-icon color="negative" :name="symOutlinedNoPhotography" />
                  </q-item-section>
                </q-item>
              </q-menu>
            </q-btn>
          </div>
          <!-- Kasutaja nimi -->
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
                :readonly="kasutaja?.roll === 'kasutaja'"
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
            v-if="kasutaja.roll !== 'kasutaja'"
            rea-tekst="Roll"
            :rea-data="kasutaja?.roll"
          />
          <rida
            v-if="kasutaja.todate"
            rea-tekst="Aktiivne"
            :rea-data="date.formatDate(kasutaja?.todate, 'DD/MM/YYYY')"
          />
          <div class="col full-width text-center absolute" style="bottom: 30px">
            <q-btn outline rounded no-caps color="negative" @click="logout"
              >Logi välja</q-btn
            >
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

import { computed, onMounted, ref } from 'vue';

import { symOutlinedAddAPhoto } from '@quasar/extras/material-symbols-outlined';
import { symOutlinedNoPhotography } from '@quasar/extras/material-symbols-outlined';

import { useKasutajaStore } from '../../stores/kasutaja/kasutaja-store';
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

import { useAuthStore } from '../../stores/auth-store';
const auth = useAuthStore();

const pealkirjaVärv = 'positive';

const model = ref(asukModel);

const logout = () => auth.logout();

// Lihtsam valik pildi puhul
const kasOnPilt = computed(() => {
  return kasutaja.value.pilt ? true : false;
});
// Uue pildi valiku text:
const uuePildiText = computed(() => {
  return kasutaja.value.pilt ? 'Uus pilt' : 'Lisame pildi';
});

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
  kasutajaStore.kustutaPilt(kasutaja.value.pilt);
}

onMounted(() => {
  kasutajaStore.getAsukohad();
  kasutajaStore.getKasutaja(Number(route.params.id), true);
});
</script>
