import { defineStore } from 'pinia';
import axios from 'axios';

interface Tulem {
  tulem: number;
}

export const useTootmineStore = defineStore('tootmine', {
  state: () => ({
    aktiivsed: <Tulem>{ tulem: 0 },
    puudujad: <Tulem>{ tulem: 0 },
  }),

  getters: {
    tanaKokku(state) {
      return state.aktiivsed.tulem + state.puudujad.tulem;
    },
  },

  actions: {
    async getHetkelTool() {
      this.aktiivsed = await getAktiivsed();
      this.puudujad = await getPuudujad();
    },
  },
});

//Nokime kõik aktiivsed baasist
function getAktiivsed() {
  const data = axios.get<Tulem[]>('api/rkood/tanatool/1').then((res) => {
    if (res.data.length) {
      return res.data[0];
    } else {
      return { tulem: 0 };
    }
  });
  return data;
}

//Nokime kõik puudujad baasist
function getPuudujad() {
  const data = axios.get<Tulem[]>('api/rkood/tanapoletool/1').then((res) => {
    if (res.data.length) {
      return res.data[0];
    } else {
      return { tulem: 0 };
    }
  });
  return data;
}
