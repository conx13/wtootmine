<template>
  <q-page padding>
    <!-- <q-page style="padding-top: 65px" padding> -->
    <!-- content -->
    <!-- <pealkiri pealkiri="Töötajad" text-varv="black" klass="" /> -->
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
        <div class="col-8">
          <q-form @submit="otsi()">
            <q-input
              ref="select_input"
              rounded
              dense
              type="text"
              outlined
              inputmode="text"
              enterKeyHint="search"
              v-model="otsiText"
              placeholder="Otsi töötajat:"
              input-style="font-size: 18px;"
              :loading="loadingOtsi"
            >
              <template v-if="otsiText && !loadingOtsi" v-slot:append>
                <q-icon
                  size="30px"
                  name="close"
                  @click.stop.prevent="otsiText = ''"
                  class="cursor-pointer"
                />
              </template>
              <template v-slot:prepend>
                <q-icon name="person_search" />
              </template>
            </q-input>
          </q-form>
        </div>
        <div class="col-3">
          <!-- kui ei ole õigusi siis ei näita -->
          <q-toggle
            v-if="!kasKasutaja"
            v-model="kasAktiivsed"
            @update:model-value="otsi"
            false-value="0"
            true-value="1"
            label="Akt."
          />
        </div>
      </q-toolbar>
    </q-header>
    <!--     <div class="absolute-center">
      <q-img src="/src/assets/People.png" width="500px" />
    </div> -->
    <div v-for="tootaja in tootajad" :key="tootaja.TID">
      <userItem
        :tid="tootaja.TID"
        :pilt="tootaja?.pilt"
        :pnimi="tootaja.PNIMI"
        :enimi="tootaja.ENIMI"
        :toogrupp_nimi="tootaja.toogrupp_nimi"
        @vajutasNuppu="tootajaBaasist"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import userItem from '../../components/yld/userItem.vue';
import { useTootajadStore } from 'src/stores/tootajad/tootajad_store';
import { useTootajaStore } from 'src/stores/tootmine/tootaja-store';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';

const router = useRouter();
const $q = useQuasar();
const tootajadStore = useTootajadStore();
const tootajaStore = useTootajaStore();

const { otsiText, kasAktiivsed, tootajad, loadingOtsi } =
  storeToRefs(tootajadStore);

//kasutame input fookuse jaoks
const select_input = ref();

//kasutame kasutaja rolli väärtuseks
const kasKasutaja = computed(() => {
  if (localStorage.getItem('roll') === 'kasutaja') {
    return true;
  }
  return false;
});

/* -------------------- teeme otsingu järgi päringu baasi ------------------- */
const otsi = async () => {
  // võtame otsingult fookuse ära
  select_input.value.blur();
  //otsime baasist töötajaid
  if (otsiText.value.trim() !== '') {
    await tootajadStore.getTootajad();
    if (tootajad.value.length === 0) {
      eiLeidnudTeade();
    }
  }
};

/* ------------------------- Näitame töötaja kaarti ------------------------- */
function tootajaBaasist(tid: number) {
  tootajaStore.getTootaja(Number(tid));
  setTimeout(() => {
    router.push({ name: 'm_tootajaPage', params: { id: tid } });
  }, 150);
}

/* ----------------------- Viime fookuse otsingu peale ---------------------- */
const fookus = () =>
  setTimeout(() => {
    select_input.value.focus();
  }, 0);

/*-----Kui ei leia kedaigi baasist, näitame teadet------ */
const eiLeidnudTeade = () => {
  $q.notify({
    message: 'Kahjuks ei leidnud kedagi!',
    type: 'negative',
    position: 'center',
    timeout: 1000,
  });
};

/* ---------------------------------- Start --------------------------------- */
onMounted(() => {
  fookus();
});
</script>
<style>
.centered {
  position: fixed; /* or absolute */
  top: 50%;
  left: 50%;
}
</style>
