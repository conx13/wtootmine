<template>
  <q-page padding>
    <!-- content -->
    <div class="row justify-center">
      <div class="col-xs-9 col-sm-6 col-md-4 col-lg-3">
        <q-card>
          <q-banner class="bg-blue-grey text-white">
            <span class="text-h6">Logi palun sisse:</span>
          </q-banner>
          <q-card-section>
            <q-form
              ref="loginForm"
              @submit.prevent="onLoginSubmit"
              class="q-gutter-md"
            >
              <div class="row">
                <div class="col full-widht">
                  <q-input
                    ref="emailRef"
                    autofocus
                    outlined
                    dense
                    clearable
                    clear-icon="close"
                    type="email"
                    label="Email"
                    v-model="logindata.email"
                    :rules="[
                      (val) => (val !== null && val !== '') || 'Palun email!',
                      (val) => isValidEmail(val) || 'Email on vale!',
                    ]"
                    lazy-rules
                  ></q-input>
                </div>
              </div>
              <div class="row">
                <div class="col full-width">
                  <q-input
                    ref="passwordRef"
                    outlined
                    dense
                    clearable
                    clear-icon="close"
                    label="Parool"
                    :type="isPwd ? 'password' : 'text'"
                    :rules="[
                      (val) => (val !== null && val !== '') || 'Palun parool!',
                    ]"
                    v-model="logindata.password"
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                      />
                    </template>
                  </q-input>
                </div>
              </div>
              <div class="row justify-center">
                <div class="col-6">
                  <q-btn
                    class="full-width"
                    type="submit"
                    outline
                    color="primary"
                    label="Login"
                  />
                </div>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { QForm } from 'quasar';
import { ref } from 'vue';
import { useAuthStore } from 'src/stores/auth-store';
import { loginData } from '../components/models';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const logindata = ref(<loginData>{ email: '', password: '' });
const isPwd = ref(true);
const loginForm = ref<QForm | null>(null);

// Kontrollime emaili
function isValidEmail(email: string) {
  // eslint-disable-next-line no-useless-escape
  const re = /\S+@\S+\.\S+/;
  return re.test(String(email).toLowerCase());
}

async function onLoginSubmit() {
  //loginForm.value?.validate();
  await auth.login(logindata.value);
  console.log(route.query.redirect, 'Router query');

  router.push((route.query.redirect as string) || '/');
}
</script>
