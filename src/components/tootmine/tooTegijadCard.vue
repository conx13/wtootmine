<template>
  <q-expansion-item
    class="q-ma-sm overflow-hidden"
    :class="[
      new Date(viimatiVaatasid) < new Date(start) ? `bg-yellow-2` : `bg-grey-2`,
    ]"
    group="somegroup"
    style="border-radius: 20px"
    @show="filterToo(jid)"
  >
    <template v-slot:header>
      <q-item-section>
        <q-item-label style="font-size: 18px">{{ too }}</q-item-label>
        <q-item-label caption>{{ lepnr }}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-item-label caption class="text-primary"
          >{{ date.formatDate(start, 'HH:mm') }}
        </q-item-label>
      </q-item-section>
    </template>
    <div class="row q-ml-xs q-mb-xs">
      <q-chip v-for="item in tegijaGrupp" :key="item.TID">
        <q-avatar v-show="item.pilt">
          <q-img ratio="1" loading="lazy" :src="`/api/pics/${item.pilt}`" />
        </q-avatar>
        {{ item.PNIMI }}.{{ item.ENIMI[0] }}
      </q-chip>
    </div>
    <!-- <q-badge color="positive" floating rounded label="23006" /> -->
  </q-expansion-item>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { date } from 'quasar';
import { useTootmineStore } from '../../stores/tootmine/tootmine-store';
import { storeToRefs } from 'pinia';

const tootStore = useTootmineStore();
//const { gruppTood, uuedTood, viimatiVaatasid } = storeToRefs(tootStore);

//Paneme propsid paika
defineProps<{
  jid: number;
  too: string;
  lepnr: string;
  start: string;
  viimatiVaatasid: number;
}>();

const tegijaGrupp = ref();

// Filtreerime töö tegijad
async function filterToo(jid: number) {
  tegijaGrupp.value = await tootStore.getTooTegijad(jid);
}
</script>
<style lang="sass">
.text-caption
  font-size:14px
</style>
