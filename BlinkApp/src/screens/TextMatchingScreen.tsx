import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import BackButton from '../components/BackButton';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { Theme } from '../theme/theme';
import GlassView from '../components/GlassView';
import StandardButton from '../components/StandardButton';

type TextMatchingScreenProps = NativeStackScreenProps<RootStackParamList, 'TextMatching'>;

const TextMatchingScreen = ({ navigation }: TextMatchingScreenProps) => {
  const { user } = useAuth();
  const [isSearching, setIsSearching] = useState(false);
  const [timer, setTimer] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  const socketRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://10.0.2.2:3000');

    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current.id);
    });

    socketRef.current.on('waiting_in_pool', (data: any) => {
      setStatusMessage(data.message);
    });

    socketRef.current.on('match_found', (data: any) => {
      console.log('Match found:', data);
      stopSearch();
      navigation.navigate('Chat', { matchId: data.matchId });
    });

    socketRef.current.on('no_match_found', (data: any) => {
      setStatusMessage(data.message);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      stopSearch();
    };
  }, []);

  const startAnimations = () => {
    // Pulse Animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();

    // Rotate Animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  };

  const stopAnimations = () => {
    pulseAnim.setValue(1);
    rotateAnim.setValue(0);
  };

  const stopSearch = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSearching(false);
    stopAnimations();
  };

  const handleStartMatch = () => {
    if (!user?.id) {
      Alert.alert('Error', 'User ID not found');
      return;
    }

    setIsSearching(true);
    setTimer(0);
    setStatusMessage('Scanning for matches...');
    startAnimations();

    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    socketRef.current.emit('join_pool', { userId: user.id });
  };

  const handleCancelMatch = () => {
    stopSearch();
    setStatusMessage('');
    socketRef.current.disconnect();
    socketRef.current.connect();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient colors={Theme.gradients.background} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <BackButton />

        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Message Match</Text>
            <Text style={styles.subtitle}>Connect anonymously through text</Text>
          </View>

          <View style={styles.contentContainer}>
            {!isSearching ? (
              <>
                <GlassView style={styles.infoBox} intensity="light">
                  <Text style={styles.infoText}>
                    Start matching to find someone to chat with. Your identity remains anonymous.
                  </Text>
                </GlassView>

                <View style={styles.buttonWrapper}>
                  <StandardButton
                    title="START MATCH"
                    onPress={handleStartMatch}
                    style={styles.startButton}
                    textStyle={styles.startButtonText}
                  />
                </View>
              </>
            ) : (
              <View style={styles.searchingContainer}>
                <View style={styles.radarContainer}>
                  <Animated.View style={[
                    styles.radarCircle,
                    { transform: [{ scale: pulseAnim }] }
                  ]} />
                  <Animated.View style={[
                    styles.radarSpinner,
                    { transform: [{ rotate: spin }] }
                  ]} />
                  <View style={styles.timerWrapper}>
                    <Text style={styles.timerText}>{formatTime(timer)}</Text>
                  </View>
                </View>

                <Text style={styles.statusText}>{statusMessage}</Text>

                <StandardButton
                  title="Cancel Search"
                  onPress={handleCancelMatch}
                  variant="danger"
                  style={styles.cancelButton}
                />
              </View>
            )}
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
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  headerContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    ...Theme.typography.h1,
    color: Theme.colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    ...Theme.typography.body,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80, // Add padding to lift content up
  },
  infoBox: {
    padding: 24,
    marginBottom: 48,
    width: '100%',
  },
  infoText: {
    ...Theme.typography.body,
    color: Theme.colors.text,
    textAlign: 'center',
  },
  buttonWrapper: {
    width: '100%',
    paddingHorizontal: 20,
  },
  startButton: {
    height: 64,
    borderRadius: 32,
  },
  startButtonText: {
    fontSize: 20,
    letterSpacing: 2,
  },
  searchingContainer: {
    alignItems: 'center',
    width: '100%',
  },
  radarContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
  },
  radarCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 255, 0.3)',
  },
  radarSpinner: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopColor: Theme.colors.primary,
    borderRightColor: 'rgba(0, 255, 255, 0.5)',
  },
  timerWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 40,
    fontWeight: '700',
    color: Theme.colors.primary,
    fontVariant: ['tabular-nums'],
    textShadowColor: Theme.colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  statusText: {
    ...Theme.typography.h3,
    color: Theme.colors.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
  },
  cancelButton: {
    width: 200,
  },
});

export default TextMatchingScreen;
