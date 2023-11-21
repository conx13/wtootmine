<template>
  <q-card
    class="my-card bg-grey-1"
    flat
    bordered
    @click="tootajaInfo(user.TID)"
  >
    <q-item>
      <q-item-section avatar>
        <q-avatar
          v-if="!user.pilt"
          size="xl"
          color="negative"
          text-color="white"
        >
          {{ user.PNIMI.charAt(0) }}{{ user.ENIMI.charAt(0) }}</q-avatar
        >
        <q-avatar v-if="user.pilt" size="xl">
          <q-img ratio="1" loading="lazy" :src="`/api/pics/${user.pilt}`" />
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
    </q-item>
  </q-card>
</template>

<script setup lang="ts">
import { Tootaja } from '../../models/models';
import { useRouter } from 'vue-router';

defineProps<{ user: Tootaja }>();
const router = useRouter();

function tootajaInfo(tid: number) {
  router.push({ name: 'tootajaPage', params: { id: tid } });
}
</script>
