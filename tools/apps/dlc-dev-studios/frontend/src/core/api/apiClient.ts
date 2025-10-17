import axios from 'axios';
import { ENV } from '../config/env';

export const apiClient = axios.create({
  baseURL: ENV.API_URL,
  timeout: ENV.API_TIMEOUT,
});

apiClient.interceptors.response.use(
  res => res,
  err => {
    console.error('[API ERROR]', err.response?.data || err.message);
    throw err;
  }
);
