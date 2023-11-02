<template>
  <q-page padding>
    <div>user {{ $route.params.id }}</div>
    <q-btn
      color="white"
      text-color="black"
      label="Standard"
      @click="kasutaja"
    />
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
function kasutaja() {
  console.log(router, 'kasutaja');
}
</script>
