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
    /* ------------------------- baasist otsime töötaja ------------------------- */
    async getTootaja(tid: number) {
      this.loading = true;
      try {
        const data = await axios.get<Tootaja[]>(`/api/users/user/${tid}`);
        if (data.data !== undefined) {
          this.tootaja = data.data[0];
        }
      } catch (error) {
        console.log(error, 'Kasutaja error');
      }
      this.loading = false;
    },
  },
});
