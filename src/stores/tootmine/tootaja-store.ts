import { defineStore } from 'pinia';
import axios from 'axios';
import { Kasutaja } from 'src/components/models';

export const useTootajaStore = defineStore('tootaja', {
  state: () => ({
    tootaja: {} as Kasutaja,
  }),

  getters: {},

  actions: {
    async getTootaja(tid: number) {
      this.tootaja = await tootajaBaasist(tid);
    },
  },
});

async function tootajaBaasist(tid: number) {
  let kasutaja!: Kasutaja;
  await axios
    .get<Kasutaja>(`/api/users/user/${tid}`)
    .then((data) => {
      test: data.data;
    })
    .catch((err) => console.log(err, 'Kasutaja error'));
  return kasutaja;
}
