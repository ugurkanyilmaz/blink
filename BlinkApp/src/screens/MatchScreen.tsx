// src/screens/MatchScreen.tsx

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { profileService } from '../services/profile.service';
import BackButton from '../components/BackButton';

type MatchScreenProps = NativeStackScreenProps<RootStackParamList, 'Match'>;

const MatchScreen = ({ navigation }: MatchScreenProps) => {
  const [loading, setLoading] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  
  const mainButtonScale = useRef(new Animated.Value(1)).current;
  const mainButtonOpacity = useRef(new Animated.Value(1)).current;
  const optionsOpacity = useRef(new Animated.Value(0)).current;
  const optionsTranslateY = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    checkProfileCompletion();
  }, []);

  const checkProfileCompletion = async () => {
    try {
      const profile = await profileService.getProfile();
      
      if (!profile.completed) {
        navigation.replace('ProfileSetup');
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to check profile:', error);
      setLoading(false);
    }
  };

  const handleMainButtonPress = () => {
    Animated.parallel([
      Animated.timing(mainButtonOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(mainButtonScale, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowOptions(true);
      Animated.parallel([
        Animated.timing(optionsOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(optionsTranslateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  if (loading) {
    return (
      <LinearGradient colors={['#0F0F1E', '#1A1A2E', '#2C2C3E']} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00FFFF" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0F0F1E', '#1A1A2E', '#2C2C3E']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <BackButton />
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Blink</Text>
            <Text style={styles.subtitle}>Find your connection</Text>
          </View>

          {!showOptions ? (
            <Animated.View 
              style={[
                styles.mainButtonContainer,
                {
                  opacity: mainButtonOpacity,
                  transform: [{ scale: mainButtonScale }],
                },
              ]}>
              <TouchableOpacity
                style={styles.mainButton}
                onPress={handleMainButtonPress}
                activeOpacity={0.9}>
                <LinearGradient
                  colors={['#00FFFF', '#00D4D4', '#00A8A8']}
                  style={styles.mainButtonGradient}>
                  <Text style={styles.mainButtonText}>MATCH</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <Animated.View 
              style={[
                styles.optionsContainer,
                {
                  opacity: optionsOpacity,
                  transform: [{ translateY: optionsTranslateY }],
                },
              ]}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => navigation.navigate('TextMatching')}
                activeOpacity={0.8}>
                <LinearGradient
                  colors={['#00FFFF', '#00D4D4']}
                  style={styles.optionGradient}>
                  <Text style={styles.optionTitle}>Message Match</Text>
                  <Text style={styles.optionSubtitle}>Connect through text</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => navigation.navigate('VideoMatching')}
                activeOpacity={0.8}>
                <LinearGradient
                  colors={['#FF00FF', '#D400D4']}
                  style={styles.optionGradient}>
                  <Text style={styles.optionTitle}>Video Match</Text>
                  <Text style={styles.optionSubtitle}>Face-to-face connection</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  headerContainer: {
    position: 'absolute',
    top: 80,
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 1,
  },
  mainButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
    shadowColor: '#00FFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  mainButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainButtonText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F0F1E',
    letterSpacing: 2,
  },
  optionsContainer: {
    width: '100%',
    gap: 20,
  },
  optionButton: {
    width: '100%',
    height: 120,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#00FFFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  optionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  optionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  optionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 0.3,
  },
});

export default MatchScreen;
