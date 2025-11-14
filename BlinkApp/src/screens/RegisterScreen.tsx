// src/screens/RegisterScreen.tsx

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../theme/colors';
import PhoneInput from 'react-native-phone-number-input';
import BackButton from '../components/BackButton';
import { useAuth } from '../context/AuthContext';

// React Navigation type'ları
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, 'Register'>;

const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const phoneInput = useRef<PhoneInput>(null);
  const { register } = useAuth();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleRegister = async () => {
    const checkValid = phoneInput.current?.isValidNumber(phoneNumber);
    if (!checkValid) {
      Alert.alert('Error', 'Please enter a valid phone number.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      await register(formattedPhoneNumber, password);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Match' }],
      });
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#0F0F1E', '#1A1A2E', '#2C2C3E']}
      style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <BackButton />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <Animated.View 
              style={[
                styles.container,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}>
              <View style={styles.headerContainer}>
                <Animated.View style={{ opacity: fadeAnim }}>
                  <Text style={styles.title}>Join the Signal</Text>
                  <View style={styles.glowLine} />
                </Animated.View>
                <Text style={styles.subtitle}>Create your anonymous account</Text>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Phone Number</Text>
                  <PhoneInput
                    ref={phoneInput}
                    defaultValue={phoneNumber}
                    defaultCode="TR"
                    layout="first"
                    onChangeText={(text) => setPhoneNumber(text)}
                    onChangeFormattedText={(text) => setFormattedPhoneNumber(text)}
                    withDarkTheme
                    containerStyle={styles.phoneInputContainer}
                    textInputStyle={styles.phoneInputText}
                    codeTextStyle={styles.phoneInputText}
                    textContainerStyle={styles.phoneInputTextContainer}
                    flagButtonStyle={styles.flagButton}
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Password</Text>
                  <View style={[
                    styles.inputContainer,
                    passwordFocused && styles.inputContainerFocused
                  ]}>
                    <TextInput
                      style={styles.inputField}
                      placeholder="Create a strong password (min 6 chars)"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      secureTextEntry
                      value={password}
                      onChangeText={setPassword}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                    />
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.button} 
                  onPress={handleRegister} 
                  activeOpacity={0.8}
                  disabled={isLoading}>
                  <Animated.View style={[
                    styles.buttonGlow,
                    {
                      opacity: glowAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.3, 0.8],
                      }),
                    },
                  ]} />
                  <LinearGradient
                    colors={['#00FFFF', '#00D4D4', '#00FFD4']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.buttonGradient}>
                    {isLoading ? (
                      <ActivityIndicator color="#0F0F1E" size="small" />
                    ) : (
                      <Text style={styles.buttonText}>🚀 Create Account</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 80,
    paddingBottom: 30,
  },
  headerContainer: {
    marginBottom: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: Colors.text,
    marginBottom: 16,
    letterSpacing: 1,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  glowLine: {
    width: 80,
    height: 4,
    backgroundColor: '#00FFFF',
    borderRadius: 2,
    marginTop: 8,
    alignSelf: 'center',
    shadowColor: '#00FFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.placeholder,
    lineHeight: 24,
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 12,
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 28,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
    letterSpacing: 1,
  },
  phoneInputContainer: {
    width: '100%',
    height: 60,
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 255, 0.3)',
    shadowColor: '#00FFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  phoneInputTextContainer: {
    backgroundColor: 'transparent',
    borderRadius: 18,
    paddingVertical: 4,
  },
  phoneInputText: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  flagButton: {
    backgroundColor: 'rgba(0, 255, 255, 0.15)',
    borderRadius: 14,
    marginLeft: 10,
    paddingHorizontal: 6,
    shadowColor: '#00FFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  inputContainer: {
    width: '100%',
    height: 60,
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 255, 0.25)',
    shadowColor: '#00FFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  inputContainerFocused: {
    borderColor: 'rgba(0, 255, 255, 0.8)',
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
    backgroundColor: 'rgba(26, 26, 46, 1)',
  },
  inputField: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 20,
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    letterSpacing: 0.5,
  },
  button: {
    width: '100%',
    height: 62,
    borderRadius: 18,
    marginTop: 40,
    overflow: 'visible',
    position: 'relative',
  },
  buttonGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    backgroundColor: '#00FFFF',
    borderRadius: 25,
    zIndex: -1,
    shadowColor: '#00FFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 20,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  buttonText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F0F1E',
    letterSpacing: 1.5,
  },
});

export default RegisterScreen;