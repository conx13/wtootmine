<template>
  <q-item
    clickable
    v-ripple
    :class="[
      new Date(viimatiVaatasid) < new Date(tootajaGrupp.START)
        ? `bg-yellow-1 q-pr-xs`
        : `bg-white q-pr-xs`,
    ]"
    @click="eimitTid(tootajaGrupp.TID)"
  >
    <q-item-section avatar>
      <div
        v-if="!tootajaGrupp.pilt"
        class="ring_text text-grey-7"
        style="border: 2px solid #bdbdbd"
      >
        {{ tootajaGrupp.PNIMI[0] }}{{ tootajaGrupp.ENIMI[0] }}
      </div>
      <img
        v-else
        class="ringpilt"
        style="border: 2px solid #bdbdbd"
        :src="`/api/pics/${tootajaGrupp.pilt}`"
      />
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-h5 text-weight-medium" style="font-size: 18px"
        >{{ tootajaGrupp.PNIMI }} {{ tootajaGrupp.ENIMI }}</q-item-label
      >
      <q-item-label style="font-size: 16px" class="text-primary">
        <div class="row">
          <div class="col">
            {{ tootajaGrupp.TOO }}
          </div>
          <div class="col-2">
            {{ date.formatDate(tootajaGrupp.START, 'HH:mm') }}
          </div>
        </div>
      </q-item-label>
      <q-item-label caption style="font-size: 14px">
        {{ tootajaGrupp.LEPNR }}
      </q-item-label>
    </q-item-section>
  </q-item>
  <q-separator inset="item" class="q-mr-sm" style="margin-left: 87px" />
  <!-- </q-card> -->
</template>

<script setup lang="ts">
import { date } from 'quasar';
import { gruppTootajad } from '../../models/tootmine/tootmineModels';
import { PropType } from 'vue';

const emit = defineEmits(['refresh', 'tid']);
// Paneme propsid paika
defineProps({
  viimatiVaatasid: { type: Number, required: true },
  tootajaGrupp: {
    type: Object as PropType<gruppTootajad>,
    required: true,
  },
});

// saadame tagasi TID ja avame töötja lehe
const eimitTid = (tid: number) => {
  emit('tid', tid);
};
// kui lükkame paremalt vasakule
/* async function onRight({ reset }: { reset: () => void }) {
  await tootajaStore.muudameLisameTootajaAega(
    props.tootajaGrupp.TID,
    props.tootajaGrupp.RID,
    props.tootajaGrupp.START
  );
  emit('refresh');
  return reset();
} */
</script>
