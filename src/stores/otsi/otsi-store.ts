import { defineStore } from 'pinia';
import axios from 'axios';
import { computed, ref } from 'vue';

import { LeitudTood, LeitudTegijad } from 'src/models/otsi/otsiModels';
import { error } from 'console';

export const useOtsiStore = defineStore('otsi', () => {
  const otsiText = ref('');
  const otsinguStaatus = ref('');
  const leitudTood = ref<LeitudTood[]>([]);
  const leitudTegijad = ref([] as LeitudTegijad[]);
  const groupedByKpv = ref({} as { [key: string]: LeitudTegijad[] });

  const loading = ref(false);
  const kesTegiLoading = ref(false);

  //getters
  //const doubleCount = computed(() => count.value * 2) //getters asemel
  const leitudTegiajadNimed = computed(() => {
    return [
      ...new Map(
        leitudTegijad.value.map((item) => [item['TID'], item])
      ).values(),
    ];
  });

  const nulliKoik = () => {
    leitudTegijad.value = [];
    leitudTood.value = [];
    groupedByKpv.value = {};
  };
  //actions
  const otsiKoodi = async () => {
    try {
      loading.value = true;
      otsinguStaatus.value = '';
      const params = { ribakood: otsiText.value };
      await axios
        .get<LeitudTood[]>('api/rkood/otsiRibakoodiUus', { params })
        .then((res) => {
          if (res.data.length) {
            otsinguStaatus.value = '1';
            leitudTood.value = res.data;
          } else otsinguStaatus.value = '0';
        });
    } catch (err) {
      console.error(err, 'Otsi koodi ERROR');
    } finally {
      loading.value = false;
    }
  };

  const otsiKesTegi = async (JID: number) => {
    leitudTegijad.value = [];
    try {
      kesTegiLoading.value = true;
      await axios
        .get<LeitudTegijad[]>(`api/rkood/kestegiUus/${JID}`)
        .then((res) => {
          if (res.data.length) {
            leitudTegijad.value = res.data;
            groupedByKpv.value = leitudTegijad.value.reduce((acc, curr) => {
              const kpv = curr.kpv;
              if (!acc[kpv]) {
                acc[kpv] = [];
              }
              acc[kpv].push(curr);
              return acc;
            }, {} as { [key: string]: LeitudTegijad[] });
          }
        });
    } catch (err) {
      console.error(err, 'Otsi tegijaid error');
      kesTegiLoading.value = false;
    } finally {
      kesTegiLoading.value = false;
    }
  };

  const filterTegija = (tid: number) => {
    return leitudTegiajadNimed.value.filter((obj) => obj.TID === tid);
  };

  return {
    otsiText,
    otsiKoodi,
    leitudTood,
    otsiKesTegi,
    leitudTegijad,
    leitudTegiajadNimed,
    filterTegija,
    groupedByKpv,
    nulliKoik,
    loading,
    kesTegiLoading,
    otsinguStaatus,
  };
});
