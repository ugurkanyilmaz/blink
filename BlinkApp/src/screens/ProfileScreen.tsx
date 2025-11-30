import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { profileService, Profile } from '../services/profile.service';
import Geolocation from '@react-native-community/geolocation';
import { Theme } from '../theme/theme';
import GlassView from '../components/GlassView';
import StandardButton from '../components/StandardButton';

type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedAlias, setEditedAlias] = useState('');
  const [editedAliasTag, setEditedAliasTag] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    try {
      // Only set loading true if we don't have a profile yet, 
      // otherwise just refresh silently or show a small indicator if needed.
      // For now, we'll keep it simple but maybe avoid full screen loader if profile exists.
      if (!profile) setLoading(true);

      const data = await profileService.getProfile();
      setProfile(data);
      setEditedAlias(data.alias || '');
      setEditedAliasTag(data.alias_tag || '');
    } catch (error) {
      console.error('Failed to load profile:', error);
      // Don't alert on every focus if it fails, maybe just log it
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLocation = () => {
    setLocationLoading(true);
    Geolocation.getCurrentPosition(
      async (position) => {
        try {
          await profileService.updateProfile({
            location_lat: position.coords.latitude,
            location_lon: position.coords.longitude,
          });
          setLocationLoading(false);
          Alert.alert('Success', 'Location updated! 📍');
          loadProfile();
        } catch (error) {
          setLocationLoading(false);
          Alert.alert('Error', 'Failed to update location');
        }
      },
      (error) => {
        console.error('Location error:', error);
        setLocationLoading(false);
        Alert.alert('Error', 'Failed to get location. Please enable location services.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleSaveProfile = async () => {
    if (!editedAlias.trim() || !editedAliasTag.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await profileService.updateProfile({
        alias: editedAlias.trim(),
        alias_tag: editedAliasTag.trim(),
      });
      Alert.alert('Success', 'Profile updated! ✨');
      setEditMode(false);
      loadProfile();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <LinearGradient colors={Theme.gradients.background} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={Theme.gradients.background} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}>
          <Icon name="settings-outline" size={24} color={Theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>

        {/* Subscription Card (Mock) */}
        <GlassView intensity="dark" style={styles.subscriptionCard}>
          <LinearGradient colors={Theme.gradients.secondary} style={styles.premiumBadge}>
            <Text style={styles.premiumText}>PREMIUM</Text>
          </LinearGradient>
          <Text style={styles.subscriptionTitle}>Unlock Full Access</Text>
          <Text style={styles.subscriptionSubtitle}>Get unlimited matches and see who likes you.</Text>
          <StandardButton
            title="UPGRADE NOW"
            onPress={() => Alert.alert('Coming Soon', 'Subscriptions are coming soon!')}
            variant="secondary"
            style={styles.upgradeButton}
          />
        </GlassView>

        {/* Profile Info Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            {!editMode && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setEditMode(true)}>
                <Icon name="pencil" size={16} color={Theme.colors.primary} />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          <GlassView intensity="light" style={styles.infoCard}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Alias</Text>
              {editMode ? (
                <TextInput
                  style={styles.input}
                  value={editedAlias}
                  onChangeText={setEditedAlias}
                  placeholder="Enter your alias"
                  placeholderTextColor={Theme.colors.textTertiary}
                />
              ) : (
                <Text style={styles.value}>{profile?.alias || 'Not set'}</Text>
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Alias Tag</Text>
              {editMode ? (
                <TextInput
                  style={styles.input}
                  value={editedAliasTag}
                  onChangeText={setEditedAliasTag}
                  placeholder="Enter your alias tag"
                  placeholderTextColor={Theme.colors.textTertiary}
                />
              ) : (
                <Text style={styles.value}>{profile?.alias_tag || 'Not set'}</Text>
              )}
            </View>
          </GlassView>

          {editMode && (
            <View style={styles.editActions}>
              <StandardButton
                title="Cancel"
                onPress={() => {
                  setEditMode(false);
                  setEditedAlias(profile?.alias || '');
                  setEditedAliasTag(profile?.alias_tag || '');
                }}
                variant="outline"
                style={styles.actionButton}
              />
              <StandardButton
                title="Save Changes"
                onPress={handleSaveProfile}
                loading={loading}
                style={styles.actionButton}
              />
            </View>
          )}
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <GlassView intensity="light" style={styles.locationCard}>
            <View style={styles.locationInfo}>
              <Icon name="location" size={24} color={Theme.colors.primary} />
              <View style={styles.locationText}>
                <Text style={styles.locationLabel}>Current Location</Text>
                <Text style={styles.locationCoords}>
                  {profile?.location_lat?.toFixed(4)}, {profile?.location_lon?.toFixed(4)}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.updateLocationButton}
              onPress={handleUpdateLocation}
              disabled={locationLoading}>
              {locationLoading ? (
                <ActivityIndicator size="small" color="#0F0F1E" />
              ) : (
                <Icon name="refresh" size={20} color="#0F0F1E" />
              )}
            </TouchableOpacity>
          </GlassView>
        </View>

        {/* Status Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Status</Text>
          <GlassView intensity="light" style={styles.statusCard}>
            <Icon
              name={profile?.is_profile_completed || profile?.completed ? 'checkmark-circle' : 'alert-circle'}
              size={24}
              color={profile?.is_profile_completed || profile?.completed ? Theme.colors.success : Theme.colors.warning}
            />
            <Text style={styles.statusText}>
              {profile?.is_profile_completed || profile?.completed
                ? 'Profile Completed ✨'
                : 'Profile Incomplete'}
            </Text>
          </GlassView>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    ...Theme.typography.h1,
    color: Theme.colors.text,
  },
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    ...Theme.typography.h3,
    color: Theme.colors.text,
    marginBottom: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },
  editButtonText: {
    color: Theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  infoCard: {
    padding: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    ...Theme.typography.caption,
    marginBottom: 8,
  },
  value: {
    ...Theme.typography.body,
    color: Theme.colors.text,
    paddingVertical: 8,
  },
  input: {
    ...Theme.typography.body,
    color: Theme.colors.text,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
  },
  locationCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    marginLeft: 12,
    flex: 1,
  },
  locationLabel: {
    ...Theme.typography.caption,
    marginBottom: 4,
  },
  locationCoords: {
    fontSize: 12,
    color: Theme.colors.primary,
    fontFamily: 'monospace',
  },
  updateLocationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.glow,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  statusText: {
    ...Theme.typography.body,
    color: Theme.colors.text,
    marginLeft: 12,
    fontWeight: '600',
  },
  subscriptionCard: {
    padding: 24,
    marginBottom: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.secondary,
  },
  premiumBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  subscriptionTitle: {
    ...Theme.typography.h2,
    color: Theme.colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subscriptionSubtitle: {
    ...Theme.typography.body,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  upgradeButton: {
    width: '100%',
  },
});

export default ProfileScreen;
