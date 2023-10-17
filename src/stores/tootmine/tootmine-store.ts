import { defineStore } from 'pinia';
import axios from 'axios';

export const useTootmineStore = defineStore('tootmine', {
  state: () => {
    return {
      aktiivsed: 0,
      puudujad: 0,
    };
  },

  getters: {
    tanaKokku(state) {
      return state.aktiivsed + state.puudujad;
    },
  },

  actions: {
    async getPuudujad() {
      console.log('getPuudujad');
      await axios.get('api/rkood/tanapoletool/1').then((data) => {
        this.puudujad = data.data[0]['tulem'];
        console.log(this.puudujad, 'Vastus data');
      });
    },
    async getAktiivsed() {
      console.log('getAktiivsed');
      await axios.get('api/rkood/tanatool/1').then((data) => {
        console.log(data.data[0]['tulem'], 'Vastus data');
        if (data == null) {
          //this.aktiivsed = data.data[0]['tulem'];
          console.log(this.aktiivsed, 'Vastus data');
          this.aktiivsed = 0;
        } else {
          this.aktiivsed = data.data[0]['tulem'];
          console.log(0, 'Vastus data');
        }
      });
    },
  },
});
