<template>
  <q-page padding>
    <pealkiri :pealkiri="`*${tootaja?.IKOOD}*`" klass="myribakood text-black" />
    <div class="absolute-center" v-show="loading">
      <q-spinner color="primary" size="3em" />
    </div>
    <div v-show="!loading">
      <div class="row justify-center">
        <div class="col-xs-12 col-lg-3">
          <div class="row justify-center">
            <q-btn outline round no-caps class="shadow-5" color="grey-1">
              <q-avatar
                v-if="!tootaja?.pilt"
                size="130px"
                text-color="grey-5"
                icon="person"
                class="q-ma-xs"
              />
              <q-avatar v-if="tootaja?.pilt" size="130px" class="q-ma-xs">
                <q-img
                  ratio="1"
                  :src="`/api/pics/${tootaja.pilt}`"
                  spinner-color="white"
                ></q-img>
              </q-avatar>
            </q-btn>
          </div>
          <div class="row justify-center">
            <div class="text-h4 q-py-md">
              {{ tootaja?.PNIMI }} {{ tootaja?.ENIMI }}
            </div>
          </div>
          <q-separator inset class="q-mb-md" />
          <a :href="`tel:${tootaja?.telefon}`">
            <div v-ripple:primary class="relative-position">
              <rida rea-tekst="Telefon" :rea-data="tootaja?.telefon" />
            </div>
          </a>
          <rida rea-tekst="Email" :rea-data="tootaja?.email" />

          <q-separator inset class="q-my-md" />

          <rida rea-tekst="Töö grupp" :rea-data="tootaja?.toogrupp_nimi" />
          <rida rea-tekst="Aja grupp" :rea-data="tootaja?.Ajanimi" />

          <q-separator inset class="q-my-md" />
          <rida rea-tekst="Asutus" :rea-data="tootaja?.firma" />
          <rida rea-tekst="Töökoht" :rea-data="tootaja?.asukoht" />

          <q-separator inset class="q-my-md" />
          <div
            class="text-caption text-center text-positive"
            :class="{ 'text-negative': txtVarv }"
          >
            {{ viimatiAktiivne(tootaja.viimatiAkt) }}
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';

import pealkiri from 'src/components/yld/headerComp.vue';
import { useTootajaStore } from 'src/stores/tootmine/tootaja-store';
import rida from '../../components/tootaja/ridaComp.vue';

const route = useRoute();
const router = useRouter();
const tootajaStore = useTootajaStore();
const { tootaja, loading } = storeToRefs(tootajaStore);
const txtVarv = ref(false);

/* ---------- Abivalem, mis kontrollib ka object on tyhi või mitte ---------- */
function isEmptyObject(obj: object): boolean {
  for (const key in obj) {
    return false;
  }
  return true;
}

/* -- Et kui töötaja on olnud täna aktiivne siis ühte värvi ja muidu punane - */
function viimatiAktiivne(va: number | null) {
  if (va === 0) {
    txtVarv.value = false;
    return 'Töötaja oli/on täna aktiivne';
  } else if (va === 1) {
    txtVarv.value = true;
    return `Töötaja oli aktiivne ${va} päev tagasi.`;
  }
  txtVarv.value = true;
  return `Töötaja oli aktiivne ${va} päeva tagasi.`;
}
/* --------------------- //Kui laeme akna, siis täidame --------------------- */
onMounted(() => {
  //Kontrollime kas juba on andmed stores olemas või andmed on tulemas
  console.log('töötaja on mounted');

  if (isEmptyObject(tootaja.value) && !loading.value) {
    tootajaStore.getTootaja(Number(route.params.id));
  }
});

//Liigume tagasi
function tagasi() {
  router.go(-1);
}
</script>
