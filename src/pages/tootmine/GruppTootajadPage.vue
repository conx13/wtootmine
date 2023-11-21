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
    <q-toolbar>
      <div class="col">
        <q-tabs
          v-model="tab"
          dense
          align="justify"
          active-color="primary"
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
              class="row-inline q-ma-xs"
              v-for="item in gruppTootajad"
              :key="item.TID"
            >
              <tootmine-grupp-card :tootaja-grupp="item" />
            </div>
          </q-tab-panel>
          <q-tab-panel name="tood" class="no-padding">
            <div
              class="row-inline q-ma-xs"
              v-for="item in gruppTood"
              :key="item.JID"
            >
              <!--                    <div class="col-8 text-h5" style="font-size: 16px">
              {{ item.TOO }}
            </div>
            <div class="col">
              {{ item.LEPNR }}
            </div> -->
              <q-card flat bordered>
                <q-expansion-item class="" group="somegroup">
                  <template v-slot:header>
                    <q-item-section class="no-wrap">
                      <div class="row items-center">
                        <div
                          class="col-9 text-h6 text-primary"
                          style="font-size: 18px"
                        >
                          {{ item.TOO }}
                        </div>
                        <div class="col text-right text-accent">
                          {{ item.LEPNR }}
                        </div>
                      </div>
                    </q-item-section>
                  </template>
                  <div class="row q-ml-xs q-mb-xs">
                    <q-chip>
                      <q-avatar>
                        <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                      </q-avatar>
                      Grimm A. 6:00
                    </q-chip>
                    <q-chip>
                      <q-avatar>
                        <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                      </q-avatar>
                      Grimm A. 6:00
                    </q-chip>
                    <q-chip>
                      <q-avatar>
                        <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                      </q-avatar>
                      Metsast A. 12:00
                    </q-chip>
                  </div>
                  <!-- <q-badge color="positive" floating rounded label="23006" /> -->
                </q-expansion-item>
              </q-card>
            </div>
          </q-tab-panel>
        </q-tab-panels>
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
const tab = ref('tootajad');

onMounted(() => tootStore.getGrupp(String(route.params.grupp)));
function tagasi() {
  router.go(-1);
}
</script>
<style lang="sass" scoped>
.overlapping
  border: 2px solid white
  position: absolute
</style>
