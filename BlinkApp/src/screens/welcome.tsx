import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import type {ScreenProps} from '../types/navigation';

type WelcomeScreenProps = ScreenProps<'Welcome'>;

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({navigation}) => {
  const blinkAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Blink pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [blinkAnim, fadeAnim]);

  const pulseScale = blinkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const pulseOpacity = blinkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  return (
    <SafeAreaView className="flex-1 bg-[#1A1A2E]">
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
      
      <Animated.View 
        className="flex-1 justify-between px-6 py-12"
        style={{opacity: fadeAnim}}
      >
        {/* Logo ve Başlık Alanı */}
        <View className="flex-1 justify-center items-center">
          <Animated.View
            style={{
              transform: [{scale: pulseScale}],
              opacity: pulseOpacity,
            }}
          >
            <View className="w-24 h-24 rounded-full bg-[#00FFFF]/20 items-center justify-center mb-6">
              <View className="w-16 h-16 rounded-full bg-[#00FFFF]/40 items-center justify-center">
                <View className="w-8 h-8 rounded-full bg-[#00FFFF]" />
              </View>
            </View>
          </Animated.View>

          <Text className="text-5xl font-bold text-[#F0F0F0] mb-3">
            blink
          </Text>
          
          <Text className="text-[#F0F0F0]/60 text-center text-base px-8">
            Anlık bağlantılar. Gizlilik korumalı. Sınırsız keşif.
          </Text>
        </View>

        {/* Alt Butonlar */}
        <View className="gap-4 mb-8">
          <TouchableOpacity
            className="bg-[#00FFFF] rounded-2xl py-4 px-6 shadow-lg"
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Register')}
          >
            <Text className="text-[#1A1A2E] text-center text-lg font-bold">
              Hesap Oluştur
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-transparent border-2 border-[#00FFFF] rounded-2xl py-4 px-6"
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Login')}
          >
            <Text className="text-[#00FFFF] text-center text-lg font-semibold">
              Giriş Yap
            </Text>
          </TouchableOpacity>

          <Text className="text-[#F0F0F0]/40 text-center text-xs mt-2">
            Devam ederek Kullanım Koşulları ve Gizlilik Politikası'nı kabul ediyorsunuz
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;