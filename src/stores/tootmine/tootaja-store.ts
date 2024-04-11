import { defineStore } from 'pinia';
import axios from 'axios';
import { Tootaja, TootajaAjad } from 'src/models/models';
import { date } from 'quasar';

interface Vastus {
  start: string;
}
export const useTootajaStore = defineStore('tootaja', {
  state: () => ({
    tootaja: {} as Tootaja,
    loading: false,
    tootjaAjad: [] as TootajaAjad[],
  }),

  actions: {
    /* ------------------------- baasist otsime töötaja ------------------------- */
    /**
     * @tid - töötaja id
     */
    async getTootaja(tid: number) {
      console.log('Grt tootaja');

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
        if (data.data !== undefined) {
          const viimati = new Date(data.data.start);
          // võrdleme viimast akt aega ja tänast
          const diff = date.getDateDiff(tana, viimati, 'days');
          this.tootaja.viimatiAkt = diff;
        }
      } catch (error) {
        console.error(error);
      }
    },
    /* ------------------ Lõpetame aktiivse töö tööootele vastu ----------------- */
    /*
    @tid -töötaja ID
    @rid - hekte töö id
    @start - hetke aeg
    */
    async muudameLisameTootajaAega(tid: number, rid: number, start: string) {
      try {
        await this.getTootajaAjad(tid); //Võtame baasist töötaja ajad
        const hetkeOigeAeg = oigeAeg(this.tootjaAjad[0]); //Töötaja aegadega võrreldud aeg
        const baasiAeg = date.formatDate(hetkeOigeAeg, 'YYYY-MM-DD HH:mm'); //mssql õige formaadis aeg
        const kokkuTooaeg = tehtudAeg(start, this.tootjaAjad[0], hetkeOigeAeg); //arvutame tööaja kokku
        await this.putTooajaLopp(rid, baasiAeg, kokkuTooaeg);
        //TODO vaja tööootel kood võtta config failist
        await this.postUusToo(tid, 47838, baasiAeg);
      } catch (error) {
        console.error(error);
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
        console.error(error);
        throw error;
      }
    },
  },
});

/* -------- Pneme paika tööaja alguse ja lõpu vastavalt AJAD tabelile ------- */
/**
 * @param ajad - Baasist töötaja ajad
 */
function oigeAeg(ajad: TootajaAjad): Date {
  const hetk = new Date(Date.now());
  hetk.setSeconds(0); //nullime sekundid

  const hetkText = date.formatDate(hetk, 'HH:mm');
  const [lounAlgustunnid, lounaAlgusminutid] = ajad.Lalgus.split(':');
  const [tooAlgusTunnid, tooAlgusMinutid] = ajad.Tooalgus.split(':');
  const [tooLoppTunnid, tooLoppMinutid] = ajad.Toolopp.split(':');

  if (hetkText > ajad.Lalgus && hetkText < ajad.Llopp) {
    //kui aeg jääb lõuna sisse, siis paneme lõuna alguse aja
    hetk.setHours(Number(lounAlgustunnid));
    hetk.setMinutes(Number(lounaAlgusminutid));
  } else if (hetkText < ajad.Tooalgus) {
    //kontrollime et aeg jääks tööpäeva algusesse
    hetk.setHours(Number(tooAlgusTunnid));
    hetk.setMinutes(Number(tooAlgusMinutid));
  } else if (hetkText > ajad.Toolopp) {
    //kontrollime et aeg jääk tööpäeva lõppu
    hetk.setHours(parseInt(tooLoppTunnid));
    hetk.setMinutes(parseInt(tooLoppMinutid));
  }
  return hetk;
}

/* --------------------- Arvutan tehtud tööaja minutites -------------------- */
/**
 * @param start - hetke aeg
 * @param ajad  - töötaja ajad baasist
 * @param stop  - hetkeaeg
 */
function tehtudAeg(start: string, ajad: TootajaAjad, stop: Date) {
  const tooStart = new Date(start);
  const tooAlgusTunnid = tooStart.getHours();
  const tooAlgusMinutid = tooStart.getMinutes();
  const tooAlgusMinutites = tooAlgusTunnid * 60 + tooAlgusMinutid;

  const tooLoppTunnid = stop.getHours();
  const tooLoppMinutid = stop.getMinutes();
  const tooLoppMinutites = tooLoppTunnid * 60 + tooLoppMinutid;

  const lounaLoppMinutites = convertTimeToMinutes(ajad.Llopp);
  const tooAegKokku = Math.floor((stop.getTime() - tooStart.getTime()) / 60000);

  if (
    tooAlgusMinutites < lounaLoppMinutites &&
    tooLoppMinutites >= lounaLoppMinutites
  ) {
    // kui tööaja sisse jääb lõuna siis võtame 30mintsa maha
    return tooAegKokku - 30;
  }
  return tooAegKokku;
}

/* ------------------------ Muudan "HH:mm" minutiteks ----------------------- */
function convertTimeToMinutes(timeString: string) {
  const [tunnid, minutid] = timeString.split(':');
  return Number(tunnid) * 60 + Number(minutid);
}
