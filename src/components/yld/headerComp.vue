<template>
  <q-header bordered class="bg-white text-primary" reveal>
    <q-toolbar class="q-py-sm">
      <q-btn flat round icon="arrow_back_ios" @click="$router.go(-1)" />
      <q-toolbar-title :class="`text-h5 text-${textVarv}`">{{
        pealkiri
      }}</q-toolbar-title>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
defineProps<{ pealkiri: string; textVarv: string }>();
</script>
