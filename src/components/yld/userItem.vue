<template>
  <q-item clickable v-ripple class="bg-white" @click="vajutasNuppu(`${tid}`)">
    <q-item-section avatar>
      <div
        v-if="!pilt"
        class="vaike_ring_text text-grey-7"
        :style="{ border: `1px solid ${ringiVarv}` }"
      >
        {{ pnimi.charAt(0) }}{{ enimi.charAt(0) }}
      </div>
      <img
        v-else
        class="vaike_ringpilt shadow-2"
        :style="{ border: `1px solid ${ringiVarv}` }"
        :src="`/api/pics/${pilt}`"
      />
    </q-item-section>
    <q-item-section>
      <q-item-label class="text-h5 text-weight-medium" style="font-size: 18px"
        >{{ pnimi }} {{ enimi }}</q-item-label
      >
      <q-item-label caption>
        {{ toogrupp_nimi }}
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-icon color="primary" name="info_outline" />
    </q-item-section>
  </q-item>
  <q-separator inset="item" :color="jooneVarv" />
</template>

<script setup lang="ts">
const emit = defineEmits(['vajutas-nuppu']);

/* -------------------------- Paneme propsid paika -------------------------- */
defineProps({
  tid: { type: Number, required: true },
  pilt: { type: String, required: false },
  pnimi: { type: String, required: true },
  enimi: { type: String, required: true },
  toogrupp_nimi: { type: String, required: true },
  ringiVarv: { type: String, required: false, default: '#bdbdbd' },
  jooneVarv: { type: String, required: false, default: 'grey-4' },
});

/* ---------------------------- Saadame TID edasi --------------------------- */
function vajutasNuppu(tid: string) {
  emit('vajutas-nuppu', tid);
}
</script>
