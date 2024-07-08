<template>
  <q-page padding>
    <pealkiri :pealkiri="`*${tootaja?.IKOOD}*`" klass="myribakood text-black" />
    <!-- Kui laeme lehte -->
    <div class="absolute-center" v-if="loading">
      <q-spinner color="primary" size="3em" />
    </div>
    <!-- Kui leht on laetud -->
    <div v-else>
      <!-- pildi üleslaadimise väli, peidetud -->
      <input
        type="file"
        accept=".jpg, .png, .jpeg, | image/*"
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
              <!-- Kui ei ole pilti -->
              <q-avatar
                v-else-if="!kasOnPilt"
                size="130px"
                text-color="grey-5"
                icon="person"
                class="q-ma-xs"
              >
              </q-avatar>
              <!-- Kui on pilt -->
              <q-avatar v-else size="130px" class="q-ma-xs">
                <q-img
                  ratio="1"
                  loading="lazy"
                  :src="`/api/pics/${tootaja.pilt}`"
                  spinner-color="white"
                />
              </q-avatar>
              <!-- Uue pildi valik või vana kustutamine -->
              <q-menu
                :offset="[40, 10]"
                auto-close
                v-if="user?.roll === 'admin'"
              >
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
import { computed, onMounted, ref } from 'vue';

import { symOutlinedAddAPhoto } from '@quasar/extras/material-symbols-outlined';
import { symOutlinedNoPhotography } from '@quasar/extras/material-symbols-outlined';

import pealkiri from 'src/components/yld/headerComp.vue';
import { useTootajaStore } from 'src/stores/tootmine/tootaja-store';
import { useAuthStore } from '../../stores/auth-store';
import rida from '../../components/tootaja/ridaComp.vue';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const tootajaStore = useTootajaStore();
const { tootaja, loading, piltLoading } = storeToRefs(tootajaStore);
const { user } = storeToRefs(auth);
const txtVarv = ref(false);

// Lihtsam valik pildi puhul
const kasOnPilt = computed(() => {
  return tootaja.value.pilt ? true : false;
});
// Uue pildi valiku text:
const uuePildiText = computed(() => {
  return tootaja.value.pilt ? 'Uus pilt' : 'Lisame pildi';
});

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
// Tekitame peidetud pildile kliki
const valiPilt = () => {
  document.getElementById('myFile')?.click();
};
// Kui tekkis pilt siis laeme serverisse
const kuiTekkisPilt = (e: Event) => {
  const data = (<HTMLInputElement>e.target)?.files?.[0];
  if (data) {
    tootajaStore.muudaPilt(data);
  }
};
// Kustutame pildi
const kustutaPilt = () => tootajaStore.kustutaPilt(tootaja.value.pilt);

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
