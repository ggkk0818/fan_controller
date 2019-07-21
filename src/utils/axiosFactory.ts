import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from "axios";

declare class ResponseData {
  code?: number;
  message?: string;
  body?: any;
}

const requestInterceptor = (config: Object) => {
  return config;
};
const responseSuccess = (response: AxiosResponse) => {
  if (typeof response.data !== "object") {
    return response.data;
  }
  const res = <ResponseData>response.data;
  const hasCode = res && res.hasOwnProperty("code");
  const code = hasCode ? res.code : response.status;
  switch (code) {
    case 200:
    case 201:
      return hasCode ? res.body : res;
    case 401:
    case 402:
      return Promise.reject(new Error(res.message || "Permission Denied"));
    default:
      return Promise.reject(new Error(res.message || "Unknown Error"));
  }
};
const responseError = (error: AxiosError) => {
  if (!axios.isCancel(error)) {
    console.warn(error);
  }
  return Promise.reject(error);
};

axios.defaults.timeout = 10000;
axios.interceptors.request.use(requestInterceptor);
axios.interceptors.response.use(responseSuccess, responseError);

export default {
  getInstance(config?: AxiosRequestConfig) {
    const instance = axios.create(config);
    instance.interceptors.request.use(requestInterceptor);
    instance.interceptors.response.use(responseSuccess, responseError);
    return instance;
  }
};
