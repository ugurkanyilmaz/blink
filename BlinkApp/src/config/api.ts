// src/config/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Backend URL - geliştirme için localhost
// Production'da bu URL değiştirilecek
export const API_BASE_URL = __DEV__ 
  ? 'http://10.0.2.2:3000/api' // Android emulator için
  : 'https://your-production-api.com/api';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - her istekte token ekle
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error reading token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - token yenileme için
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Token expired ve henüz retry yapılmadıysa
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;

          // Yeni token'ları kaydet
          await AsyncStorage.setItem('accessToken', accessToken);
          await AsyncStorage.setItem('refreshToken', newRefreshToken);

          // Orjinal isteği yeni token ile tekrarla
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token da geçersizse logout yap
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
        // Navigation'ı burada yapamayız, bu yüzden error fırlatıyoruz
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
