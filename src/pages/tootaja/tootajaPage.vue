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
              <q-menu :offset="[40, 10]" auto-close v-if="!kasKasutaja">
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
          <div class="row justify-center">
            <!-- Näitame kui töötaja ei ole aktiivne -->
            <div v-if="!aktiivneToo" class="text-caption text-negative">
              {{ viimatiAktiivne }}
            </div>
            <!-- Näitame kui saame töötaja töö ootele panna -->
            <div
              v-if="aktiivneToo && tootaja?.jid !== ootanToodId && !kasKasutaja"
            >
              <q-btn
                color="primary"
                no-caps
                outline
                :icon-right="symOutlinedAutopause"
                class="col-8"
                label="Paneme töötaja 'Töö ootele'"
                @click="avaMuudameTood"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <q-dialog v-model="dialogMuudameTood" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">
            Muudame hetke töö "Ootan tööd" tööks ja selle alguse aeg oleks:
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-time
            :options="miinimumAeg"
            format24h
            mask="YYYY-MM-DD HH:mm:ss"
            v-model="algusAeg"
          />
        </q-card-section>

        <q-card-actions align="center">
          <q-btn class="col-4" label="Cancel" v-close-popup />
          <q-btn
            class="col-4"
            label="Muudame"
            color="primary"
            v-close-popup
            @click="muudameTood"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';

import { symOutlinedAddAPhoto } from '@quasar/extras/material-symbols-outlined';
import { symOutlinedNoPhotography } from '@quasar/extras/material-symbols-outlined';
import { symOutlinedAutopause } from '@quasar/extras/material-symbols-outlined';

import pealkiri from '../../components/yld/headerComp.vue';
import { useTootajaStore } from '../../stores/tootmine/tootaja-store';
import rida from '../../components/tootaja/ridaComp.vue';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const tootajaStore = useTootajaStore();
const { tootaja, loading, piltLoading } = storeToRefs(tootajaStore);

const dialogMuudameTood = ref(false);
const algusAeg = ref();
const ootanToodId = computed(() => {
  return Number(localStorage.getItem('ootanToodId'));
});
//kasutame kasutaja rolli väärtuseks
const kasKasutaja = computed(() => {
  if (localStorage.getItem('roll') === 'kasutaja') {
    return true;
  }
  return false;
});

/* -- Et kas töötaja on hetkel aktiivne - */
const aktiivneToo = computed(() => {
  const va = tootaja.value.viimatiAkt;
  return va === 0 ? true : false;
});
// viimati aktiivne text vastavalt tulemusele
const viimatiAktiivne = computed(() => {
  const va = tootaja.value.viimatiAkt;
  if (va === 1) {
    return `Töötaja oli aktiivne ${va} päev tagasi.`;
  }
  return `Töötaja oli aktiivne ${va} päeva tagasi.`;
});

// Kas on pilt olemas ja vastav valik siis
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

//Avame töö aja muutmise dialoogi
const avaMuudameTood = () => {
  algusAeg.value = tootaja.value.start;
  console.log(algusAeg.value, 'algusAeg');

  dialogMuudameTood.value = true;
};

// Muudame töötaja töö ootele
const muudameTood = async () => {
  //const tooId = 47838;
  try {
    await tootajaStore.muudaLisaTootajaAega(
      tootaja.value.TID,
      tootaja.value.rid,
      tootaja.value.start,
      algusAeg.value,
      ootanToodId.value
    );
    $q.notify({
      message: 'Töötaja töö muudeti!',
      type: 'positive',
      icon: 'check',
      position: 'top',
    });
  } catch (err) {}
};

//ei luba kasutajal varemsema ajaga tööd muuta
const miinimumAeg = (hr: number, min: number | null) => {
  const aeg = new Date(tootaja.value.start);
  const minHour = aeg.getHours(); // Get the minimum hour from the date
  const minMinute = aeg.getMinutes(); // Get the minimum minute from the date
  // Kui aeg on etteantust suurem
  if (
    hr >= minHour &&
    (hr > minHour || (hr === minHour && (min === null || min >= minMinute)))
  ) {
    return true;
  }
  //kui aeg on väiksem etteantust
  return false;
};

//Liigume tagasi
function tagasi() {
  router.go(-1);
}

/* --------------------- //Kui laeme akna, siis täidame --------------------- */
onMounted(() => {
  //Kontrollime kas juba on andmed stores olemas või andmed on tulemas
  if (isEmptyObject(tootaja.value) && !loading.value) {
    tootajaStore.getTootaja(Number(route.params.id));
  }
});
</script>
