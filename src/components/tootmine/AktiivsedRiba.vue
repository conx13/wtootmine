<template>
  <q-page-sticky
    expand
    position="top"
    class=""
    style="
      background-color: rgba(255, 255, 255, 0.8);
      -webkit-backdrop-filter: blur(20px);
      backdrop-filter: blur(20px);
    "
  >
    <div
      v-ripple:positive
      class="col q-pt-sm q-pr-lg"
      @click="$router.push({ name: 'tootajadPage' })"
    >
      <div class="text-h6 text-right text-grey-7">Aktiivsed:</div>
      <div class="text-right">
        <q-circular-progress
          :value="aktiivsed.tulem"
          show-value
          :min="0"
          :max="tanaKokku"
          size="60px"
          :thickness="0.1"
          font-size="0.5em"
          color="secondary"
          track-color="grey-2"
          class="q-my-sm text-secondary text"
        />
      </div>
    </div>
    <q-separator vertical inset color="light-blue-2" />
    <div
      v-ripple:negative
      class="col q-pt-sm q-pl-lg"
      @click="$router.push({ name: 'puudujadPage' })"
    >
      <div class="text-h6 text-left text-grey-7">Mitteaktiivsed:</div>
      <q-circular-progress
        :value="puudujad.tulem"
        show-value
        :min="0"
        :max="tanaKokku"
        size="60px"
        :thickness="0.1"
        font-size="0.5em"
        color="negative"
        track-color="grey-2"
        class="q-my-sm text-negative text"
      />
    </div>

    <div class="col-12">
      <q-separator inset color="light-blue-2" />
    </div>

    <!-- <q-separator inset color="light-blue-2" /> -->
  </q-page-sticky>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTootmineStore } from '../../stores/tootmine/tootmine-store';
const tootStore = useTootmineStore();
const { aktiivsed, puudujad, tanaKokku } = storeToRefs(tootStore);
</script>
<style lang="sass">
.joonega
  border-bottom : 1px solid #b3e5fc
</style>
