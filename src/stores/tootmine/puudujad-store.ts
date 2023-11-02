import { defineStore } from 'pinia';
import axios from 'axios';
import { User } from 'src/components/models';

export const usePuudujadStore = defineStore('counter', {
  state: () => ({
    puudujad: [] as User[],
    puudujaGrupid: [] as string[],
    grupiNimi: '',
  }),

  getters: {
    //Tekitame puudujate töö grupid
    puudujadTooGrupid(state) {
      const unique = [
        ...new Set(state.puudujad.map((item) => item.toogruppNimi)),
      ];
      return unique;
    },
    //Filtreerime puudujaid
    puudujadFilter(state): User[] {
      let puudujad = [] as User[];
      if (state.grupiNimi === '') {
        puudujad = state.puudujad;
      } else {
        puudujad = state.puudujad.filter(
          (item) => item['toogruppNimi'] === state.grupiNimi
        );
      }
      return puudujad;
    },
  },

  actions: {
    // Võtame baasist puudujate listi
    async getPuudujad() {
      this.puudujad = await puudujadBaasist();
    },
    //filtreerime puudujad grupi järgi välja
    setPuudujadFilter(grupp: string) {
      this.grupiNimi = grupp;
    },
  },
});

function puudujadBaasist() {
  //Natuke keeruline variant, kuna baasist tulevad nimetused erinevad mudelist
  const temp1: User[] = [];
  const data = axios.get('api/rkood/tanapolelist/1').then((res) => {
    if (res.data.length) {
      //mappime data läbi ja paneme õiged nimed
      res.data.map(
        (data: {
          nimi: string;
          toogrupp_id: number;
          toogrupp_nimi: string;
          pilt: string | undefined;
          TID: number;
          PNIMI: string;
          ENIMI: string;
          asukoht_id: number;
        }) => {
          //Ajutine mudel
          const temp = {} as unknown as User;
          temp.tid = data.TID;
          temp.enimi = data.ENIMI;
          temp.pnimi = data.PNIMI;
          temp.nimi = data.nimi;
          temp.pilt = data.pilt;
          temp.toogruppId = data.toogrupp_id;
          temp.toogruppNimi = data.toogrupp_nimi;
          temp.asukohtId = data.asukoht_id;
          temp1.push(temp);
        }
      );
      return temp1;
    } else {
      return [];
    }
  });

  return data;
}
