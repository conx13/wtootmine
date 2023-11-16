import {
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw,
} from 'vue-router';
import MainLayout from 'layouts/MainLayout.vue';
import { useAuthStore } from 'src/stores/auth-store';

import TootminePage from 'pages/tootmine/TootminePage.vue';
import PuudujadPage from 'pages/puudujad/puudujadPage.vue';
import TootajadPage from 'pages/tootajad/tootajadPage.vue';
import TootajaPage from 'pages/tootaja/tootajaPage.vue';
import GruppTootajadPage from 'pages/tootmine/GruppTootajadPage.vue';
import KasutajaPage from 'pages/kasutaja/KasutajaPage.vue';

import UserLogin from 'pages/UserLogin.vue';

async function regAuth(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const auth = useAuthStore();
  if (await auth.authStatus()) {
    console.log('Kasutaja on logitud');
    next();
  } else {
    console.log('Kasutaja ei ole logitud sisse!');
    next({
      path: '/login',
      query: { redirect: to.fullPath },
    });
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'tootminePage',
        component: TootminePage,
        meta: { title: 'tootmine' },
        beforeEnter: [regAuth],
      },
      {
        path: '/tootajad',
        name: 'tootajadPage',
        component: TootajadPage,
        meta: { title: 'töötajad' },
        //beforeEnter: [regAuth],
      },
      {
        path: '/puudujad',
        name: 'puudujadPage',
        component: PuudujadPage,
        meta: { title: 'mitteaktiivsed' },
        //beforeEnter: [regAuth],
        // Soovitati väikese api puhul "otse laadiist mitte ette laadimist"
        //component: () => import('pages/puudujad/puudujadPage.vue'),
      },
      {
        path: '/tootaja/:id',
        name: 'tootajaPage',
        component: TootajaPage,
        meta: { title: 'Töötaja:' },
        beforeEnter: [regAuth],
      },
      {
        path: '/tootmine/:grupp',
        name: 'tootmineGrupp',
        component: GruppTootajadPage,
        meta: { title: 'Tööd:' },
        //beforeEnter: [regAuth],
      },
      {
        path: '/kasutaja/:id',
        name: 'kasutajaPage',
        component: KasutajaPage,
        meta: { title: 'Kasutaja:' },
        //beforeEnter: [regAuth],
      },
      {
        path: '/login',
        name: 'userLogin',
        component: UserLogin,
        meta: { title: 'Login' },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
