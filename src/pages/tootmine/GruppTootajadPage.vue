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
          <q-tab icon="construction" name="tood" label="Tööd" />
        </q-tabs>
      </div>
    </q-toolbar>
  </q-header>
  <q-page padding>
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
              v-for="item in gruppTootajad"
              :key="item.TID"
              :tootaja-grupp="item"
              :viimati-vaatasid="viimatiVaatasid"
            />
            <!-- </div> -->
          </q-tab-panel>
          <q-tab-panel name="tood" class="no-padding">
            <too-tegijad-card
              :jid="item.JID"
              :too="item.TOO"
              :start="item.START"
              :viimati-vaatasid="viimatiVaatasid"
              :lepnr="item.LEPNR"
              v-for="item in gruppTood"
              :key="item.TID"
              :tootaja-grupp="item"
            />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useTootmineStore } from '../../stores/tootmine/tootmine-store';
import TootmineGruppCard from '../../components/tootmine/TootmineGruppCard.vue';
import tooTegijadCard from '../../components/tootmine/tooTegijadCard.vue';
import { start } from 'repl';

const route = useRoute();

const tootStore = useTootmineStore();
const { loading, gruppTootajad, gruppTood, viimatiVaatasid } =
  storeToRefs(tootStore);
const tab = ref('tootajad');

onMounted(() => {
  //Vaatame ajaloost, milline tab oli aktiivne
  if (sessionStorage.getItem(String(route.params.grupp))) {
    tab.value = String(sessionStorage.getItem(String(route.params.grupp)));
  }
  tootStore.getGrupp(String(route.params.grupp));
});

//Kirjutame ajlukku aktiivse tabi
function aktiivneSakk() {
  sessionStorage.setItem(String(route.params.grupp), tab.value);
}
</script>
