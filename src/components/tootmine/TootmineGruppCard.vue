<template>
  <div>
    <!-- <q-card class="my-card bg-grey-1" flat bordered> -->
    <!-- @right="onRight" -->
    <q-slide-item class="" right-color="warning" :reset="test" @right="onRight">
      <!-- style="border-radius: 20px" -->
      <template v-slot:right>
        <div class="row full-width tems-center">
          <div class="">
            Töö ootel<q-icon size="xl" right name="pause_circle" />
          </div>
        </div>
      </template>
      <!--       style="
          border-radius: 20px;
          border-color: lightblue;
          border-style: solid;
          border-width: 1px;
        " -->
      <q-item
        clickable
        v-ripple
        :class="[
          new Date(viimatiVaatasid) < new Date(tootajaGrupp.START)
            ? `bg-yellow-1 q-pr-xs`
            : `bg-white q-pr-xs`,
        ]"
        @click="tootajaBaasist(tootajaGrupp.TID)"
      >
        <!-- :to="{ name: 'tootajaPage', params: { id: tootajaGrupp.TID } }" -->
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
            class="vaike_ringpilt"
            style="border: 2px solid #bdbdbd"
            :src="`/api/pics/${tootajaGrupp.pilt}`"
          />
        </q-item-section>

        <q-item-section>
          <q-item-label
            class="text-h5 text-weight-medium"
            style="font-size: 18px"
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
    </q-slide-item>
    <q-separator inset="item" class="q-mr-sm" style="margin-left: 87px" />
    <!-- </q-card> -->
  </div>
</template>

<script setup lang="ts">
import { date } from 'quasar';
import { gruppTootajad } from '../../models/tootmine/tootmineModels';
import { useTootajaStore } from 'src/stores/tootmine/tootaja-store';
import { useRouter } from 'vue-router';
import { PropType, ref } from 'vue';

const router = useRouter();
const tootajaStore = useTootajaStore();
const test = ref(false);
const props = defineProps({
  viimatiVaatasid: { type: Number, required: true },
  tootajaGrupp: {
    type: Object as PropType<gruppTootajad>,
    required: true,
  },
});
const emit = defineEmits(['refresh']);
//defineProps<{ tootajaGrupp: gruppTootajad; viimatiVaatasid: number }>();

// kui lükkame paremalt vasakule
async function onRight({ reset }: { reset: () => void }) {
  await tootajaStore.muudameLisameTootajaAega(
    props.tootajaGrupp.TID,
    props.tootajaGrupp.RID,
    props.tootajaGrupp.START
  );
  emit('refresh');
  return reset();
}
// võtame töötaja baasist ja saadame töötaja lehele
function tootajaBaasist(tid: number) {
  tootajaStore.getTootaja(Number(tid));
  setTimeout(() => {
    router.push({
      name: 'tootajaPage',
      params: { id: props.tootajaGrupp.TID },
    });
  }, 150);
}
</script>
