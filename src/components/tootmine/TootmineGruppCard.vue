<template>
  <q-card class="my-card bg-grey-1" flat bordered>
    <q-item>
      <q-item-section avatar>
        <q-avatar
          v-if="!tootajaGrupp.pilt"
          size="xd"
          color="grey-5"
          text-color="white"
        >
          {{ tahed }}</q-avatar
        >
        <q-avatar v-if="tootajaGrupp.pilt" size="xl">
          <q-img :src="`/api/pics/${tootajaGrupp.pilt}`" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-h5" style="font-size: 18px">{{
          nimi
        }}</q-item-label>
        <q-item-label style="font-size: 16px" class="text-primary">
          <div class="row">
            <div class="col">
              {{ tootajaGrupp.TOO }}
            </div>
            <div class="col-2">
              {{ algus }}
            </div>
          </div>
        </q-item-label>
        <q-item-label caption style="font-size: 16px">
          {{ tootajaGrupp.LEPNR }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script setup lang="ts">
import { computed, defineComponent } from 'vue';
import { gruppTootajad } from '../../models/tootmine/tootmineModels';
import { date } from 'quasar';
const props = defineProps<{ tootajaGrupp: gruppTootajad }>();

const nimi = computed(
  () => props.tootajaGrupp.PNIMI + ' ' + props.tootajaGrupp.ENIMI
);
const tahed = computed(
  () => props.tootajaGrupp.PNIMI.charAt(0) + props.tootajaGrupp.ENIMI.charAt(0)
);
const algus = date.formatDate(props.tootajaGrupp.START, 'HH:mm');
</script>
