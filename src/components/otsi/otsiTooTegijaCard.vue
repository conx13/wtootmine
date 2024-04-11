<template>
  <q-card
    v-for="(tegijad, index) in groupedByKpv"
    :key="index"
    v-show="otsinguStaatus === '1'"
    flat
    bordered
    class="q-mt-md"
    style="
      border-radius: 20px;
      border-color: lightblue;
      border-style: solid;
      border-width: 1px;
    "
  >
    <q-card-section class="q-px-xs q-pt-none">
      <q-item-label
        header
        class="text-center q-pb-none text-positive"
        style="font-size: 1rem"
      >
        {{ index }}
      </q-item-label>
      <q-item v-for="leitudNimed in tegijad" :key="leitudNimed.TID">
        <q-item-section avatar>
          <div
            v-if="!leitudNimed.pilt"
            class="ring_text text-grey-7"
            :style="{ border: `2px solid #bdbdbd` }"
          >
            {{ leitudNimed.PNIMI[0] }}{{ leitudNimed.ENIMI[0] }}
          </div>
          <img
            v-else
            class="vaike_ringpilt"
            :style="{ border: `2px solid #bdbdbd` }"
            :src="`/api/pics/${leitudNimed.pilt}`"
          />
        </q-item-section>
        <q-item-section
          ><q-item-label
            class="text-h5 text-weight-regular"
            style="font-size: 18px"
            >{{ leitudNimed.PNIMI }} {{ leitudNimed.ENIMI }}</q-item-label
          >
        </q-item-section>
        <q-item-section side>
          <q-item-label caption>08:00-12:30</q-item-label>
        </q-item-section>
        <!-- Siia tuleb expansion item -->
      </q-item>
      <!-- <q-separator inset="item" /> -->
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts"></script>
