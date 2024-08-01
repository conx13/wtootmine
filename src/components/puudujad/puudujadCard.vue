<template>
  <q-item
    clickable
    v-ripple:negative
    class="q-pr-xs"
    @click="tootajaBaasist(user.TID)"
  >
    <q-item-section avatar>
      <div
        v-if="!user.pilt"
        class="ring_text text-negative"
        style="border: 2px solid #c10015"
      >
        {{ user.PNIMI.charAt(0) }}{{ user.ENIMI.charAt(0) }}
      </div>
      <img
        v-else
        class="ringpilt"
        style="border: 2px solid #c10015"
        :src="`/api/pics/${user.pilt}`"
      />
    </q-item-section>
    <q-item-section>
      <q-item-label class="text-h5 text-weight-medium" style="font-size: 18px"
        >{{ user.PNIMI }} {{ user.ENIMI }}</q-item-label
      >
      <q-item-label caption>
        {{ user.toogrupp_nimi }}
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-btn
        color="negative"
        flat
        round
        dense
        icon="
chevron_right"
      ></q-btn>
    </q-item-section>
  </q-item>
  <q-separator inset="item" style="margin-left: 87px" color="red-2" />
</template>

<script setup lang="ts">
import { Tootaja } from '../../models/models';
import { useTootajaStore } from '../../stores/tootmine/tootaja-store';
import { useRouter } from 'vue-router';

const tootajaStore = useTootajaStore();
const router = useRouter();
defineProps<{ user: Tootaja }>();

function tootajaBaasist(tid: number) {
  tootajaStore.getTootaja(Number(tid));
  setTimeout(() => {
    router.push({ name: 'm_tootajaPage', params: { id: tid } });
  }, 150);
}
</script>
<style lang="sass"></style>
