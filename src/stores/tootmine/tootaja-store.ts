import { defineStore } from 'pinia';
import axios from 'axios';
import { Tootaja } from 'src/models/models';

export const useTootajaStore = defineStore('tootaja', {
  state: () => ({
    tootaja: {} as Tootaja,
    loading: false,
  }),

  getters: {
    tahed(state) {
      if (state.tootaja !== undefined) {
        return state.tootaja.PNIMI?.charAt(0) + state.tootaja.ENIMI?.charAt(0);
      } else {
        return '...';
      }
    },
  },

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
