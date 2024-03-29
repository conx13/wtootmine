import { defineStore } from 'pinia';
import { Kasutaja } from '../models/kasutaja/kasutajaModel';
import { loginData } from '../models/models';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      loggedIn: localStorage.getItem('loggedIn') === 'true',
      user: {} as Kasutaja | null,
      email: localStorage.getItem('email'),
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
      console.log('Kontrollime auth statust');

      const tulem = await axios
        .get('api/auth/authstatus')
        .then((resp) => {
          this.setLoggingIn(resp.data.user);
          console.log('on sisse logitud');

          return true;
        })
        .catch(() => {
          console.log('ei ole sisse logitud');
          return false;
        });
      return tulem;
    },

    //Kui sisselogimine on ok
    setLoggingIn(data: Kasutaja) {
      this.user = data;
      this.loggedIn = true;
      this.email = data.email;
      localStorage.setItem('email', data.email);
      localStorage.setItem('loggedIn', 'true');
    },
    //Kui logimisel miskit valesti, siis nullime andmed
    logError() {
      this.loggedIn = false;
      this.user = null;
      this.email = null;
      localStorage.removeItem('kasutaja');
      localStorage.removeItem('loggedIn');
    },
  },
});
