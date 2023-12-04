import { defineStore } from 'pinia';
import axios from 'axios';
import { Tootaja } from 'src/models/models';

export const usePuudujadStore = defineStore('puudujad', {
  state: () => ({
    puudujad: [] as Tootaja[],
    puudujaGrupid: [] as string[],
    grupiNimi: '',
    loading: false,
    lehtLaetud: false,
  }),

  getters: {
    //Tekitame puudujate töö grupid
    puudujadTooGrupid(state) {
      const unique = [
        ...new Set(state.puudujad.map((item) => item.toogrupp_nimi)),
      ];
      return unique;
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
      this.loading = true;
      this.puudujad = await puudujadBaasist();
      this.loading = false;
    },
    //filtreerime puudujad grupi järgi välja
    setPuudujadFilter(grupp: string) {
      this.grupiNimi = grupp;
    },
  },
});

function puudujadBaasist() {
  try {
    const data = axios.get('api/rkood/tanapolelist/1').then((res) => {
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
