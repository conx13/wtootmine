<template>
  <q-header v-if="onLogitud" bordered class="bg-white text-primary" reveal>
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="toggleLeftDrawer"
      />

      <q-toolbar-title class="text-center text-h5">
        Pärnu: {{ $route.meta.title }}</q-toolbar-title
      >
      <q-btn outline rounded no-caps padding="none">
        <div v-if="user" class="row items-center">
          <q-avatar size="30px" color="grey" text-color="white" class="q-ma-xs"
            >{{ user.enimi?.charAt(0) }}{{ user.pnimi?.charAt(0) }}</q-avatar
          >
        </div>
        <q-menu content-class="bg-blue-grey-5 text-white">
          <q-list>
            <q-item
              clickable
              v-close-popup
              @click="$router.push({ name: 'kasutajaPage', params: { id: 1 } })"
            >
              <q-item-section>hillar.aas@matek.ee</q-item-section>
              <q-item-section avatar>
                <q-icon name="user"></q-icon>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="logiValja">
              <q-item-section>Logi välja</q-item-section>
              <q-item-section avatar>
                <q-icon name="exit_to_app"></q-icon>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
      <!-- <div>Quasar v{{ $q.version }}</div> -->
    </q-toolbar>
  </q-header>
  <q-drawer v-if="onLogitud" v-model="leftDrawerOpen" show-if-above bordered>
    <q-list>
      <q-item-label header> Valikud: </q-item-label>
      <MenuuLingid v-for="link in menuuList" :key="link.title" v-bind="link" />
    </q-list>
  </q-drawer>
  <q-page style="padding-top: 120px">
    <div class="row-inline q-ma-xs">
      <q-pull-to-refresh @refresh="refresh">
        <div class="row justify-center">
          <div class="col-xs-12 col-lg-3">
            <tootmine-list />
          </div>
        </div>
        <!--Kuna kasutame Sticky, siis peab olema kõige lõpus-->
        <aktiivsed-riba @aktiiv="aktiiv" @mitteakt="mitteakt" />
      </q-pull-to-refresh>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useTootmineStore } from '../../stores/tootmine/tootmine-store';
import TootmineList from '../../components/tootmine/TootmineList.vue';
import AktiivsedRiba from '../../components/tootmine/AktiivsedRiba.vue';
import MenuuLingid from 'components/MenuuLingid.vue';
import { Kasutaja } from '../../models/kasutaja/kasutaja';

const router = useRouter();
const tootStore = useTootmineStore();
import { useAuthStore } from 'src/stores/auth-store';

const auth = useAuthStore();
const onLogitud = computed(() => auth.loggedIn);
const user = computed(() => <Kasutaja>auth.user);
const linkideList = [
  {
    title: 'Hetkeseis',
    icon: 'today',
    link: 'tootminePage',
  },
  {
    title: 'Töötajad',
    icon: 'groups',
    link: 'tootajadPage',
  },
];
const menuuList = linkideList;

async function getAktiivsedRibaData() {
  await tootStore.getHetkelTool();
}
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

const leftDrawerOpen = ref(false);
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function logiValja() {
  auth.logout();
}
function refresh(done: () => void) {
  setTimeout(() => {
    getAktiivsedRibaData();
    done();
  }, 1000);
}
</script>
../../models/models
