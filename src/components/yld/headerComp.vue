<template>
  <q-header bordered class="bg-white text-primary" reveal>
    <q-toolbar>
      <div class="row full-width">
        <div class="col-2">
          <q-btn flat round dense icon="arrow_back_ios" @click="tagasi" />
        </div>
        <div class="col-8">
          <div :class="`text-center text-h5 text-${textVarv}`">
            {{ pealkiri }}
          </div>
        </div>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
defineProps<{ pealkiri: string; textVarv: string }>();

function tagasi() {
  router.go(-1);
}
</script>
