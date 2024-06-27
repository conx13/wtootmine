<template>
  <q-page style="padding-top: 120px">
    <q-header bordered class="bg-white text-primary" reveal>
      <q-toolbar class="">
        <div class="row full-width items-center">
          <div class="col test">
            <q-toolbar-title shrink class="text-h5 q-pl-none">
              {{ user?.asukoht }}: {{ $route.meta.title }}
            </q-toolbar-title>
          </div>
          <div class="col text-right">
            <q-btn
              outline
              rounded
              no-caps
              padding="none"
              :to="{ name: 'kasutajaPage', params: { id: user?.id } }"
            >
              <!-- <div v-if="email" class="row items-center"> -->

              <q-avatar v-if="user?.pilt" size="30px" class="q-ma-xs"
                ><q-img
                  spinner-color="white"
                  ratio="1"
                  loading="eager"
                  :src="`/api/kasutaja/pics/${user?.pilt}`"
              /></q-avatar>
              <q-avatar
                v-else
                size="30px"
                color="grey"
                text-color="white"
                icon="account_circle"
                class="q-ma-xs"
              />
              <!-- </div> -->
              <!-- <q-menu content-class="bg-blue-grey-5 text-white">
                <q-list>
                  <q-item clickable v-close-popup>
                    <q-item-section>{{ email }}</q-item-section>
                    <q-item-section avatar>
                      <q-icon color="blue-grey-5" name="person"></q-icon>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="logiValja">
                    <q-item-section>Logi välja</q-item-section>
                    <q-item-section avatar>
                      <q-icon name="exit_to_app"></q-icon>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu> -->
            </q-btn>
          </div>
        </div>
        <!--     -->
        <!-- <div>Quasar v{{ $q.version }}</div> -->
      </q-toolbar>
    </q-header>

    <q-pull-to-refresh @refresh="refresh">
      <div class="row justify-center">
        <div class="col-xs-12 col-lg-3">
          <tootmine-list />
          <!--Kuna kasutame Sticky, siis peab olema kõige lõpus-->
          <aktiivsed-riba />
        </div>
      </div>
    </q-pull-to-refresh>
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
const { user } = storeToRefs(useAuthStore());

onMounted(() => {
  tootStore.getHetkelTool();
  //getAktiivsedRibaData();
});

async function refresh(done: () => void) {
  await tootStore.getHetkelTool();
  done();
}
</script>

<style lang="sass">
.test
  position: absolute
  left: 50%
  transform: translateX(-50%)
</style>
