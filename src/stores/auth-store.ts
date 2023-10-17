import { defineStore } from 'pinia';
import { loginData, User } from '../components/models';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      loggedIn: true,
      user: {} as User | null,
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
      console.log(login, 'LOGIN');
      await axios
        .post('/api/auth/login', login)
        .then((resp) => {
          this.setLoggingIn(resp.data.user);

          /* this.user = resp.data.user;
          this.loggedIn = true; */
        })
        .catch(() => this.logError());
    },

    //Kontrollime kas kasutaja on ok ikka
    async authStatus(): Promise<boolean> {
      const tulem = await axios
        .get('api/auth/authstatus')
        .then((resp) => {
          this.setLoggingIn(resp.data.user);
          return true;
        })
        .catch(() => {
          this.logError();
          return false;
        });
      return tulem;
    },

    //Kui sisselogimine on ok
    setLoggingIn(data: User) {
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