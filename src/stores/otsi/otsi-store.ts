import { defineStore } from 'pinia';
import axios from 'axios';
import { computed, ref } from 'vue';

import { LeitudTood, LeitudTegijad } from 'src/models/otsi/otsiModels';
import { error } from 'console';

export const useOtsiStore = defineStore('otsi', () => {
  const otsiText = ref('');
  const otsinguStaatus = ref('');
  const leitudTood = ref({} as LeitudTood);
  const leitudTegijad = ref([] as LeitudTegijad[]);
  //const groupedByKpv = ref({} as { [key: string]: LeitudTegijad[] });
  //const uniqTegijad = ref([] as LeitudTegijad[]);

  const loading = ref(false);
  const kesTegiLoading = ref(false);
  const foundCameras = ref([] as MediaDeviceInfo[]);

  //getters
  /* ------------------------ Leiame kordumatud tegijad ----------------------- */
  const uniqTegijad = computed(() => {
    return [
      ...new Map(
        leitudTegijad.value.map((item) => [item['nimi'], item])
      ).values(),
    ];
  });
  /* ------------------ Gruppeerime leitud töötajad kpv järgi ----------------- */
  const groupedByKpv = computed(() => {
    return leitudTegijad.value.reduce((acc, curr) => {
      const kpv = curr.kpv;
      if (!acc[kpv]) {
        acc[kpv] = [];
      }
      acc[kpv].push(curr);
      return acc;
    }, {} as { [key: string]: LeitudTegijad[] });
  });
  /* ------------------- Nullime eelmised otsingu tulemused ------------------- */
  const nulliKoik = () => {
    leitudTood.value = {} as LeitudTood;
    leitudTegijad.value = [];
  };
  //actions
  /* ------------------------- Leiame koodi järgi töö ------------------------- */
  const otsiKoodi = async () => {
    try {
      loading.value = true;
      otsinguStaatus.value = '';
      const params = { ribakood: otsiText.value };
      await axios
        .get<LeitudTood[]>('api/rkood/otsiRibakoodiUus', { params })
        .then((res) => {
          if (res.data.length) {
            leitudTood.value = res.data[0];
            otsinguStaatus.value = '1';
          } else otsinguStaatus.value = '0';
        });
    } catch (err) {
      console.error(err, 'Otsi koodi ERROR');
    } finally {
      loading.value = false;
    }
  };
  /* ------------------------ Leiame kes tegi seda tööd ----------------------- */
  const otsiKesTegi = async (JID: number) => {
    leitudTegijad.value = [];
    kesTegiLoading.value = true;
    try {
      await axios
        .get<LeitudTegijad[]>(`api/rkood/kestegiUus/${JID}`)
        .then((res) => {
          if (res.data.length) {
            leitudTegijad.value = res.data;
          }
        });
    } catch (err) {
      console.error(err, 'Otsi tegijaid error');
      kesTegiLoading.value = false;
    } finally {
      kesTegiLoading.value = false;
    }
  };

  return {
    otsiText,
    otsiKoodi,
    leitudTood,
    otsiKesTegi,
    leitudTegijad,
    groupedByKpv,
    uniqTegijad,
    nulliKoik,
    loading,
    kesTegiLoading,
    otsinguStaatus,
    foundCameras,
  };
});
