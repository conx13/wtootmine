<template>
  <q-item
    clickable
    v-ripple
    class="q-my-sm"
    @click="tootajaBaasist(user.TID)"
    :to="{ name: 'tootajaPage', params: { id: user.TID } }"
    style="
      border-radius: 20px;
      border-color: lightpink;
      border-style: solid;
      border-width: 1px;
    "
  >
    <q-item-section avatar>
      <q-avatar
        v-if="!user.pilt"
        size="xl"
        color="red-2"
        text-color="white"
        class="q-pa-xs"
      >
        {{ user.PNIMI.charAt(0) }}{{ user.ENIMI.charAt(0) }}</q-avatar
      >
      <q-avatar
        v-if="user.pilt"
        size="xl"
        color="deep-orange-2"
        class="q-pa-xs"
      >
        <q-img ratio="1" loading="eager" :src="`/api/pics/${user.pilt}`" />
      </q-avatar>
    </q-item-section>
    <q-item-section>
      <q-item-label class="text-h5" style="font-size: 18px"
        >{{ user.PNIMI }} {{ user.ENIMI }}</q-item-label
      >
      <q-item-label caption>
        {{ user.toogrupp_nimi }}
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
</template>

<script setup lang="ts">
import { Tootaja } from '../../models/models';
import { useTootajaStore } from 'src/stores/tootmine/tootaja-store';

const tootajaStore = useTootajaStore();

defineProps<{ user: Tootaja }>();

function tootajaBaasist(tid: number) {
  tootajaStore.getTootaja(Number(tid));
}
/* function tootajaInfo(tid: number) {
  console.log('puuduja click');

  router.push({ name: 'tootajaPage', params: { id: tid } });
} */
</script>
