<template>
  <q-page style="padding-top: 120px">
    <q-pull-to-refresh @refresh="refresh">
      <tootmine-list />
      <!--Kuna kasutame Sticky, siis peab olema kõige lõpus-->
      <aktiivsed-riba @aktiiv="aktiiv" @mitteakt="mitteakt" />
    </q-pull-to-refresh>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Todo, Meta } from 'components/models';
import { useRouter } from 'vue-router';
import { useTootmineStore } from '../stores/tootmine/tootmine-store';
import TootmineList from '../components/tootmine/TootmineList.vue';
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

  console.log(revresh, 'REFRESH...');
}

const todos = ref<Todo[]>([
  {
    id: 1,
    content: 'Elemendiliin',
    kokku: 32,
  },
  {
    id: 2,
    content: 'Montaaz',
    kokku: 12,
  },
  {
    id: 3,
    content: 'Puiduliin',
    kokku: 10,
  },
  {
    id: 4,
    content: 'Moodulihall',
    kokku: 67,
  },
  {
    id: 5,
    content: 'ct5',
    kokku: 15,
  },
  {
    id: 6,
    content: 'Puiduliin',
    kokku: 10,
  },
  {
    id: 7,
    content: 'Moodulihall',
    kokku: 67,
  },
  {
    id: 8,
    content: 'ct5',
    kokku: 15,
  },
  {
    id: 9,
    content: 'Niisama',
    kokku: 1,
  },
]);
const meta = ref<Meta>({
  totalCount: 12000,
});
/* setup() {
    const todos = ref<Todo[]>([
      {
        id: 1,
        content: 'Elemendiliin',
        kokku: 32,
      },
      {
        id: 2,
        content: 'Montaaz',
        kokku: 12,
      },
      {
        id: 3,
        content: 'Puiduliin',
        kokku: 10,
      },
      {
        id: 4,
        content: 'Moodulihall',
        kokku: 67,
      },
      {
        id: 5,
        content: 'ct5',
        kokku: 15,
      },
      {
        id: 6,
        content: 'Puiduliin',
        kokku: 10,
      },
      {
        id: 7,
        content: 'Moodulihall',
        kokku: 67,
      },
      {
        id: 8,
        content: 'ct5',
        kokku: 15,
      },
    ]);
    const meta = ref<Meta>({
      totalCount: 12000,
    });
    return { todos, meta };
  }, */
</script>
