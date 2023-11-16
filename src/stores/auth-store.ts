import { defineStore } from 'pinia';
import { Kasutaja } from '../models/kasutaja/kasutaja';
import { loginData } from '../models/models';
import axios from 'axios';
import { log } from 'console';

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      loggedIn: false,
      user: {} as Kasutaja | null,
    };
  },
  actions: {
    //Logime välja
    async logout() {
      await axios.get('api/auth/logout');
      this.logError();
      this.router.push('/login');
    },

    //Logime sisse
    async login(login: loginData) {
      await axios
        .post('/api/auth/login', login)
        .then((resp) => {
          this.setLoggingIn(resp.data.user);
        })
        .catch(() => this.logError());
    },

    //Kontrollime kas kasutaja on ok ikka
    async authStatus(): Promise<boolean> {
      console.log('Küsime auth statust');

      const tulem = await axios
        .get('api/auth/authstatus')
        .then((resp) => {
          this.setLoggingIn(resp.data.user);
          return true;
        })
        .catch(() => {
          return false;
        });
      return tulem;
    },

    //Kui sisselogimine on ok
    setLoggingIn(data: Kasutaja) {
      this.user = data;
      this.loggedIn = true;
    },
    //Kui logimisel miskit valesti, siis nullime andmed
    logError() {
      this.loggedIn = false;
      this.user = null;
    },
  },
});
