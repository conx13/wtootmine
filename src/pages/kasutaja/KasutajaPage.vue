<template>
  <q-page padding>
    <!-- content -->
    <pealkiri pealkiri="Kasutaja:" :text-varv="pealkirjaVärv" />

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
              @click="test"
            >
              <q-avatar
                v-if="!kasutaja?.pilt"
                size="130px"
                text-color="grey-5"
                icon="person"
                class="q-ma-xs" />
              <q-avatar v-else size="130px" class="q-ma-xs">
                <q-img
                  ratio="1"
                  :src="`/api/pics/${kasutaja.pilt}`"
                  spinner-color="white"
                ></q-img> </q-avatar
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
                v-model="model"
                borderless
                hide-bottom-space
                behavior="menu"
                dense
                style="font-size: 1.1rem"
              ></q-select>
            </div>
          </div>
          <q-separator inset class="q-mb-md" />
          <rida rea-tekst="Roll" :rea-data="kasutaja?.roll" />
          <rida
            rea-tekst="Aktiivne"
            :rea-data="date.formatDate(kasutaja?.todate, 'DD/MM/YYYY')"
          />
        </div>
      </div>
    </div>
    <q-dialog v-model="pildiDialog">
      <q-card class="my-card">
        <q-uploader
          :url="`api/users/editpic/${kasutaja.id}`"
          field-name="pilt"
          flat
          accept=".jpg, image/*"
          @failed="piltFailed"
        />
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

import { onMounted, ref } from 'vue';
import { useTootajaStore } from '../../stores/kasutaja/kasutaja-store';
import pealkiri from '../../components/yld/headerComp.vue';
import rida from '../../components/tootaja/ridaComp.vue';
import { date } from 'quasar';

const route = useRoute();
const kasutajaStore = useTootajaStore();
const { kasutaja, loading, asukohaValik, asukModel } =
  storeToRefs(kasutajaStore);
const pealkirjaVärv = 'positive';
const pildiDialog = ref(false);

const model = ref(asukModel);

function piltFailed(err: unknown) {
  console.log(err, 'ERROR');
}

function test() {
  document.getElementById('myFile')?.click();
}
function kuiTekkisPilt(e: Event) {
  console.log((<HTMLInputElement>e.target)?.files?.[0]);
  const data = (<HTMLInputElement>e.target)?.files?.[0];
  if (data) {
    kasutajaStore.muudaPilt(data);
  }
}

onMounted(() => {
  kasutajaStore.getAsukohad();
  kasutajaStore.getKasutaja(Number(route.params.id));
});
</script>
