import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { Notify } from 'quasar';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({});
api.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

//Käime läbi kõik päringud baasi:
axios.interceptors.request.use(
  (config) => {
    console.log(
      `%c[REQUEST] sent -> ${config.url}`,
      'color: blue; font-weight: bold;',
      config
    );
    return config;
  },
  (error) => {
    console.error(
      `%c[REQUEST] error -> ${error.config.url}`,
      'color: red; font-weight: bold;',
      error.message || error
    );
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    console.log(
      `%c[RESPONSE] received -> ${response.config.url}`,
      'color: green; font-weight: bold;',
      response.data
    );
    return response;
  },
  (err) => {
    console.log(
      `%c[RESPONSE] error -> ${err.config.url}`,
      'color: red; font-weight: bold;',
      err.response.data.message || err.response
    );
    Notify.create({
      type: 'negative',
      caption: 'ERROR',
      message: 'Error!!!',
      // message: err.response.data.message || err.response.data,
      actions: [{ icon: 'close', color: 'white' }],
    });
    return Promise.reject(err);
  }
);

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
