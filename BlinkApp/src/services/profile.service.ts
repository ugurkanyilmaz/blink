// src/services/profile.service.ts

import api from '../config/api';

export interface Profile {
  id: string;
  phone: string;
  alias: string | null;
  alias_tag: string | null;
  location_lat: number | null;
  location_lon: number | null;
  completed: boolean;
  createdAt: string;
}

export interface UpdateProfileData {
  alias: string;
  alias_tag: string;
  location_lat: number;
  location_lon: number;
}

export const profileService = {
  getProfile: async (): Promise<Profile> => {
    const response = await api.get('/profile');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData): Promise<Profile> => {
    const response = await api.put('/profile', data);
    return response.data;
  },
};
