<template>
  <q-card
    flat
    bordered
    class="q-mt-sm q-pt-xs"
    style="
      border-radius: 20px;
      border-color: lightblue;
      border-style: solid;
      border-width: 1px;
    "
  >
    <q-card-section
      v-for="leitud in tegijad"
      :key="leitud.TID"
      class="q-px-xs q-pt-none q-pb-xs"
    >
      <q-item class="q-pa-xs">
        <q-item-section avatar>
          <div
            v-if="!leitud.pilt"
            class="vaike_ring_text text-grey-7"
            style="border: 1px solid #bdbdbd"
          >
            {{ leitud.tahed }}
          </div>
          <img
            v-else
            class="vaike_ringpilt shadow-2"
            :src="`/api/pics/${leitud.pilt}`"
          />
        </q-item-section>
        <q-item-section
          ><q-item-label
            class="text-h5 text-weight-regular"
            style="font-size: 18px"
            >{{ leitud.nimi }}</q-item-label
          >
        </q-item-section>
      </q-item>
      <!-- <q-separator inset="item" /> -->
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { LeitudTegijad } from 'src/models/otsi/otsiModels';
import { PropType } from 'vue';
defineProps({
  tegijad: { type: Array as PropType<LeitudTegijad[]>, required: true },
});
</script>
