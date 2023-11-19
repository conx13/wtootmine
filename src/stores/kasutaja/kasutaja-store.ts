import { defineStore } from 'pinia';
import axios from 'axios';

export interface Kasutaja {
  tid: number;
  enimi: string;
  pnimi: string;
  email: string;
  firma: string;
  mob: string;
  roll: string;
  markus?: string;
  pilt: string;
  todate?: string;
}
export const useTootajaStore = defineStore('kasutaja', {
  state: () => ({
    kasutaja: {} as Kasutaja,
  }),

  getters: {},

  actions: {
    async getKasutaja(id: number) {
      try {
        const data = await axios.get<Kasutaja[]>(`/api/kasutaja/${id}`);
        this.kasutaja = data.data[0];
      } catch (err) {
        console.log(err);
      }
    },
  },
});
