<template>
  <q-page style="padding-top: 120px">
    <tootmine-component
      title="Pärnu tootmine"
      active
      :todos="todos"
      :meta="meta"
    ></tootmine-component>
    <!--Kuna kasutame Sticky, siis peab olema kõige lõpus-->
    <aktiivsed-riba
      @aktiiv="aktiiv"
      @mitteakt="mitteakt"
      :aktiivsed="aktiivsed"
      :mitteaktiivsed="mitteaktiivsed"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Todo, Meta } from 'components/models';
import { useRouter } from 'vue-router';
import { useTootmineStore } from '../stores/tootmine/tootmine-store';
import TootmineComponent from 'components/tootmine/TootmineComponent.vue';
import AktiivsedRiba from 'components/tootmine/AktiivsedRiba.vue';

async function getPuudujad() {
  await tootStore.getPuudujad();
}
async function getAktiivsed() {
  await tootStore.getAktiivsed();
}
const router = useRouter();
const tootStore = useTootmineStore();

const aktiivsed = computed(() => tootStore.aktiivsed);
const mitteaktiivsed = computed(() => tootStore.puudujad);

onMounted(() => {
  getPuudujad();
  getAktiivsed();
});

function mitteakt() {
  router.push({ name: 'puudujadPage' });
  return;
}
function aktiiv() {
  router.push({ name: 'tootajadPage' });
  return;
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
