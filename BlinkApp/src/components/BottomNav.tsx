// src/components/BottomNav.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAuth } from '../context/AuthContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type BottomNavProps = {
  currentRouteName?: keyof RootStackParamList;
};

const BottomNav = ({ currentRouteName }: BottomNavProps) => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('Match')}
        activeOpacity={0.7}>
        <Icon
          name="heart"
          size={24}
          color={currentRouteName === 'Match' ? '#00FFFF' : 'rgba(255, 255, 255, 0.6)'}
        />
        <Text style={[styles.tabText, currentRouteName === 'Match' && styles.activeTabText]}>
          Match
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('Messages')}
        activeOpacity={0.7}>
        <Icon
          name="chatbubbles"
          size={24}
          color={currentRouteName === 'Messages' ? '#00FFFF' : 'rgba(255, 255, 255, 0.6)'}
        />
        <Text style={[styles.tabText, currentRouteName === 'Messages' && styles.activeTabText]}>
          Messages
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate('Profile')}
        activeOpacity={0.7}>
        <Icon
          name="person"
          size={24}
          color={currentRouteName === 'Profile' ? '#00FFFF' : 'rgba(255, 255, 255, 0.6)'}
        />
        <Text style={[styles.tabText, currentRouteName === 'Profile' && styles.activeTabText]}>
          Profile
        </Text>
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
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  activeTabText: {
    color: '#00FFFF',
    fontWeight: '700',
  },
});

export default BottomNav;
