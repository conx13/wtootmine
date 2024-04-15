<template>
  <q-toolbar>
    <div class="col">
      <q-form @submit="otsiEnter()">
        <q-input
          class="bg-white"
          ref="otsi_input"
          rounded
          outlined
          type="number"
          enterKeyHint="search"
          placeholder="Otsi töökoodi:"
          input-style="font-size: 20px"
          v-model="otsiTextRida"
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
    </div>
  </q-toolbar>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = defineProps({
  otsiText: String,
});
const emit = defineEmits(['update:otsiTex']);

//määrame input välja
const otsi_input = ref();
//tekitame sisese model-i
const otsiTextRida = ref('');

//Jälge, et kui kood muutub, siis muudame ka otsingu texti
watch(
  computed(() => props.otsiText),
  (newValue) => {
    if (newValue?.length) {
      otsiTextRida.value = newValue; // Access and assign the current value
    }
  }
);
//kustutame rea ja alustame uuesti
const kustutaOtsing = () => {
  otsiTextRida.value = '';
  otsi_input.value.focus();
};
//kui vajutasime enterit, siis viime texti edasi
const otsiEnter = () => {
  otsi_input.value.blur();
  emit('update:otsiTex', otsiTextRida.value);
};
// @click.stop.prevent="otsiText = ''"
</script>
