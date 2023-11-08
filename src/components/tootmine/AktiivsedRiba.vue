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
    <div class="col">
      <div class="q-pt-sm row q-gutter-md">
        <div v-ripple:positive class="col relative-postion">
          <div @click="vajutasAkt">
            <div class="text-h6 text-right text-grey-9">Aktiivsed:</div>
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
        </div>
        <q-separator vertical inset />
        <div v-ripple:negative class="col relative-position">
          <div @click="vajutasMitteAkt">
            <div class="text-h6 text-left text-grey-9">Mitteaktiivsed:</div>
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
        </div>
      </div>
      <q-separator horizontal inset />
    </div>
  </q-page-sticky>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTootmineStore } from '../../stores/tootmine/tootmine-store';
const tootStore = useTootmineStore();
const { aktiivsed, puudujad, tanaKokku } = storeToRefs(tootStore);

// Sätime paika emit-si (tagasi funktsioon)
const emit = defineEmits(['mitteakt', 'aktiiv']);

// const mitteaktiivsed = ref(props.mitteaktiivsed);
// Kui vajutame mitte aktiivsete peale:
function vajutasMitteAkt() {
  emit('mitteakt');
}
// Kui vajutame aktiivsete peale:
function vajutasAkt() {
  emit('aktiiv');
}
</script>
