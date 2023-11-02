<template>
  <q-layout view="lHh Lpr lFf">
    <q-ajax-bar ref="bar" color="blue" size="5px" />
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
            <q-avatar
              size="30px"
              color="grey"
              text-color="white"
              class="q-ma-xs"
              >{{ user.enimi?.charAt(0) }}{{ user.pnimi?.charAt(0) }}</q-avatar
            >
          </div>
          <q-menu content-class="bg-blue-grey-5 text-white">
            <q-list>
              <q-item clickable v-close-popup @click="logiValja">
                <q-item-section>Logi välja</q-item-section>
                <q-item-section avatar>
                  <q-icon name="exit_to_app"></q-icon>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="logiValja">
                <q-item-section>hillar.aas@matek.ee</q-item-section>
                <q-item-section avatar>
                  <q-icon name="user"></q-icon>
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

        <MenuuLingid
          v-for="link in menuuList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>
    <q-footer v-if="onLogitud" bordered class="bg-white text-primary" reveal>
      <q-tabs
        no-caps
        dense
        active-color="primary"
        indicator-color="transparent"
        class="text-grey"
        v-model="tab"
      >
        <q-route-tab
          name="home"
          icon="home"
          label="Kodu"
          :to="{ name: 'tootminePage' }"
        />
        <q-route-tab
          name="person"
          icon="groups"
          label="Töötajad"
          :to="{ name: 'tootajadPage' }"
        />
        <!--         <q-tab name="home" icon="home" label="Kodu" />
        <q-tab name="person" icon="groups" label="Töötajad" />
        <q-tab name="koodid" icon="qr_code_scanner" label="Koodid" /> -->
      </q-tabs>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAuthStore } from 'src/stores/auth-store';
import MenuuLingid from 'components/MenuuLingid.vue';

import { User } from '../components/models';

const auth = useAuthStore();
const onLogitud = computed(() => auth.loggedIn);
const user = computed(() => <User>auth.user);

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

const leftDrawerOpen = ref(false);
const menuuList = linkideList;
const tab = ref('home');

/* onMounted(() => {
  auth.authStatus(); // <div>
}); */

function logiValja() {
  auth.logout();
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
