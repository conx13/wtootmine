<template>
  <q-expansion-item
    class="bg-grey-2 overflow-hidden q-pa-xs"
    header-class="text-h5"
    header-style="font-size: 18px"
    :label="too"
    :caption="lepnr"
    group="somegroup"
    expand-separator
    style="border-radius: 20px"
    @show="filterToo(jid)"
  >
    <div class="row q-ml-xs q-mb-xs">
      <q-chip v-for="item in tegijaGrupp" :key="item.TID">
        <q-avatar v-show="item.pilt">
          <q-img ratio="1" loading="lazy" :src="`/api/pics/${item.pilt}`" />
        </q-avatar>
        {{ item.PNIMI }}.{{ item.ENIMI[0] }} :
        {{ date.formatDate(item.START, 'HH:mm') }}
      </q-chip>
    </div>
    <!-- <q-badge color="positive" floating rounded label="23006" /> -->
  </q-expansion-item>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { date } from 'quasar';
import { useTootmineStore } from '../../stores/tootmine/tootmine-store';

const tootStore = useTootmineStore();

//Paneme propsid paika
defineProps<{
  jid: number;
  too: string;
  lepnr: string;
}>();

const tegijaGrupp = ref();

// Filtreerime töö tegijad
async function filterToo(jid: number) {
  tegijaGrupp.value = await tootStore.getTooTegijad(jid);
}
</script>
<style lang="sass">
.text-caption
  font-size:0.8rem
</style>
