<template>
  <q-form @submit="otsiEnter()">
    <q-input
      class="bg-white"
      ref="otsi_input"
      dense
      rounded
      outlined
      type="number"
      enterKeyHint="search"
      placeholder="Otsi töökoodi:"
      input-style="font-size: 18px"
      v-model="otsiText"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template v-if="otsiText" v-slot:append>
        <q-icon
          size="30px"
          name="close"
          @click.stop.prevent="kustutaOtsing"
        ></q-icon>
      </template>
    </q-input>
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const otsiText = defineModel<string>();
const emit = defineEmits(['enter']);

//määrame input välja
const otsi_input = ref();

//kustutame rea ja alustame uuesti
const kustutaOtsing = () => {
  otsiText.value = '';
  otsi_input.value.focus();
};

//kui vajutasime enterit, siis viime texti tagasi
const otsiEnter = () => {
  otsi_input.value.blur();
  emit('enter', otsiText.value);
};
// @click.stop.prevent="otsiText = ''"
</script>
