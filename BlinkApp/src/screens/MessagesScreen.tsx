import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import BackButton from '../components/BackButton';
import api from '../config/api';
import { Theme } from '../theme/theme';
import GlassView from '../components/GlassView';

type MessagesScreenProps = NativeStackScreenProps<RootStackParamList, 'Messages'>;

const MessagesScreen = ({ navigation }: MessagesScreenProps) => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await api.get('/matches');
      setMatches(response.data);
    } catch (error) {
      console.error('Fetch matches error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Chat', { matchId: item.id })}
      activeOpacity={0.7}>
      <GlassView intensity="light" style={styles.matchItem}>
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={Theme.gradients.primary}
            style={styles.avatarGradient}>
            <Text style={styles.avatarText}>
              {item.partner.alias?.charAt(0).toUpperCase() || '?'}
            </Text>
          </LinearGradient>
        </View>
        <View style={styles.matchInfo}>
          <Text style={styles.matchName}>{item.partner.alias || 'Unknown'}</Text>
          <Text style={styles.matchTag}>{item.partner.alias_tag}</Text>
        </View>
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>›</Text>
        </View>
      </GlassView>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={Theme.gradients.background} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        <View style={styles.header}>
          <BackButton />
          <Text style={styles.title}>Messages</Text>
        </View>

        <View style={styles.container}>
          <GlassView intensity="dark" style={styles.searchContainer} noBorder>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search conversations..."
              placeholderTextColor={Theme.colors.textTertiary}
              value={searchText}
              onChangeText={setSearchText}
            />
          </GlassView>

          {loading ? (
            <ActivityIndicator color={Theme.colors.primary} style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={matches}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyEmoji}>💬</Text>
                  <Text style={styles.emptyText}>No matches yet.</Text>
                  <Text style={styles.emptySubText}>Start matching to find new friends!</Text>
                </View>
              }
            />
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  title: {
    ...Theme.typography.h1,
    color: Theme.colors.text,
    marginLeft: 16
  },
  container: { flex: 1, paddingHorizontal: 20 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 24,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 25,
  },
  searchIcon: {
    marginRight: 10,
    opacity: 0.7,
  },
  searchInput: {
    flex: 1,
    color: Theme.colors.text,
    fontSize: 16,
  },
  listContent: { paddingBottom: 20 },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    marginRight: 16,
    ...Theme.shadows.glow,
  },
  avatarGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F0F1E'
  },
  matchInfo: { flex: 1 },
  matchName: {
    ...Theme.typography.h3,
    color: Theme.colors.text
  },
  matchTag: {
    ...Theme.typography.caption,
    color: Theme.colors.primary,
    marginTop: 4,
  },
  arrowContainer: { padding: 8 },
  arrow: { fontSize: 24, color: Theme.colors.textTertiary },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyText: {
    ...Theme.typography.h2,
    color: Theme.colors.textSecondary,
    marginBottom: 8,
  },
  emptySubText: {
    ...Theme.typography.body,
    color: Theme.colors.textTertiary,
  },
});

export default MessagesScreen;
