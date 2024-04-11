<template>
  <q-header class="bg-white text-primary" reveal>
    <q-toolbar class="q-py-sm">
      <q-btn flat round icon="arrow_back_ios" @click="$router.go(-1)" />
      <q-toolbar-title class="absolute-center q-pa-none" :class="`${klass}`">{{
        pealkiri
      }}</q-toolbar-title>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
defineProps<{
  pealkiri: string;
  klass?: string;
}>();
</script>
