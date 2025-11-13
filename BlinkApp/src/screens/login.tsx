import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import type {ScreenProps} from '../types/navigation';
import apiService from '../services/api.service';

type LoginScreenProps = ScreenProps<'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const [countryCode, setCountryCode] = useState('+90');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleLogin = async () => {
    // Validation
    if (!phoneNumber.trim()) {
      Alert.alert('Hata', 'Lütfen telefon numaranızı girin');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Hata', 'Lütfen şifrenizi girin');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır');
      return;
    }

    setLoading(true);

    try {
      const fullPhone = `${countryCode}${phoneNumber}`;
      const response = await apiService.login(fullPhone, password);
      
      Alert.alert('Başarılı', 'Giriş yapıldı!', [
        {
          text: 'Tamam',
          onPress: () => {
            // TODO: Navigate to Home screen
            console.log('User:', response.user);
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1A1A2E]">
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            className="flex-1 px-6 py-8"
            style={{opacity: fadeAnim}}
          >
            {/* Header */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="mb-8"
            >
              <Text className="text-[#00FFFF] text-base">← Geri</Text>
            </TouchableOpacity>

            {/* Logo */}
            <View className="items-center mb-12">
              <View className="w-20 h-20 rounded-full bg-[#00FFFF]/20 items-center justify-center mb-4">
                <View className="w-12 h-12 rounded-full bg-[#00FFFF]/40 items-center justify-center">
                  <View className="w-6 h-6 rounded-full bg-[#00FFFF]" />
                </View>
              </View>
              <Text className="text-3xl font-bold text-[#F0F0F0]">
                Tekrar Hoşgeldin
              </Text>
              <Text className="text-[#F0F0F0]/60 text-base mt-2">
                Hesabına giriş yap
              </Text>
            </View>

            {/* Form */}
            <View className="gap-4 mb-6">
              {/* Phone Input */}
              <View>
                <Text className="text-[#F0F0F0]/80 text-sm mb-2 ml-1">
                  Telefon Numarası
                </Text>
                <View className="flex-row gap-2">
                  {/* Country Code */}
                  <TextInput
                    className="bg-[#222831] text-[#F0F0F0] rounded-xl px-4 py-4 text-base border border-[#00FFFF]/20"
                    style={{width: 80}}
                    placeholder="+90"
                    placeholderTextColor="#F0F0F0/40"
                    value={countryCode}
                    onChangeText={setCountryCode}
                    keyboardType="phone-pad"
                    maxLength={4}
                  />
                  {/* Phone Number */}
                  <TextInput
                    className="bg-[#222831] text-[#F0F0F0] rounded-xl px-4 py-4 text-base border border-[#00FFFF]/20"
                    style={{flex: 1}}
                    placeholder="5XX XXX XX XX"
                    placeholderTextColor="#F0F0F0/40"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    maxLength={15}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View>
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-[#F0F0F0]/80 text-sm ml-1">
                    Şifre
                  </Text>
                  <TouchableOpacity>
                    <Text className="text-[#00FFFF] text-xs">
                      Şifremi Unuttum
                    </Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  className="bg-[#222831] text-[#F0F0F0] rounded-xl px-4 py-4 text-base border border-[#00FFFF]/20"
                  placeholder="En az 6 karakter"
                  placeholderTextColor="#F0F0F0/40"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className="bg-[#00FFFF] rounded-2xl py-4 px-6 shadow-lg mb-6"
              activeOpacity={0.8}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#1A1A2E" />
              ) : (
                <Text className="text-[#1A1A2E] text-center text-lg font-bold">
                  Giriş Yap
                </Text>
              )}
            </TouchableOpacity>

            {/* Register Link */}
            <View className="flex-row justify-center items-center">
              <Text className="text-[#F0F0F0]/60 text-sm">
                Hesabın yok mu?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text className="text-[#00FFFF] text-sm font-semibold">
                  Kayıt Ol
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;