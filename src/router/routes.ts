import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import TootmineLayout from 'src/layouts/TootmineLayout.vue';
import AuthLayout from '../layouts/AuthLayout.vue';
import { useAuthStore } from 'src/stores/auth-store';

import UserLogin from 'pages/UserLogin.vue';

async function regAuth(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const auth = useAuthStore();
  if (await auth.authStatus()) {
    next();
  } else {
    next({
      path: '/login',
      query: { redirect: to.fullPath },
    });
  }
}

const routes = [
  {
    path: '/',
    component: TootmineLayout,
    beforeEnter: [regAuth],
    children: [
      {
        path: '',
        name: 'm_tootminePage',
        component: () => import('pages/tootmine/TootminePage.vue'),
        beforeEnter: [regAuth],
        meta: { title: 'tootmine' },
      },
      {
        path: '/tootmine/:grupp',
        name: 'm_tootmineGrupp',
        meta: { title: 'Tööd:' },
        component: () => import('pages/tootmine/GruppTootajadPage.vue'),
        //beforeEnter: [regAuth],
      },
      {
        path: '/tootajad',
        name: 'm_tootajadPage',
        meta: { title: 'töötajad' },
        component: () => import('pages/tootajad/tootajadPage.vue'),
        beforeEnter: [regAuth],
      },
      {
        path: '/otsi',
        name: 'm_otsiPage',
        meta: { title: 'Otsi koodi' },
        component: () => import('pages/otsi/OtsiPage.vue'),
        // beforeEnter: [regAuth],
      },

      {
        path: '/puudujad',
        name: 'm_puudujadPage',
        meta: { title: 'mitteaktiivsed' },
        beforeEnter: [regAuth],
        // Soovitati väikese api puhul "otse laadiist mitte ette laadimist"
        component: () => import('pages/puudujad/puudujadPage.vue'),
      },
      {
        path: '/tootaja/:id',
        name: 'm_tootajaPage',
        meta: { title: 'Töötaja:' },
        component: () => import('pages/tootaja/tootajaPage.vue'),
        beforeEnter: [regAuth],
      },
      {
        path: '/kasutaja/:id',
        name: 'm_kasutajaPage',
        meta: { title: 'Kasutaja:' },
        component: () => import('pages/kasutaja/KasutajaPage.vue'),
        //beforeEnter: [regAuth],
      },
    ],
  },
  {
    path: '/',
    component: AuthLayout,
    children: [
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
