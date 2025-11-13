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

type RegisterScreenProps = ScreenProps<'Register'>;

const RegisterScreen: React.FC<RegisterScreenProps> = ({navigation}) => {
  const [countryCode, setCountryCode] = useState('+90');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleRegister = async () => {
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

    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor');
      return;
    }

    setLoading(true);

    try {
      const fullPhone = `${countryCode}${phoneNumber}`;
      const response = await apiService.register(fullPhone, password);
      
      Alert.alert('Başarılı', 'Kayıt tamamlandı!', [
        {
          text: 'Tamam',
          onPress: () => {
            // TODO: Navigate to profile completion or Home screen
            console.log('User:', response.user);
            navigation.navigate('Login');
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Kayıt başarısız');
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

            {/* Title */}
            <View className="mb-10">
              <Text className="text-4xl font-bold text-[#F0F0F0] mb-2">
                Hesap Oluştur
              </Text>
              <Text className="text-[#F0F0F0]/60 text-base">
                Blink dünyasına katıl
              </Text>
            </View>

            {/* Form */}
            <View className="gap-4 mb-8">
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
                <Text className="text-[#F0F0F0]/80 text-sm mb-2 ml-1">
                  Şifre
                </Text>
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

              {/* Confirm Password Input */}
              <View>
                <Text className="text-[#F0F0F0]/80 text-sm mb-2 ml-1">
                  Şifre Tekrar
                </Text>
                <TextInput
                  className="bg-[#222831] text-[#F0F0F0] rounded-xl px-4 py-4 text-base border border-[#00FFFF]/20"
                  placeholder="Şifreni tekrar gir"
                  placeholderTextColor="#F0F0F0/40"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              className="bg-[#00FFFF] rounded-2xl py-4 px-6 shadow-lg mb-6"
              activeOpacity={0.8}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#1A1A2E" />
              ) : (
                <Text className="text-[#1A1A2E] text-center text-lg font-bold">
                  Kayıt Ol
                </Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View className="flex-row justify-center items-center">
              <Text className="text-[#F0F0F0]/60 text-sm">
                Zaten hesabın var mı?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text className="text-[#00FFFF] text-sm font-semibold">
                  Giriş Yap
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;