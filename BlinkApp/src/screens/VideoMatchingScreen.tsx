// src/screens/VideoMatchingScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import BackButton from '../components/BackButton';

type VideoMatchingScreenProps = NativeStackScreenProps<RootStackParamList, 'VideoMatching'>;

const VideoMatchingScreen = ({ navigation }: VideoMatchingScreenProps) => {
  const handleStartMatch = () => {
    // TODO: Implement video matching logic
    console.log('Starting video match...');
  };

  return (
    <LinearGradient colors={['#0F0F1E', '#1A1A2E', '#2C2C3E']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <BackButton />
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Video Match</Text>
            <Text style={styles.subtitle}>Face-to-face anonymous connection</Text>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Start video matching to meet someone face-to-face. Camera permission required.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartMatch}
              activeOpacity={0.8}>
              <LinearGradient
                colors={['#FF00FF', '#D400D4']}
                style={styles.startButtonGradient}>
                <Text style={styles.startButtonText}>START MATCH</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 80,
  },
  headerContainer: {
    marginBottom: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 24,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: {
    backgroundColor: 'rgba(44, 44, 62, 0.8)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 60,
    borderWidth: 2,
    borderColor: 'rgba(255, 0, 255, 0.3)',
  },
  infoText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  startButton: {
    width: 250,
    height: 250,
    borderRadius: 125,
    overflow: 'hidden',
    shadowColor: '#FF00FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  startButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
});

export default VideoMatchingScreen;
