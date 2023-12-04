<template>
  <q-item
    clickable
    v-ripple
    :to="{ name: 'tootajaPage', params: { id: user.TID } }"
    class="bg-deep-orange-2 q-my-sm"
    style="border-radius: 30px"
  >
    <q-item-section avatar>
      <q-avatar v-if="!user.pilt" size="xl" color="negative" text-color="white">
        {{ user.PNIMI.charAt(0) }}{{ user.ENIMI.charAt(0) }}</q-avatar
      >
      <q-avatar v-if="user.pilt" size="xl">
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
import { useRouter } from 'vue-router';

defineProps<{ user: Tootaja }>();
const router = useRouter();

function tootajaInfo(tid: number) {
  console.log('puuduja click');

  router.push({ name: 'tootajaPage', params: { id: tid } });
}
</script>
