/* eslint-disable no-undef */
import axios from "axios";

const Api = axios.create({
	baseURL: process.env.VUE_APP_API_ENDPOINT || "http://localhost:3000/"
});

// Set the Authorization header using an interceptor

Api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});



export { Api };