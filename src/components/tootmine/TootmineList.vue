<template>
  <div class="row-inline q-ma-xs" v-for="item in tanaList" :key="item.JRK">
    <q-card class="bg-grey-1" flat bordered @click="gruppTootajad(item.GGRUPP)">
      <q-item>
        <q-item-section avatar class="">
          <q-circular-progress
            :value="item.Kokku"
            show-value
            :min="0"
            :max="aktiivsed.tulem"
            size="40px"
            :thickness="0.1"
            font-size="0.5em"
            color="primary"
            center-color="white"
            track-color="grey-5"
            class="text-primary shadow"
          />
          <!--             <q-avatar color="primary" text-color="white">
                {{ item.Kokku }}
              </q-avatar> -->
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <div v-show="item.JRK == 1" class="text-h5 text-negative">
              {{ item.GGRUPP }}
            </div>
            <div v-show="item.JRK != 1" class="text-h5 text-grey-9">
              {{ item.GGRUPP }}
            </div>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useTootmineStore } from '../../stores/tootmine/tootmine-store';

const tootStore = useTootmineStore();
const { aktiivsed, tanaList, tanaKokku } = storeToRefs(tootStore);
const router = useRouter();

function gruppTootajad(ggrupp: string) {
  router.push({ name: 'tootmineGrupp', params: { grupp: ggrupp } });
}
</script>
