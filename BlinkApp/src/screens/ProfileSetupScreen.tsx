// src/screens/ProfileSetupScreen.tsx

import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Geolocation from '@react-native-community/geolocation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { profileService } from '../services/profile.service';
import BackButton from '../components/BackButton';

type ProfileSetupScreenProps = NativeStackScreenProps<RootStackParamList, 'ProfileSetup'>;

const ProfileSetupScreen = ({ navigation }: ProfileSetupScreenProps) => {
  const [alias, setAlias] = useState('');
  const [aliasTag, setAliasTag] = useState('');
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const getLocation = () => {
    setLocationLoading(true);
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setLocationLoading(false);
        Alert.alert('Success', 'Location updated successfully! 📍');
      },
      (error) => {
        console.error('Location error:', error);
        setLocationLoading(false);
        Alert.alert('Error', 'Failed to get location. Please enable location services.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    // Auto-fetch location on mount
    getLocation();
  }, []);

  const handleSave = async () => {
    if (!alias.trim()) {
      Alert.alert('Error', 'Please enter your alias');
      return;
    }

    if (!aliasTag.trim()) {
      Alert.alert('Error', 'Please enter your alias tag');
      return;
    }

    if (!location) {
      Alert.alert('Error', 'Please update your location');
      return;
    }

    setLoading(true);
    try {
      await profileService.updateProfile({
        alias: alias.trim(),
        alias_tag: aliasTag.trim(),
        location_lat: location.lat,
        location_lon: location.lon,
      });

      Alert.alert('Success', 'Profile completed! 🎉', [
        {
          text: 'OK',
          onPress: () => navigation.reset({
            index: 0,
            routes: [{ name: 'Match' }],
          }),
        },
      ]);
    } catch (error: any) {
      console.error('Profile update error:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0F0F1E', '#1A1A2E', '#2C2C3E']} style={styles.gradient}>
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
            <View style={styles.container}>
              <View style={styles.headerContainer}>
                <Text style={styles.title}>Complete Your Profile</Text>
                <Text style={styles.subtitle}>Tell us about yourself to continue</Text>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Alias (Display Name)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your alias"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    value={alias}
                    onChangeText={setAlias}
                    maxLength={30}
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Alias Tag (Username)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="@username"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    value={aliasTag}
                    onChangeText={setAliasTag}
                    maxLength={20}
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Location</Text>
                  <View style={styles.locationContainer}>
                    <View style={styles.locationInfo}>
                      {location ? (
                        <>
                          <Text style={styles.locationText}>✓ Location Set</Text>
                          <Text style={styles.locationCoords}>
                            {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                          </Text>
                        </>
                      ) : (
                        <Text style={styles.locationText}>No location set</Text>
                      )}
                    </View>
                    <TouchableOpacity
                      style={styles.locationButton}
                      onPress={getLocation}
                      disabled={locationLoading}
                      activeOpacity={0.7}>
                      {locationLoading ? (
                        <ActivityIndicator color="#0F0F1E" size="small" />
                      ) : (
                        <Text style={styles.locationButtonText}>Update</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleSave}
                  disabled={loading}
                  activeOpacity={0.8}>
                  <LinearGradient
                    colors={['#00FFFF', '#00D4D4']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}>
                    {loading ? (
                      <ActivityIndicator color="#0F0F1E" />
                    ) : (
                      <Text style={styles.buttonText}>Complete Profile</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
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
    marginBottom: 40,
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
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  input: {
    width: '100%',
    height: 56,
    backgroundColor: 'rgba(44, 44, 62, 0.95)',
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 255, 0.3)',
    letterSpacing: 0.5,
    shadowColor: '#00FFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(44, 44, 62, 0.95)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 255, 0.3)',
    padding: 16,
    shadowColor: '#00FFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  locationInfo: {
    flex: 1,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  locationCoords: {
    fontSize: 12,
    color: 'rgba(0, 255, 255, 0.8)',
    fontWeight: '500',
  },
  locationButton: {
    backgroundColor: '#00FFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  locationButtonText: {
    color: '#0F0F1E',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    marginTop: 32,
    overflow: 'hidden',
    shadowColor: '#00FFFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F0F1E',
    letterSpacing: 0.5,
  },
});

export default ProfileSetupScreen;
