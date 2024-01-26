import { defineStore } from 'pinia';
import axios from 'axios';

import { Kasutaja, Asukohad, Valikud } from 'src/models/kasutaja/kasutajaModel';

export const useTootajaStore = defineStore('kasutaja', {
  state: () => ({
    kasutaja: {} as Kasutaja,
    loading: false,
    asukohaValik: [] as Valikud[],
    asukModel: {},
    piltLoading: false,
  }),

  getters: {},

  actions: {
    /* ----------------------------- otsime kasutaja ---------------------------- */
    async getKasutaja(id: number) {
      this.loading = true;
      try {
        const data = await axios.get<Kasutaja[]>(`/api/kasutaja/${id}`);
        this.kasutaja = data.data[0];
        this.asukModel = {
          label: data.data[0].asukoht,
          value: data.data[0].asukoht_id,
        };
      } catch (err) {
        console.log(err);
      }
      this.loading = false;
    },
    /* -------------------------- baasist asukohad list ------------------------- */
    async getAsukohad() {
      this.asukohaValik = [];
      console.log('get asukohad');

      try {
        const data = await axios.get<Asukohad[]>('/api/kasutaja/asukohad/list');
        data.data.map((e) =>
          this.asukohaValik.push({
            label: e.nimi,
            value: e.id,
          })
        );
      } catch (error) {
        console.log(error);
      }
    },
    async muudaPilt(pilt: File) {
      const formData = new FormData();
      console.log(pilt, 'PILT');

      formData.append('pilt', pilt);
      this.piltLoading = true;
      try {
        const data = await axios.post(
          `/api/kasutaja/muudapilt/${this.kasutaja.id}`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        console.log(data, 'Pilt tagasi');

        await this.getKasutaja(this.kasutaja.id);
      } catch (error) {
        console.log(error);
      }
      this.piltLoading = false;
    },
  },
});
