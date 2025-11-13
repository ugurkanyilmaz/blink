import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

/**
 * Root Stack Navigation Types
 * Tüm ana navigation ekranlarının parametre listesi
 */
export type RootStackParamList = {
  Welcome: undefined;
  Register: undefined;
  Login: undefined;
  Home: undefined;
};

/**
 * Navigation prop helper types
 */
export type RootStackNavigationProps<T extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>;

/**
 * Screen props helper type
 */
export type ScreenProps<T extends keyof RootStackParamList> = {
  navigation: RootStackNavigationProps<T>;
};
