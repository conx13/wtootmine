import { defineStore } from 'pinia';
import axios from 'axios';
import { Tootaja, TootajaAjad } from 'src/models/models';
import { date } from 'quasar';

interface Vastus {
  start: string;
  rid: number;
  jid: number;
}
export const useTootajaStore = defineStore('tootaja', {
  state: () => ({
    tootaja: {} as Tootaja,
    loading: false,
    tootjaAjad: [] as TootajaAjad[],
    piltLoading: false,
  }),

  actions: {
    /* ------------------------- baasist otsime töötaja ------------------------- */
    /**
     * @tid - töötaja id
     */
    async getTootaja(tid: number) {
      this.loading = true;
      try {
        const data = await axios.get<Tootaja[]>(`/api/users/user/${tid}`);
        if (data.data !== undefined) {
          this.tootaja = data.data[0];
          this.getViimatiAkt(tid); //otsime viimase aktiivse stardi aja ka juurde
        }
      } catch (error) {
        console.error(error, 'Kasutaja error');
      }
      this.loading = false;
    },
    /* ----------------------- otsime viimase aktiivse aja ---------------------- */
    /*
    @tid - töötaja id
    */
    async getViimatiAkt(tid: number) {
      const tana = Date.now();
      try {
        const data = await axios.get<Vastus>(`/api/users/viimatiakt/${tid}`);
        this.tootaja.rid = data.data.rid;
        this.tootaja.jid = data.data.jid;

        const viimatiAeg = new Date(data.data.start);
        //muudame tunnid aja tsooniga õigeks
        viimatiAeg.setUTCHours(
          viimatiAeg.getUTCHours() + viimatiAeg.getTimezoneOffset() / 60
        );
        //lisame töötajale start väärtuse
        this.tootaja.start = date.formatDate(viimatiAeg, 'YYYY-MM-DD HH:mm:ss');
        // võrdleme viimast akt aega ja tänast
        this.tootaja.viimatiAkt = date.getDateDiff(tana, viimatiAeg, 'days');
      } catch (error) {
        console.error(error, 'getViimatiAkt ERROR!');
      }
    },
    /* -------------------------- Muudame töötaja pilti ------------------------- */
    /**
     * @param {File} pilt - töötja pildi fail
     */
    async muudaPilt(pilt?: File) {
      const formData = new FormData();
      if (pilt) {
        formData.append('pilt', pilt);
      }
      this.piltLoading = true;
      try {
        await axios.post(`/api/users/editpic/${this.tootaja.TID}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        await this.getTootaja(this.tootaja.TID);
      } catch (error) {
        console.error(error, 'MuudaPilt error');
      } finally {
        this.piltLoading = false;
      }
    },

    /* ------------------------- Kustutame töötaja pildi ------------------------ */
    /**
     * @param {string} pildiNimi - pildi nimi serveris
     */
    async kustutaPilt(pildiNimi: string) {
      if (pildiNimi) {
        this.piltLoading = true;
        try {
          await axios.delete(`/api/users/delpic/${this.tootaja.TID}`, {
            params: { pilt: pildiNimi },
          });
          this.tootaja.pilt = '';
        } catch (err) {
          console.log(err, 'KustutaPilt error');
        } finally {
          this.piltLoading = false;
        }
      }
    },

    /* ------------------ Lõpetame aktiivse töö tööootele vastu ----------------- */
    /*
    @tid -töötaja ID
    @rid - hekte töö id
    @start - hetke aktiivse töö alguse aeg
    @uusAeg - uus tööalguse aeg
    */
    async muudaLisaTootajaAega(
      tid: number,
      rid: number,
      start: string,
      uusAeg: Date,
      ootanToodId: number
    ) {
      try {
        await this.getTootajaAjad(tid); //Võtame baasist töötaja ajad
        const hetkeOigeAeg = oigeAeg(this.tootjaAjad[0], uusAeg); //Töötaja aegadega võrreldud aeg
        //mssql õige formaadis aeg
        const loppAeg = date.formatDate(hetkeOigeAeg, 'YYYY-MM-DD HH:mm');
        //arvutame tööaja kokku
        const kokkuTooaeg = tehtudAeg(start, this.tootjaAjad[0], hetkeOigeAeg);

        await this.putTooajaLopp(rid, loppAeg, kokkuTooaeg);
        //TODO vaja tööootel kood võtta config failist
        await this.postUusToo(tid, ootanToodId, loppAeg);
      } catch (error) {
        console.error(error, 'muudaLisaTootajaAega error');
        throw error;
      }
    },

    /* ------------------- otsime töötaja start/stop ja pausi ------------------- */
    /*
    @tid töötaja id
    */
    async getTootajaAjad(tid: number) {
      try {
        const data = await axios.get<TootajaAjad>(
          `/api/users/tootaja/ajagrupp/${tid}`
        );
        if (data.data !== undefined) {
          this.tootjaAjad.push(data.data);
        }
      } catch (error) {
        throw error;
      }
    },

    /* ----------------------- Lõpetame hetkel pooliku töö ---------------------- */
    /*
    @rid - olemasolev töö id
    @stop - tööaja lõpp
    @result - kokku tööaeg minutites
    */
    async putTooajaLopp(rid: number, stop: string, result: number) {
      try {
        await axios.put(`/api/users/toolopp/${rid}`, {
          stop: stop,
          result: result,
        });
      } catch (error) {
        //console.log(error, 'putTooajaLopp ERROR');
        throw error;
      }
    },
    /* -------------------------------------------------------------------------- */
    /*                          Lisame töötajale uue töö                          */
    /* -------------------------------------------------------------------------- */
    /**
     * @param {number} tid - töötaja id
     * @param {number} jid - töö id
     * @param {string} start - hetke aeg
     */
    async postUusToo(tid: number, jid: number, start: string) {
      try {
        await axios.post(`/api/users/uustoo/${tid}`, {
          jid: jid,
          start: start,
        });
      } catch (error) {
        throw error;
      }
    },
    /* -------------------------------------------------------------------------- */
    /*                     Võtame config failist töö ootel ID                     */
    /* -------------------------------------------------------------------------- */
    /*     async getTooOotelId() {
      try {
        const data = await axios.get('/api/auth/config/ootelid');
        if (data.data && data.data.ootelid) {
          this.ootanToodId = data.data.ootelid;
        }
      } catch (err) {
        throw err;
      }
    }, */
  },
});

/* -------- Pneme paika tööaja alguse ja lõpu vastavalt AJAD tabelile ------- */
/**
 * @param ajad - Baasist töötaja ajad
 */
function oigeAeg(ajad: TootajaAjad, uusAeg: Date): Date {
  const hetk = new Date(uusAeg);
  hetk.setSeconds(0); //nullime sekundid

  const hetkAeg = date.formatDate(hetk, 'HH:mm');
  const [lounAlgustunnid, lounaAlgusminutid] = ajad.Lalgus.split(':');
  const [tooAlgusTunnid, tooAlgusMinutid] = ajad.Tooalgus.split(':');
  const [tooLoppTunnid, tooLoppMinutid] = ajad.Toolopp.split(':');

  if (hetkAeg > ajad.Lalgus && hetkAeg < ajad.Llopp) {
    //kui aeg jääb lõuna sisse, siis paneme lõuna alguse aja
    hetk.setHours(Number(lounAlgustunnid));
    hetk.setMinutes(Number(lounaAlgusminutid));
  } else if (hetkAeg < ajad.Tooalgus) {
    //kontrollime et aeg jääks tööpäeva algusesse
    hetk.setHours(Number(tooAlgusTunnid));
    hetk.setMinutes(Number(tooAlgusMinutid));
  } else if (hetkAeg > ajad.Toolopp) {
    //kontrollime et aeg jääk tööpäeva lõppu
    hetk.setHours(parseInt(tooLoppTunnid));
    hetk.setMinutes(parseInt(tooLoppMinutid));
  }
  console.log(hetk, 'Hetk');

  return hetk;
}

/* --------------------- Arvutan tehtud tööaja minutites -------------------- */
/**
 * @param start - hetke aeg
 * @param ajad  - töötaja ajad baasist
 * @param stop  - hetkeaeg
 */
function tehtudAeg(start: string, ajad: TootajaAjad, stop: Date): number {
  const tooStart = new Date(start);
  const tooAlgusMinutites = tooStart.getHours() * 60 + tooStart.getMinutes();
  const tooLoppMinutites = stop.getHours() * 60 + stop.getMinutes();
  const lounaLoppMinutites = convertTimeToMinutes(ajad.Llopp);
  const tooAegKokku = Math.floor((stop.getTime() - tooStart.getTime()) / 60000);

  if (
    tooAlgusMinutites < lounaLoppMinutites &&
    tooLoppMinutites >= lounaLoppMinutites
  ) {
    return tooAegKokku - 30;
  }

  return tooAegKokku;
}

/* ------------------------ Muudan "HH:mm" minutiteks ----------------------- */
function convertTimeToMinutes(timeString: string) {
  const [tunnid, minutid] = timeString.split(':');
  return Number(tunnid) * 60 + Number(minutid);
}
