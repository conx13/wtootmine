import { defineStore } from 'pinia';
import axios from 'axios';
import { date } from 'quasar';

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
    tooTegijad: [] as gruppTootajad[],
    uuedTood: [] as number[],
    viimatiVaatasid: Date.now(),
  }),

  getters: {
    tanaKokku(state) {
      return state.aktiivsed.tulem + state.puudujad.tulem;
    },
    //Tekitame listi unikaalsetest töödest
    gruppTood(state) {
      return [
        ...new Map(
          state.gruppTootajad.map((item) => [item['JID'], item])
        ).values(),
      ];

      /*       return state.gruppTootajad.filter(
        (value, index, self) =>
          self.findIndex((v) => v.JID === value.JID) === index
      ); */
    },
  },

  actions: {
    //võtame baasist hetkel aktiivsed koos töödega
    async getHetkelTool() {
      this.loading = true;
      this.aktiivsed = await getAktiivsed();
      this.puudujad = await getPuudujad();
      this.tanaList = await getAktGrupp(this.asukoht);
      this.loading = false;
    },
    //võtame baasist tööde grupid
    async getGrupp(grupp: string) {
      this.loading = true;
      this.gruppTootajad = [];
      this.viimatiVaatasid = regViimatiVaatasin(grupp);
      this.gruppTootajad = await getGruppTootajad(grupp);

      //this.uuedTood = muutunudElTood(this.gruppTootajad, grupp);
      this.loading = false;
    },
    //filtreerime töö järgi tegijad
    async getTooTegijad(jid: number) {
      const test = await this.gruppTootajad.filter((data) => data.JID == jid);
      return test;
    },
    //võrdleme uute tulemustega
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
    const data = axios.get(`/api/rkood/tanagrupp/${grupp}`).then((res) => {
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

//muutunud tööd
function muutunudElTood(tood: gruppTootajad[], grupp: string) {
  sessionStorage.setItem(grupp + '_checkpoint', String(Date.now()));
  //tekitame listi töös olevates töödest
  let uuedTood: number[] = [];
  const toosTood = [...new Set(tood.map((item) => item.JID))];
  if (sessionStorage.getItem(grupp + '_tood')) {
    const vanadTood: number[] = JSON.parse(
      String(sessionStorage.getItem(grupp + '_tood'))
    );
    //tekitame listi nendest töödest mida enne kirjas ei olnud
    uuedTood = toosTood.filter((num) => !vanadTood.includes(num));
  }
  //Kirjutame tööd localStorage
  sessionStorage.setItem(grupp + '_tood', JSON.stringify(toosTood));
  console.log(uuedTood, 'Töös olevad tööd');
  console.log(grupp, 'Töös olevad tööd grupp');
  return uuedTood;
}
//Kirjutame andmete baasist lugemise aja localSessi
function regViimatiVaatasin(grupp: string): number {
  let kpv: number = Date.now();
  if (sessionStorage.getItem(grupp + '_checkpoint')) {
    kpv = Number(sessionStorage.getItem(grupp + '_checkpoint'));
  }
  sessionStorage.setItem(grupp + '_checkpoint', String(Date.now()));
  return kpv;
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
