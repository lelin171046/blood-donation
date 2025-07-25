import { useEffect } from 'react';
import axios from 'axios';

const axiosSecure = axios.create({
  // baseURL: 'http://localhost:5001', // adjust if needed
  baseURL: 'https://blood-donation-server-steel.vercel.app', // adjust if needed
});

// Add interceptor to attach token
axiosSecure.interceptors.request.use((config) => {
  const token = localStorage.getItem('access-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const useAxiosSecure = () => {
  return axiosSecure;
};

export default useAxiosSecure;
