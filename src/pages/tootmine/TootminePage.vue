<template>
  <div class="row-inline q-ma-xs">
    <q-page style="padding-top: 120px">
      <q-pull-to-refresh @refresh="refresh">
        <div class="row">
          <div class="col-xs-12 col-lg-3">
            <tootmine-list />
          </div>
        </div>
        <!--Kuna kasutame Sticky, siis peab olema kõige lõpus-->
        <aktiivsed-riba @aktiiv="aktiiv" @mitteakt="mitteakt" />
      </q-pull-to-refresh>
    </q-page>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useTootmineStore } from '../../stores/tootmine/tootmine-store';
import TootmineList from '../../components/tootmine/TootmineList.vue';
import AktiivsedRiba from 'components/tootmine/AktiivsedRiba.vue';

async function getAktiivsedRibaData() {
  await tootStore.getHetkelTool();
}
const router = useRouter();
const tootStore = useTootmineStore();

onMounted(() => {
  getAktiivsedRibaData();
});

function mitteakt() {
  //puudujadStore.getPuudujad();
  router.push({ name: 'puudujadPage' });
  return;
}
function aktiiv() {
  router.push({ name: 'tootajadPage' });
  return;
}
const revresh = ref(0);
function refresh(done: () => void) {
  setTimeout(() => {
    revresh.value += 1;
    getAktiivsedRibaData();
    done();
  }, 1000);
}
</script>
