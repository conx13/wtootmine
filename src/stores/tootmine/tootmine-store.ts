import { defineStore } from 'pinia';
import axios from 'axios';

interface Tulem {
  tulem: number;
}

interface toolGrupp {
  GGRUPP: string;
  JRK: number;
  Kokku: number;
  asukoht_id: number;
}

export const useTootmineStore = defineStore('tootmine', {
  state: () => ({
    aktiivsed: <Tulem>{ tulem: 0 },
    puudujad: <Tulem>{ tulem: 0 },
    loading: false,
    tanaList: [] as toolGrupp[],
    asukoht: 1,
  }),

  getters: {
    tanaKokku(state) {
      return state.aktiivsed.tulem + state.puudujad.tulem;
    },
  },

  actions: {
    async getHetkelTool() {
      this.loading = true;
      this.aktiivsed = await getAktiivsed();
      this.puudujad = await getPuudujad();
      this.tanaList = await getAktGrupp(this.asukoht);
      this.loading = false;
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

//Hetkel aktiivsed grupid
function getAktGrupp(asukoht_id: number) {
  try {
    const data = axios
      .get(`/api/rkood/tanatoollist/${asukoht_id}`)
      .then((res) => {
        if (res.data.length) {
          return res.data;
        } else {
          return [];
        }
      });
    return data;
  } catch (err) {
    console.log(err);
  }
}
