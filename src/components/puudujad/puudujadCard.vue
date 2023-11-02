<template>
  <q-intersection transition="scale" once>
    <q-card class="my-card bg-grey-1" flat bordered>
      <q-item>
        <q-item-section avatar>
          <q-avatar v-if="!user.pilt" size="xl" color="red" text-color="white">
            {{ user.pnimi.charAt(0) }}{{ user.enimi.charAt(0) }}</q-avatar
          >
          <q-avatar v-if="user.pilt" size="xl">
            <img :src="`/api/pics/${user.pilt}`" />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h6">{{ user.nimi }}</q-item-label>
          <q-item-label caption>
            {{ user.toogruppNimi }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-card>
  </q-intersection>
</template>

<script setup lang="ts">
import { User } from '../models';

defineProps<{ user: User }>();
</script>
