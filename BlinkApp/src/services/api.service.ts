import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl, API_CONFIG } from '../config/api.config';

// API Types
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  phone: string;
  name?: string;
  birthDate?: string;
  gender?: string;
  profilePicture?: string;
  createdAt: string;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface RegisterRequest {
  phone: string;
  password: string;
}

// Storage Keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: '@blink_access_token',
  REFRESH_TOKEN: '@blink_refresh_token',
  USER: '@blink_user',
};

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: getApiUrl(),
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - token ekleme
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - token yenileme
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
            if (refreshToken) {
              const response = await axios.post(`${getApiUrl()}/auth/refresh`, {
                refreshToken,
              });

              const { accessToken } = response.data;
              await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);

              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Token yenilenemiyor, logout yap
            await this.logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth Methods
  async register(phone: string, password: string): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/register', {
        phone,
        password,
      });

      const { accessToken, refreshToken, user } = response.data;
      await this.saveTokens(accessToken, refreshToken);
      await this.saveUser(user);

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async login(phone: string, password: string): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/login', {
        phone,
        password,
      });

      const { accessToken, refreshToken, user } = response.data;
      await this.saveTokens(accessToken, refreshToken);
      await this.saveUser(user);

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (refreshToken) {
        await this.api.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await this.clearStorage();
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    return !!token;
  }

  // Private Methods
  private async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.ACCESS_TOKEN, accessToken],
      [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
    ]);
  }

  private async saveUser(user: User): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  private async clearStorage(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER,
    ]);
  }

  private handleError(error: any): Error {
    if (error.response) {
      // Backend'den gelen hata
      const message = error.response.data?.error || 'Bir hata oluştu';
      return new Error(message);
    } else if (error.request) {
      // İstek gönderildi ama cevap yok
      return new Error('Sunucuya bağlanılamıyor. İnternet bağlantınızı kontrol edin.');
    } else {
      // Başka bir hata
      return new Error(error.message || 'Beklenmeyen bir hata oluştu');
    }
  }

  // API instance'ı dışarıya aç (diğer servisler için)
  getApi(): AxiosInstance {
    return this.api;
  }
}

// Singleton instance
export const apiService = new ApiService();
export default apiService;
