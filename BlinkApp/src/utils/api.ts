// Auth endpoints
async register(data: { phone: string; password: string }) {
  const response = await this.api.post('/auth/register', data);
  return response.data;
}

async login(data: { phone: string; password: string }) {
  const response = await this.api.post('/auth/login', data);
  if (response.data.accessToken) {
    await AsyncStorage.setItem('accessToken', response.data.accessToken);
    await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
    if (response.data.user) {
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }
  }
  return response.data;
}