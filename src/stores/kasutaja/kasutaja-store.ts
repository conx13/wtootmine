import { defineStore } from 'pinia';
import axios from 'axios';

import { Kasutaja, Asukohad, Valikud } from 'src/models/kasutaja/kasutajaModel';

export const useKasutajaStore = defineStore('kasutaja', {
  state: () => ({
    kasutaja: {} as Kasutaja,
    loading: false,
    asukohaValik: [] as Valikud[],
    asukModel: {} as Valikud,
    piltLoading: false,
    asukohtLoading: false,
  }),

  getters: {},

  actions: {
    /* ----------------------------- otsime kasutaja ---------------------------- */
    async getKasutaja(id: number, kasLoading = false) {
      // kui tahame taustal kasutajat värskendada ja loadingut ei taha näidata
      this.loading = kasLoading;
      try {
        const data = await axios.get<Kasutaja[]>(`/api/kasutaja/${id}`);
        this.kasutaja = data.data[0];
        this.asukModel = {
          label: data.data[0].asukoht,
          value: data.data[0].asukoht_id,
        };
      } catch (err) {
        console.error(err);
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
        console.error(error);
      }
    },
    /* ------------------------------- muuda pilti ------------------------------ */
    //opt+x
    async muudaPilt(pilt?: File) {
      const formData = new FormData();
      if (pilt) {
        formData.append('pilt', pilt);
      }
      this.piltLoading = true;
      try {
        await axios.post(`/api/kasutaja/pilt/${this.kasutaja.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        await this.getKasutaja(this.kasutaja.id, false);
      } catch (error) {
        console.error(error);
        this.piltLoading = false;
      }
      this.piltLoading = false;
    },
    /* ------------------------ Muudame kasutaja asukohta ----------------------- */
    /**
     * @param {number} asukoht - kasutaja asukoht
     */
    async muudaAsuk(asukoht: number) {
      this.asukohtLoading = true;
      try {
        await axios.put(`/api/kasutaja/${this.kasutaja.id}`, {
          asukoht_id: asukoht,
        });
      } catch (error) {
        console.error(error);
      }
      this.asukohtLoading = false;
    },

    /* -------------------------------------------------------------------------- */
    /*                          Kustutame kasutaja pildi                          */
    /* -------------------------------------------------------------------------- */
    /**
     * @param {string} pildiNimi - kustutame tid-ga pildi
     */
    async kustutaPilt(pildiNimi: string) {
      if (pildiNimi) {
        this.piltLoading = true;
        try {
          await axios.delete(`/api/kasutaja/pilt/${this.kasutaja.id}`, {
            params: { pilt: pildiNimi },
          });
          this.kasutaja.pilt = '';
        } catch (err) {
          console.log(err);
        } finally {
          this.piltLoading = false;
        }
      }
    },
  },
});
