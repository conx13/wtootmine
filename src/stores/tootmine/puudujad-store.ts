import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore as authStore, useAuthStore } from 'src/stores/auth-store';

import { Tootaja } from 'src/models/models';

export const usePuudujadStore = defineStore('puudujad', {
  state: () => ({
    puudujad: [] as Tootaja[],
    puudujaGrupid: [] as string[],
    grupiNimi: '',
    asukoht_id: 1,
    loading: false,
    lehtLaetud: false,
  }),

  getters: {
    //võtame kasutaja küljest asukoha
    asukoht() {
      return authStore().user?.asukoht_id || 0;
    },
    //Tekitame puudujate töö grupid
    puudujadTooGrupid(state) {
      //kui ei ole midagi valitud, siis grupp
      if (state.grupiNimi === '') {
        const unique = [
          ...new Set(state.puudujad.map((item) => item.toogrupp_nimi)),
        ];
        return unique;
      } else {
        //kui on valitud siis ainult valik
        const items = [];
        items.push(state.grupiNimi);
        return items;
      }
    },
    //Filtreerime puudujaid
    puudujadFilter(state): Tootaja[] {
      let puudujad = [] as Tootaja[];
      if (state.grupiNimi === '') {
        puudujad = state.puudujad;
      } else {
        puudujad = state.puudujad.filter(
          (item) => item['toogrupp_nimi'] === state.grupiNimi
        );
      }
      return puudujad;
    },
  },

  actions: {
    // Võtame baasist puudujate listi
    async getPuudujad() {
      console.log('Võtame puudujad');

      this.loading = true;
      this.puudujad = await puudujadBaasist(this.asukoht);
      this.loading = false;
    },
    //filtreerime puudujad grupi järgi välja
    setPuudujadFilter(grupp: string) {
      this.grupiNimi = grupp;
    },
  },
});

/* ------------------------- Võtame baasist puudujad ------------------------ */
function puudujadBaasist(asukoht_id: number) {
  try {
    const data = axios
      .get(`api/rkood/tanapolelist/${asukoht_id}`)
      .then((res) => {
        if (res.data.length) {
          return res.data;
        } else {
          return [];
        }
      });
    return data;
  } catch (error) {
    console.log(error);
  }
}
