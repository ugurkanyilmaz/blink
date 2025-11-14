// App.tsx
import 'react-native-gesture-handler';

import React, { useEffect } from 'react';
import { StatusBar, View, BackHandler, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MatchScreen from './src/screens/MatchScreen';
import ProfileSetupScreen from './src/screens/ProfileSetupScreen';
import TextMatchingScreen from './src/screens/TextMatchingScreen';
import VideoMatchingScreen from './src/screens/VideoMatchingScreen';
import { Colors } from './src/theme/colors';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import BottomNav from './src/components/BottomNav';

// Stack Navigator'ımızın ekranlarını ve alabilecekleri parametreleri tanımlayalım
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Match: undefined;
  ProfileSetup: undefined;
  TextMatching: undefined;
  VideoMatching: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const backAction = () => {
        Alert.alert('Exit App', 'Are you sure you want to exit?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => backHandler.remove();
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'Match' : 'Welcome'}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          gestureEnabled: false,
        }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Match" component={MatchScreen} />
            <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
            <Stack.Screen name="TextMatching" component={TextMatchingScreen} />
            <Stack.Screen name="VideoMatching" component={VideoMatchingScreen} />
          </>
        )}
      </Stack.Navigator>
      {isAuthenticated && <BottomNav />}
    </View>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;