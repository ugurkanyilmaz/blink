import { Platform } from 'react-native';

// API Configuration
export const API_CONFIG = {
  // Development URL for Android Emulator connecting to Docker
  ANDROID_EMULATOR_URL: 'http://10.0.2.2:3000/api',
  
  // Development URL for iOS Simulator
  IOS_SIMULATOR_URL: 'http://localhost:3000/api',
  
  // For testing on real device, replace with your computer's IP
  // Find your IP: ipconfig (Windows) or ifconfig (Mac/Linux)
  REAL_DEVICE_URL: 'http://192.168.1.100:3000/api', // CHANGE THIS to your IP
  
  // Production URL (deploy sonrası değiştir)
  PRODUCTION_URL: 'https://your-production-url.com/api',
  
  // Request timeout (ms)
  TIMEOUT: 10000,
};

// Current environment
export const IS_ANDROID = Platform.OS === 'android';
export const IS_IOS = Platform.OS === 'ios';
export const IS_DEV = __DEV__;

// Get appropriate API URL based on environment
export const getApiUrl = (): string => {
  if (!IS_DEV) {
    return API_CONFIG.PRODUCTION_URL;
  }
  
  if (IS_ANDROID) {
    return API_CONFIG.ANDROID_EMULATOR_URL;
  }
  
  return API_CONFIG.IOS_SIMULATOR_URL;
};

