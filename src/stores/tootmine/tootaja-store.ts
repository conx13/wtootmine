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
    tooAjaLopp: '',
    tooAegKokku: 0,
    tootjaAjad: [] as TootajaAjad[],
  }),

  actions: {
    /* ------------------------- baasist otsime töötaja ------------------------- */
    async getTootaja(tid: number) {
      this.loading = true;
      try {
        const data = await axios.get<Tootaja[]>(`/api/users/user/${tid}`);
        if (data.data !== undefined) {
          this.tootaja = data.data[0];
          this.getViimatiAkt(tid); //otsime viimase aktiivse stardi aja ka juurde
        }
      } catch (error) {
        console.log(error, 'Kasutaja error');
      }

      this.loading = false;
    },
    /* ----------------------- otsime viimase aktiivse aja ---------------------- */
    async getViimatiAkt(tid: number) {
      const tana = Date.now();
      try {
        const data = await axios.get<Vastus>(`/api/users/viimatiakt/${tid}`);
        if (data.data !== undefined) {
          const viimati = new Date(data.data.start);
          const unit = 'days';
          const diff = date.getDateDiff(tana, viimati, unit);
          this.tootaja.viimatiAkt = diff;
        }
      } catch (error) {}
    },

    async muudameLisameTootajaAega(tid: number, rid: number, start: string) {
      await this.getTootajaAjad(tid);
      const kokkuTooaeg = tehtudAeg(start, this.tootjaAjad[0]);
      const hetkeOigeAeg = tooLoppAeg(oigeAeg(this.tootjaAjad[0]));
      console.log(kokkuTooaeg, 'Kokku tööaeg');
      console.log(hetkeOigeAeg, 'hetke õige aeg');

      await this.putTooajaLopp(rid, hetkeOigeAeg, kokkuTooaeg);
      await this.postUusToo(tid, 47838, hetkeOigeAeg);
    },

    /* ------------------- otsime töötaja start/stop ja pausi ------------------- */
    async getTootajaAjad(tid: number) {
      try {
        const data = await axios.get<TootajaAjad>(
          `/api/users/tootaja/ajagrupp/${tid}`
        );
        if (data.data !== undefined) {
          this.tootjaAjad.push(data.data);
        }
      } catch (error) {
        console.error(error);
      }
    },
    /* ----------------------- Lõpetame hetkel pooliku töö ---------------------- */
    async putTooajaLopp(rid: number, stop: string, result: number) {
      try {
        await axios.put(`/api/users/toolopp/${rid}`, {
          stop: stop,
          result: result,
        });
      } catch (error) {
        console.error(error);
      }
    },
    /* -------------------------------------------------------------------------- */
    /*                          Lisame töötajale uue töö                          */
    /* -------------------------------------------------------------------------- */
    async postUusToo(tid: number, jid: number, start: string) {
      try {
        await axios.post(`/api/users/uustoo/${tid}`, {
          jid: jid,
          start: start,
        });
      } catch (error) {
        console.error(error);
      }
    },
  },
});

/* -------- Pneme paika tööaja alguse ja lõpu vastavalt AJAD tabelile ------- */
function oigeAeg(ajad: TootajaAjad): Date {
  let hetk = new Date(Date.now());
  hetk = date.adjustDate(hetk, { seconds: 0 }, true); //nullime sekundid
  const hetkTunnid = hetk.getHours(); // leiame tunnid
  const hetkMinutid = hetk.getMinutes(); // leiame minutid
  //viime aja 24h formaati
  const hetkTunnidString = hetkTunnid.toString().padStart(2, '0');
  const hetkMinutidString = hetkMinutid.toString().padStart(2, '0');
  const hetkString = `${hetkTunnidString}:${hetkMinutidString}`;

  const [lounAlgustunnid, lounaAlgusminutid] = ajad.Lalgus.split(':');
  const [tooAlgusTunnid, tooAlgusMinutid] = ajad.Tooalgus.split(':');
  const [tooLoppTunnid, tooLoppMinutid] = ajad.Toolopp.split(':');

  //kui aeg jääb lõuna sisse, siis paneme lõuna alguse aja
  if (hetkString > ajad.Lalgus && hetkString < ajad.Llopp) {
    return date.adjustDate(hetk, {
      hours: parseInt(lounAlgustunnid),
      minutes: parseInt(lounaAlgusminutid),
    });
  }
  //kontrollime et aeg jääks tööpäeva algusesse
  if (hetkString < ajad.Tooalgus) {
    return date.adjustDate(hetk, {
      hours: parseInt(tooAlgusTunnid),
      minutes: parseInt(tooAlgusMinutid),
    });
  }
  //kontrollime et aeg jääk tööpäeva lõppu
  if (hetkString > ajad.Toolopp) {
    return date.adjustDate(hetk, {
      hours: parseInt(tooLoppTunnid),
      minutes: parseInt(tooLoppMinutid),
    });
  }
  return hetk;
}

/* --------------------- Arvutan tehtud tööaja minutites -------------------- */
function tehtudAeg(start: string, ajad: TootajaAjad) {
  const tooStart = new Date(start);
  const tooAlgusTunnid = tooStart.getHours();
  const tooAlgusMinutid = tooStart.getMinutes();
  const tooAlgusMinutites = tooAlgusTunnid * 60 + tooAlgusMinutid;

  const stop = oigeAeg(ajad);
  const tooLoppTunnid = stop.getHours();
  const tooLoppMinutid = stop.getMinutes();
  const tooLoppMinutites = tooLoppTunnid * 60 + tooLoppMinutid;

  const lounaLoppMinutites = convertTimeToMinutes(ajad.Llopp);
  let tooAegKokku = Math.floor((stop.getTime() - tooStart.getTime()) / 60000);

  if (
    tooAlgusMinutites < lounaLoppMinutites &&
    tooLoppMinutites >= lounaLoppMinutites
  ) {
    tooAegKokku = tooAegKokku - 30;
  }
  return tooAegKokku;
}

/* ------------------- Muudan aja mssql datetime formaati ------------------ */
function tooLoppAeg(loppAeg: Date): string {
  const tzoffset = new Date().getTimezoneOffset() * 60000;
  const isoKpv = new Date(loppAeg.getTime() - tzoffset)
    .toISOString()
    .slice(0, 19);
  //const tooLoppTest = loppAeg.toISOString().slice(0, 19).replace('T', ' ');
  return isoKpv;
}

/* ------------------------ Muudan "HH:mm" minutiteks ----------------------- */
function convertTimeToMinutes(timeString: string) {
  // Split the string into hour and minute components
  const [hours, minutes] = timeString.split(':');
  // Convert hours to minutes
  const hoursInMinutes = parseInt(hours) * 60;
  // Combine hours and minutes into total minutes
  const totalMinutes = hoursInMinutes + parseInt(minutes);
  return totalMinutes;
}
