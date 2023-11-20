<template>
  <q-page padding>
    <pealkiri
      v-bind:pealkiri="$route.params.grupp as string"
      :text-varv="pealkirjaVärv"
    />

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
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTootmineStore } from '../../stores/tootmine/tootmine-store';
import { storeToRefs } from 'pinia';

import pealkiri from '../../components/yld/headerComp.vue';
import TootmineGruppCard from '../../components/tootmine/TootmineGruppCard.vue';

const route = useRoute();
const router = useRouter();
const tootStore = useTootmineStore();
const { gruppTootajad, loading, gruppTood } = storeToRefs(tootStore);
const tab = ref('tab1');
const pealkirjaVärv = 'positive';

onMounted(() => tootStore.getGrupp(String(route.params.grupp)));
function tagasi() {
  router.go(-1);
}
</script>
