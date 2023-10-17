<template>
  <div>
    <div class="row">
      <div class="col">
        <q-item class="q-my-sm" v-for="todo in todos" :key="todo.id">
          <q-item-section avatar>
            <q-avatar @click="increment" color="primary" text-color="white">
              {{ todo.kokku }}
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <div class="text-h5 text-grey-8">
                {{ todo.content }}
              </div>
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </div>
    <!--     <p>Count: {{ todoCount }} / {{ meta.totalCount }}</p>
      <p>Active: {{ active ? 'yes' : 'no' }}</p>
      <p>Clicks on todos: {{ clickCount }}</p> -->
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Todo, Meta } from '../models';

const clickCount = ref(0);

function increment() {
  clickCount.value += 1;
}
const props = defineProps<{
  title: string;
  todos: Todo[];
  meta: Meta;
  active: boolean;
}>();
// const title = ref(props.title);
const todos = ref(props.todos);
const meta = ref(props.meta);

const todoCount = computed(() => todos.value.length);
</script>
