<template>
  <div class="row-inline q-ma-xs">
    <q-card class="bg-grey-1" flat>
      <q-item v-for="item in tanaList" :key="item.JRK">
        <q-item-section avatar>
          <q-circular-progress
            :value="item.Kokku"
            show-value
            :min="0"
            :max="aktiivsed.tulem"
            size="40px"
            :thickness="0.1"
            font-size="0.5em"
            color="primary"
            track-color="grey-2"
            class="q-ma-sm text-primary"
          />
          <!--             <q-avatar color="primary" text-color="white">
                {{ item.Kokku }}
              </q-avatar> -->
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <div class="text-h5 text-grey-9">
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
import { useTootmineStore } from '../../stores/tootmine/tootmine-store';

const tootStore = useTootmineStore();
const { aktiivsed, tanaList, tanaKokku } = storeToRefs(tootStore);
</script>
