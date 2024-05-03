<template>
  <div class="col q-px-sm q-pt-sm">
    <q-card
      class="q-mt-xs"
      flat
      style="
        border-radius: 20px;
        border-color: blue;
        border-style: solid;
        border-width: 1px;
      "
    >
      <q-card-section class="q-py-none">
        <div class="row items-center">
          <div class="col-3 text-subtitle2 text-grey-5" style="font-size: 12px">
            Lep nr:
          </div>
          <div
            class="col text-subtitle2 text-grey-5 text-right"
            style="font-size: 12px"
          >
            Töö grupp:
          </div>
        </div>
        <div class="row items-center">
          <div class="col-3 text-caption text-negative" style="font-size: 18px">
            {{ lepnr }}
          </div>
          <div class="col text-subtitle2 text-grey-7 text-right">
            {{ gnimi }}
          </div>
        </div>
        <div
          class="row justify-center text-weight-light text-primary"
          style="font-size: 1.5rem"
        >
          {{ too }}
        </div>
        <div v-if="onToos" class="row justify-center text-negative">
          Pole veel töösse võetud!
        </div>
        <q-tabs
          v-else
          v-model="aktiivneTab"
          dense
          class="text-grey-8"
          active-color="primary"
          indicator-color="primary"
          no-caps
          narrow-indicator
          inline-label
        >
          <q-tab name="kes" label="Kes tegid" icon="groups" />
          <q-tab
            name="millal"
            label="Millal tehti"
            icon="sym_o_calendar_clock"
          />
        </q-tabs>
      </q-card-section>
      <!-- Kui on töö, aga tulemust ei ole -->
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps({
  lepnr: { type: String, required: true },
  gnimi: { type: String, required: true },
  too: { type: String, required: true },
  onToos: { type: Boolean, required: true },
});

const aktiivneTab = defineModel({ default: 'kes' });
</script>
