<template>
  <q-header bordered class="bg-white text-primary" reveal>
    <q-toolbar class="q-py-sm">
      <q-btn flat round icon="arrow_back_ios" @click="$router.go(-1)" />
      <q-toolbar-title :class="`text-h5 text-grey-8`">{{
        $route.params.grupp
      }}</q-toolbar-title>
    </q-toolbar>
    <q-toolbar class="text-grey-7">
      <div class="col">
        <q-tabs
          v-model="tab"
          dense
          align="justify"
          active-color="grey-9"
          inline-label
        >
          <q-tab icon="groups" name="tootajad" label="Töötajad" />
          <!-- Kui on ainult 1 erinev töö, siis ei näita -->
          <q-tab
            v-if="gruppTood.length > 1"
            icon="construction"
            name="tood"
            label="Tööd"
          />
        </q-tabs>
      </div>
    </q-toolbar>
  </q-header>
  <q-page>
    <div class="absolute-center" v-show="loading">
      <q-spinner color="primary" size="3em" />
    </div>
    <!-- content -->
    <div class="row justify-center" v-show="!loading">
      <div class="col-lg-3 col-xs-12">
        <q-tab-panels
          keep-alive
          animated
          v-model="tab"
          @transition="aktiivneSakk()"
        >
          <q-tab-panel name="tootajad" class="no-padding">
            <tootmine-grupp-card
              @refresh="refresh"
              @too-ootele="avaMuudameTood"
              v-for="item in gruppTootajad"
              :key="item.TID"
              :tootaja-grupp="item"
              :viimati-vaatasid="viimatiVaatasid"
              :onAdmin="onAdmin"
            />
            <!-- </div> -->
          </q-tab-panel>
          <q-tab-panel name="tood" class="no-padding">
            <too-tegijad-card
              v-for="item in gruppTood"
              :key="item.TID"
              :jid="item.JID"
              :too="item.TOO"
              :start="item.START"
              :viimati-vaatasid="viimatiVaatasid"
              :lepnr="item.LEPNR"
              :tootaja-grupp="item"
            />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
  <q-dialog v-model="dialogMuudameTood" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6">
          Muudame hetke töö "Ootan tööd" tööks ja selle alguse aeg oleks:
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-time
          :options="miinimumTund"
          format24h
          mask="YYYY-MM-DD HH:mm:ss"
          v-model="algusAeg"
        />
      </q-card-section>

      <q-card-actions align="center">
        <q-btn flat label="Cancel" color="secondary" v-close-popup />
        <q-btn
          flat
          label="Muudame"
          color="primary"
          v-close-popup
          @click="muudameTood"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useTootmineStore } from '../../stores/tootmine/tootmine-store';
import TootmineGruppCard from '../../components/tootmine/TootmineGruppCard.vue';
import tooTegijadCard from '../../components/tootmine/tooTegijadCard.vue';

const route = useRoute();

const tootStore = useTootmineStore();
const { loading, gruppTootajad, gruppTood, viimatiVaatasid } =
  storeToRefs(tootStore);
const tab = ref('tootajad');
const onAdmin = ref(false);
const dialogMuudameTood = ref(false);
const algusAeg = ref();

onMounted(() => {
  //Vaatame ajaloost, milline tab oli aktiivne
  if (sessionStorage.getItem(String(route.params.grupp))) {
    tab.value = String(sessionStorage.getItem(String(route.params.grupp)));
  }
  //juhul kui grupp on stores olemas, siis rohkem ei küsi
  if (!gruppTootajad.value.length && !loading.value) {
    tootStore.getGrupp(String(route.params.grupp));
  }
  if (localStorage.getItem('roll') === 'admin') {
    onAdmin.value = true;
  }
});

//teeme refreshi
function refresh() {
  tootStore.getGrupp(String(route.params.grupp));
}

//Kirjutame ajalukku aktiivse tabi
function aktiivneSakk() {
  sessionStorage.setItem(String(route.params.grupp), tab.value);
}

const avaMuudameTood = (tulem: { tid: number; start: string }) => {
  algusAeg.value = tulem.start;
  dialogMuudameTood.value = true;
};

const muudameTood = () => {
  console.log('Muudetud aeg', algusAeg.value);
};

const miinimumTund = (hr: number) => {
  const aeg = new Date(algusAeg.value);
  return hr >= aeg.getHours();
};
</script>
