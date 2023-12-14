import { defineStore } from 'pinia';
import axios from 'axios';
import { Tootaja } from 'src/models/models';

interface AppState {
  tootaja: Tootaja | null;
  loading: boolean;
}
export const useTootajaStore = defineStore('tootaja', {
  state: (): AppState => ({
    tootaja: null,
    loading: false,
  }),

  actions: {
    async getTootaja(tid: number) {
      this.loading = true;
      const data = await tootajaBaasist(tid);
      if (data !== undefined) {
        this.tootaja = data;
      }
      this.loading = false;
    },
  },
});

async function tootajaBaasist(tid: number) {
  try {
    const data = await axios.get<Tootaja[]>(`/api/users/user/${tid}`);
    return data.data[0];
  } catch (err) {
    console.log(err, 'Kasutaja error');
  }
}
