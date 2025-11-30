// src/screens/ProfileSetupScreen.tsx

import React, { useState, useEffect, useRef } from 'react';
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
import { Theme } from '../theme/theme';
import GlassView from '../components/GlassView';
import StandardButton from '../components/StandardButton';

type ProfileSetupScreenProps = NativeStackScreenProps<RootStackParamList, 'ProfileSetup'>;

const ProfileSetupScreen = ({ navigation }: ProfileSetupScreenProps) => {
  const [alias, setAlias] = useState('');
  const [aliasTag, setAliasTag] = useState('');

  // Date state
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  // Refs for auto-focusing next input
  const monthRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);

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

  const handleDateChange = (text: string, type: 'day' | 'month' | 'year') => {
    if (type === 'day') {
      setDay(text);
      if (text.length === 2) monthRef.current?.focus();
    } else if (type === 'month') {
      setMonth(text);
      if (text.length === 2) yearRef.current?.focus();
    } else {
      setYear(text);
    }
  };

  const handleSave = async () => {
    if (!alias.trim()) {
      Alert.alert('Error', 'Please enter your alias');
      return;
    }

    if (!aliasTag.trim()) {
      Alert.alert('Error', 'Please enter your alias tag');
      return;
    }

    // Validate Date
    if (!day || !month || !year) {
      Alert.alert('Error', 'Please enter your full birth date');
      return;
    }

    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (
      isNaN(dayNum) || dayNum < 1 || dayNum > 31 ||
      isNaN(monthNum) || monthNum < 1 || monthNum > 12 ||
      isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear()
    ) {
      Alert.alert('Error', 'Please enter a valid date');
      return;
    }

    // Format to YYYY-MM-DD
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

    if (!location) {
      Alert.alert('Error', 'Please update your location');
      return;
    }

    setLoading(true);
    try {
      await profileService.updateProfile({
        alias: alias.trim(),
        alias_tag: aliasTag.trim(),
        birthDate: formattedDate,
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
    <LinearGradient colors={Theme.gradients.background} style={styles.gradient}>
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
                  <GlassView intensity="light" style={styles.inputGlass} noBorder>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your alias"
                      placeholderTextColor={Theme.colors.textTertiary}
                      value={alias}
                      onChangeText={setAlias}
                      maxLength={30}
                    />
                  </GlassView>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Alias Tag (Username)</Text>
                  <GlassView intensity="light" style={styles.inputGlass} noBorder>
                    <TextInput
                      style={styles.input}
                      placeholder="@username"
                      placeholderTextColor={Theme.colors.textTertiary}
                      value={aliasTag}
                      onChangeText={setAliasTag}
                      maxLength={20}
                      autoCapitalize="none"
                    />
                  </GlassView>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Birth Date</Text>
                  <View style={styles.dateContainer}>
                    <GlassView intensity="light" style={styles.dateInputGlass} noBorder>
                      <TextInput
                        style={styles.dateInput}
                        placeholder="DD"
                        placeholderTextColor={Theme.colors.textTertiary}
                        value={day}
                        onChangeText={(t) => handleDateChange(t, 'day')}
                        maxLength={2}
                        keyboardType="numeric"
                        textAlign="center"
                      />
                    </GlassView>
                    <GlassView intensity="light" style={styles.dateInputGlass} noBorder>
                      <TextInput
                        ref={monthRef}
                        style={styles.dateInput}
                        placeholder="MM"
                        placeholderTextColor={Theme.colors.textTertiary}
                        value={month}
                        onChangeText={(t) => handleDateChange(t, 'month')}
                        maxLength={2}
                        keyboardType="numeric"
                        textAlign="center"
                      />
                    </GlassView>
                    <GlassView intensity="light" style={[styles.dateInputGlass, { flex: 1.5 }]} noBorder>
                      <TextInput
                        ref={yearRef}
                        style={styles.dateInput}
                        placeholder="YYYY"
                        placeholderTextColor={Theme.colors.textTertiary}
                        value={year}
                        onChangeText={(t) => handleDateChange(t, 'year')}
                        maxLength={4}
                        keyboardType="numeric"
                        textAlign="center"
                      />
                    </GlassView>
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Location</Text>
                  <GlassView intensity="light" style={styles.locationContainer}>
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
                    <StandardButton
                      title={locationLoading ? "" : "Update"}
                      onPress={getLocation}
                      loading={locationLoading}
                      variant="primary"
                      style={styles.locationButton}
                      textStyle={{ fontSize: 14 }}
                    />
                  </GlassView>
                </View>

                <StandardButton
                  title="Complete Profile"
                  onPress={handleSave}
                  loading={loading}
                  style={styles.submitButton}
                />
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
    ...Theme.typography.h1,
    color: Theme.colors.text,
    marginBottom: 12,
  },
  subtitle: {
    ...Theme.typography.body,
    color: Theme.colors.textSecondary,
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 24,
  },
  label: {
    ...Theme.typography.caption,
    color: Theme.colors.text,
    marginBottom: 10,
  },
  inputGlass: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  input: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 20,
    fontSize: 16,
    color: Theme.colors.text,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  dateInputGlass: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  dateInput: {
    width: '100%',
    height: '100%',
    fontSize: 18,
    color: Theme.colors.text,
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  locationInfo: {
    flex: 1,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: 4,
  },
  locationCoords: {
    fontSize: 12,
    color: Theme.colors.primary,
    fontWeight: '500',
  },
  locationButton: {
    height: 40,
    width: 100,
  },
  submitButton: {
    marginTop: 32,
  },
});

export default ProfileSetupScreen;
