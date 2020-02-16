import axios from 'axios';
import store from './store';
import config from './config';

// Add a request interceptor

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (reqConfig) => {
    const token = store.getState().auth.access;

    if (token) {
      reqConfig.headers['Authorization'] = 'Token ' + token; // change Token or Bearer for Auth to  Fetch with JWT
    }
    reqConfig.headers['Content-Type'] = 'application/json';
    return reqConfig;
  },
  (error) => {
    Promise.reject(error);
  }
);

//Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  function(error) {
    const originalRequest = error.config;

    if (error.response.status === 401) {
      originalRequest._retry = true;
      const refreshToken = store.getState().auth.refresh;
      axiosInstance
        .post(config.refresh, {
          refresh: refreshToken,
        })
        .then((res) => {
          if (res.status === 200) {
            store.dispatch.auth.initLogin(res.data);
            axiosInstance.defaults.headers.common['Authorization'] =
              'Token ' + store.getState().auth.access; //  change Token or Bearer for Auth to  Fetch with JWT
            return axiosInstance(originalRequest);
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            store.dispatch.auth.logout();
            return Promise.reject(error);
          }
        });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
