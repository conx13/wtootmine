<template>
  <q-page padding>
    <div class="absolute-center" v-show="loading">
      <q-spinner color="primary" size="3em" />
    </div>
    <div v-show="!loading">
      <div class="row justify-center">
        <div class="myribakood text-h5 q-mb-md">*{{ tootaja.IKOOD }}*</div>
      </div>
      <div class="row justify-center">
        <q-btn outline round no-caps class="shadow-5" color="grey-1">
          <q-avatar
            v-if="!tootaja.pilt"
            size="130px"
            text-color="grey-5"
            icon="face_6"
            class="q-ma-xs"
          />
          <q-avatar v-if="tootaja.pilt" size="130px" class="q-ma-xs">
            <q-img
              :src="`/api/pics/${tootaja.pilt}`"
              spinner-color="white"
            ></q-img>
          </q-avatar>
        </q-btn>
      </div>
      <div class="row justify-center">
        <div class="text-h4 q-py-md">
          {{ tootaja.PNIMI }} {{ tootaja.ENIMI }}
        </div>
      </div>
      <q-separator inset class="q-mb-md" />
      <a :href="`tel:${tootaja.telefon}`">
        <rida rea-tekst="Telefon" :rea-data="tootaja.telefon" />
        <rida rea-tekst="Email" :rea-data="tootaja.email" />
      </a>

      <q-separator inset class="q-my-md" />

      <rida rea-tekst="Töö grupp" :rea-data="tootaja.toogrupp_nimi" />
      <rida rea-tekst="Aja grupp" :rea-data="tootaja.Ajanimi" />

      <q-separator inset class="q-my-md" />
      <rida rea-tekst="Asutus" :rea-data="tootaja.firma" />
      <rida rea-tekst="Töökoht" :rea-data="tootaja.asukoht" />

      <q-separator inset class="q-my-md" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

import { useTootajaStore } from 'src/stores/tootmine/tootaja-store';
import rida from '../../components/tootaja/ridaComp.vue';

const route = useRoute();
const tootajaStore = useTootajaStore();
const { tootaja, tahed, loading } = storeToRefs(tootajaStore);

//const pilturl = '/api/pics/' + pilt.value;
onMounted(() => {
  tootajaStore.getTootaja(Number(route.params.id));
});
</script>
