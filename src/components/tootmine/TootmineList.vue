<template>
  <div>
    <div class="row">
      <div class="col">
        <q-item class="q-my-sm" v-for="item in tanaList" :key="item.JRK">
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">
              {{ item.Kokku }}
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <div class="text-h5 text-grey-8">
                {{ item.GGRUPP }}
              </div>
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTootmineStore } from '../../stores/tootmine/tootmine-store';

const tootStore = useTootmineStore();
const { tanaList } = storeToRefs(tootStore);
</script>
