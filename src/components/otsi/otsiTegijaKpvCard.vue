<template>
  <q-card
    flat
    bordered
    class="q-mt-sm"
    style="
      border-radius: 20px;
      border-color: lightblue;
      border-style: solid;
      border-width: 1px;
    "
  >
    <q-card-section class="q-px-xs q-pt-none q-pb-xs">
      <q-item-label
        header
        class="text-center q-pb-none q-pt-xs text-positive"
        style="font-size: 1rem"
      >
        {{ kpv }}
      </q-item-label>
      <q-item
        class="q-pa-xs"
        v-for="leitudNimed in tegijad"
        :key="leitudNimed.TID"
      >
        <q-item-section avatar>
          <div
            v-if="!leitudNimed.pilt"
            class="vaike_ring_text text-grey-7"
            style="border: 1px solid #bdbdbd"
          >
            {{ leitudNimed.tahed }}
          </div>
          <img
            v-else
            class="vaike_ringpilt shadow-2"
            :src="`/api/pics/${leitudNimed.pilt}`"
          />
        </q-item-section>
        <q-item-section
          ><q-item-label
            class="text-h5 text-weight-regular"
            style="font-size: 18px"
            >{{ leitudNimed.nimi }}</q-item-label
          >
        </q-item-section>
        <q-item-section side>
          <q-item-label caption
            >{{ leitudNimed.start }}-{{ leitudNimed.stop }}
          </q-item-label>
        </q-item-section>
        <!-- Siia tuleb expansion item -->
      </q-item>
      <!-- <q-separator inset="item" /> -->
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { LeitudTegijad } from 'src/models/otsi/otsiModels';
import { PropType } from 'vue';

defineProps({
  kpv: { type: String, required: true },
  tegijad: { type: Array as PropType<LeitudTegijad[]>, required: true },
});
</script>
