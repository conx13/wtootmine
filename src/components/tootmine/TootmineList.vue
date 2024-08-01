<template>
  <div class="row-inline q-ma-sm" v-for="item in tanaList" :key="item.JRK">
    <!-- <q-card class="bg-grey-1" flat bordered @click="gruppTootajad(item.GGRUPP)"> -->
    <q-item
      class="q-pa-sm q-py-sd bg-white"
      style="
        border-radius: 30px;
        border-color: lightblue;
        border-style: solid;
        border-width: 1px;
      "
      clickable
      v-ripple
      @click="getTegijad(item.GGRUPP)"
      :to="{ name: 'm_tootmineGrupp', params: { grupp: item.GGRUPP } }"
    >
      <q-item-section avatar class="">
        <q-circular-progress
          :value="item.Kokku"
          show-value
          :min="0"
          :max="aktiivsed.tulem"
          size="50px"
          :thickness="0.1"
          font-size="0.5em"
          color="primary"
          center-color="white"
          track-color="blue-grey-2  "
          class="text-primary shadow"
        />
        <!--             <q-avatar color="primary" text-color="white">
                {{ item.Kokku }}
              </q-avatar> -->
      </q-item-section>
      <q-item-section>
        <q-item-label>
          <div
            class="text-h5"
            :class="[item.JRK != 1 ? `text-grey-9` : `text-negative`]"
          >
            {{ item.GGRUPP }}
          </div>

          <!--             TODO Sünnipäevad
            <q-badge outline rounded color="orange" label="1" align="top"
              ><q-icon name="cake"
            /></q-badge> -->
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-btn
          flat
          round
          dense
          icon="
chevron_right"
        ></q-btn>
      </q-item-section>
    </q-item>
    <!-- </q-card> -->
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useTootmineStore } from '../../stores/tootmine/tootmine-store';

const tootStore = useTootmineStore();
const { aktiivsed, tanaList } = storeToRefs(tootStore);

//Täidame store grupi tegijatega
function getTegijad(grupp: string) {
  tootStore.getGrupp(String(grupp));
}
</script>
