import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore as authStore } from 'src/stores/auth-store';

import { Tootaja } from 'src/models/models';

export const useTootajadStore = defineStore('tootajad', {
  state: () => ({
    tootajad: [] as Tootaja[],
    loading: false,
    kasAktiivsed: '1',
    otsiText: '',
    loadingOtsi: false,
  }),

  getters: {
    //võtame kasutaja küljest asukoha
    asukoht() {
      return authStore().user?.asukoht_id || 0;
    },
  },

  actions: {
    async getTootajad() {
      /**
       * otsime töötajaid
       * vaja on baasist:
       * TID
       * pilt
       * PNIMI
       * ENIMI
       * tootaja.toogrupp_nimi
       */

      this.tootajad = [];
      if (this.otsiText !== '') {
        try {
          this.loadingOtsi = true;
          await axios
            .get<Tootaja[]>(
              `api/users/otsi/${this.otsiText}/${this.kasAktiivsed}/${this.asukoht}`
            )
            .then((res) => {
              this.loadingOtsi = false;
              if (res.data.length) {
                this.tootajad = res.data;
                console.log(this.tootajad, 'Tootajad');
              } else {
              }
            });
        } catch (error) {
          console.error(error, 'Otsi Error');

          this.loadingOtsi = false;
        }
      }
    },
  },
});
