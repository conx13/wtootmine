<template>
  <q-header bordered class="bg-white text-primary" reveal>
    <q-toolbar>
      <q-btn flat round dense icon="arrow_back_ios" @click="tagasi" />
      <q-toolbar-title class="text-center text-h5">
        <div class="row justify-center">
          <div>Pärnu: {{ $route.params.grupp }} -</div>

          <div class="text-positive">
            {{ gruppTootajad.length }}
          </div>
        </div>
      </q-toolbar-title>
    </q-toolbar>
    <q-toolbar>
      <q-toolbar-title>
        <q-tabs v-model="tab" dense align="justify" active-color="primary">
          <q-tab name="tab1" label="Töötajad" />
          <q-tab name="tab2" label="Tööd" />
        </q-tabs>
      </q-toolbar-title>
    </q-toolbar>
  </q-header>
  <q-page padding>
    <div class="absolute-center" v-show="loading">
      <q-spinner color="primary" size="3em" />
    </div>
    <!-- content -->
    <div class="row justify-center" v-show="!loading">
      <div class="col-lg-3 col-xs-12">
        <div v-for="item in gruppTood" :key="item.JID">
          {{ item.TOO }} {{ item.LEPNR }}
        </div>
        <div
          class="row-inline q-ma-xs"
          v-for="item in gruppTootajad"
          :key="item.TID"
        >
          <tootmine-grupp-card :tootaja-grupp="item" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTootmineStore } from '../../stores/tootmine/tootmine-store';
import { storeToRefs } from 'pinia';

import TootmineGruppCard from '../../components/tootmine/TootmineGruppCard.vue';

const route = useRoute();
const router = useRouter();
const tootStore = useTootmineStore();
const { gruppTootajad, loading, gruppTood } = storeToRefs(tootStore);
const tab = ref('tab1');

onMounted(() => tootStore.getGrupp(String(route.params.grupp)));
function tagasi() {
  router.go(-1);
}
</script>
