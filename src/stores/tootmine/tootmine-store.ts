import { defineStore } from 'pinia';
import axios from 'axios';

import {
  Tulem,
  toolGrupp,
  gruppTootajad,
} from '../../models/tootmine/tootmineModels';

export const useTootmineStore = defineStore('tootmine', {
  state: () => ({
    aktiivsed: <Tulem>{ tulem: 0 },
    puudujad: <Tulem>{ tulem: 0 },
    loading: false,
    tanaList: [] as toolGrupp[],
    asukoht: 1,
    gruppTootajad: [] as gruppTootajad[],
  }),

  getters: {
    tanaKokku(state) {
      return state.aktiivsed.tulem + state.puudujad.tulem;
    },
    //Tekitame listi unikaalsetest töödest
    gruppTood(state) {
      return state.gruppTootajad.filter(
        (value, index, self) =>
          self.findIndex((v) => v.JID === value.JID) === index
      );
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
    async getGrupp(grupp: string) {
      this.loading = true;
      this.gruppTootajad = [];
      this.gruppTootajad = await getGruppTootajad(grupp);
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

//Töötajad gruppide järgi
function getGruppTootajad(grupp: string) {
  try {
    const data = axios.get(`/api/rkood//tanagrupp/${grupp}`).then((res) => {
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

//Abi funktsioon groupBy
function groupBy<T>(arr: T[], fn: (item: T) => any) {
  return arr.reduce<Record<string, T[]>>((prev, curr) => {
    const groupKey = fn(curr);
    const group = prev[groupKey] || [];
    group.push(curr);
    return { ...prev, [groupKey]: group };
  }, {});
}
