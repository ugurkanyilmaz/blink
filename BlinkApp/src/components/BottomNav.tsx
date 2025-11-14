// src/components/BottomNav.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAuth } from '../context/AuthContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const BottomNav = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, route.name === 'Match' && styles.activeTab]}
        onPress={() => navigation.navigate('Match')}
        activeOpacity={0.7}>
        <Text style={[styles.tabText, route.name === 'Match' && styles.activeTabText]}>
          Match
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, route.name === 'ProfileSetup' && styles.activeTab]}
        onPress={() => navigation.navigate('ProfileSetup')}
        activeOpacity={0.7}>
        <Text style={[styles.tabText, route.name === 'ProfileSetup' && styles.activeTabText]}>
          Profile
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tab}
        onPress={handleLogout}
        activeOpacity={0.7}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 255, 255, 0.2)',
    paddingBottom: 10,
    paddingTop: 10,
    shadowColor: '#00FFFF',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#00FFFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.5,
  },
  activeTabText: {
    color: '#00FFFF',
    fontWeight: '700',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF4444',
    letterSpacing: 0.5,
  },
});

export default BottomNav;
