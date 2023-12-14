<template>
  <q-header bordered class="bg-white text-primary" reveal>
    <q-toolbar class="q-py-sm">
      <q-toolbar-title class="text-center text-h5">
        Pärnu: {{ $route.meta.title }}</q-toolbar-title
      >
      <q-btn outline rounded no-caps padding="none">
        <div v-if="kasutaja" class="row items-center">
          <q-avatar
            size="30px"
            color="grey"
            text-color="white"
            class="q-ma-xs"
            >{{ kasutaja[0] }}</q-avatar
          >
        </div>
        <q-menu content-class="bg-blue-grey-5 text-white">
          <q-list>
            <q-item
              clickable
              v-close-popup
              :to="{ name: 'kasutajaPage', params: { id: 4 } }"
            >
              <q-item-section>{{ kasutaja }}</q-item-section>
              <q-item-section avatar>
                <q-icon name="user"></q-icon>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="logiValja">
              <q-item-section>Logi välja</q-item-section>
              <q-item-section avatar>
                <q-icon name="exit_to_app"></q-icon>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
      <!-- <div>Quasar v{{ $q.version }}</div> -->
    </q-toolbar>
  </q-header>

  <q-page style="padding-top: 120px">
    <div class="">
      <q-pull-to-refresh @refresh="refresh">
        <div class="row justify-center">
          <div class="col-xs-12 col-lg-3">
            <tootmine-list />
            <!--Kuna kasutame Sticky, siis peab olema kõige lõpus-->
            <aktiivsed-riba />
          </div>
        </div>
      </q-pull-to-refresh>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useTootmineStore } from '../../stores/tootmine/tootmine-store';
import TootmineList from '../../components/tootmine/TootmineList.vue';
import AktiivsedRiba from '../../components/tootmine/AktiivsedRiba.vue';

import { useAuthStore } from '../../stores/auth-store';
import { storeToRefs } from 'pinia';

const tootStore = useTootmineStore();

const auth = useAuthStore();
const { kasutaja } = storeToRefs(useAuthStore());

onMounted(() => {
  tootStore.getHetkelTool();
  //getAktiivsedRibaData();
});

function logiValja() {
  auth.logout();
}
async function refresh(done: () => void) {
  await tootStore.getHetkelTool();
  done();
}
</script>
