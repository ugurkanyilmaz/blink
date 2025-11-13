import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  // Token işlemleri
  async setAccessToken(token: string) {
    await AsyncStorage.setItem('accessToken', token);
  },

  async getAccessToken() {
    return await AsyncStorage.getItem('accessToken');
  },

  async setRefreshToken(token: string) {
    await AsyncStorage.setItem('refreshToken', token);
  },

  async getRefreshToken() {
    return await AsyncStorage.getItem('refreshToken');
  },

  // User işlemleri
  async setUser(user: any) {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  },

  async getUser() {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Temizleme
  async clearAuth() {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
  },

  async clearAll() {
    await AsyncStorage.clear();
  },
};
