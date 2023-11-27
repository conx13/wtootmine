<template>
  <q-header bordered class="bg-white text-primary" reveal>
    <q-toolbar>
      <div class="row full-width">
        <div class="col-2">
          <q-btn flat round dense icon="arrow_back_ios" @click="tagasi" />
        </div>
        <div class="col-8">
          <div :class="`text-center text-h5 text-grey-8`">
            {{ $route.params.grupp }}
          </div>
        </div>
      </div>
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
        <q-tab-panels animated v-model="tab">
          <q-tab-panel name="tootajad" class="no-padding">
            <div
              class="row-inline q-ma-sm"
              v-for="item in gruppTootajad"
              :key="item.TID"
            >
              <tootmine-grupp-card :tootaja-grupp="item" />
            </div>
          </q-tab-panel>
          <q-tab-panel name="tood" class="no-padding">
            <div
              class="row-inline q-ma-sm"
              v-for="item in gruppTood"
              :key="item.JID"
            >
              <too-tegijad-card
                :jid="item.JID"
                :too="item.TOO"
                :lepnr="item.LEPNR"
              />
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useTootmineStore } from '../../stores/tootmine/tootmine-store';
import TootmineGruppCard from '../../components/tootmine/TootmineGruppCard.vue';
import tooTegijadCard from '../../components/tootmine/tooTegijadCard.vue';

const route = useRoute();
const router = useRouter();
const tootStore = useTootmineStore();
const { gruppTootajad, loading, gruppTood } = storeToRefs(tootStore);
const tab = ref('tootajad');

onMounted(() => tootStore.getGrupp(String(route.params.grupp)));
function tagasi() {
  router.go(-1);
}
</script>
