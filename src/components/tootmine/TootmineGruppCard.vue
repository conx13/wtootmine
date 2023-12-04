<template>
  <!-- <q-card class="my-card bg-grey-1" flat bordered> -->
  <q-slide-item
    class="q-my-xs"
    left-color="warning"
    right-color="negative"
    @left="onLeft"
    @right="onRight"
  >
    <template v-slot:left>
      <div class="row items-center">
        <q-icon left name="pause_circle" /> Töö ootel
      </div>
    </template>
    <template v-slot:right>
      <div class="row items-center">
        Töö lõpp <q-icon right name="stop_circle" />
      </div>
    </template>
    <q-item
      class="bg-grey-2"
      style="border-radius: 20px"
      :class="[
        new Date(viimatiVaatasid) < new Date(tootajaGrupp.START)
          ? `bg-yellow-2`
          : `bg-grey-2`,
      ]"
    >
      <q-item-section avatar>
        <q-avatar
          v-if="!tootajaGrupp.pilt"
          size="xd"
          color="grey-5"
          text-color="white"
        >
          {{ tootajaGrupp.PNIMI[0] }}{{ tootajaGrupp.ENIMI[0] }}</q-avatar
        >
        <q-avatar v-if="tootajaGrupp.pilt" size="xl">
          <q-img
            ratio="1"
            loading="eager"
            :src="`/api/pics/${tootajaGrupp.pilt}`"
          />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-h5" style="font-size: 18px"
          >{{ tootajaGrupp.PNIMI }} {{ tootajaGrupp.ENIMI }}</q-item-label
        >
        <q-item-label style="font-size: 16px" class="text-primary">
          <div class="row">
            <div class="col">
              {{ tootajaGrupp.TOO }}
            </div>
            <div class="col-2">
              {{ date.formatDate(tootajaGrupp.START, 'HH:mm') }}
            </div>
          </div>
        </q-item-label>
        <q-item-label caption style="font-size: 14px">
          {{ tootajaGrupp.LEPNR }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-slide-item>
  <!-- </q-card> -->
</template>

<script setup lang="ts">
import { date } from 'quasar';
import { gruppTootajad } from '../../models/tootmine/tootmineModels';

defineProps<{ tootajaGrupp: gruppTootajad; viimatiVaatasid: number }>();
function onLeft({ reset }: { reset: () => void }) {
  reset();
}
function onRight({ reset }: { reset: () => void }) {
  return reset();
}
</script>
