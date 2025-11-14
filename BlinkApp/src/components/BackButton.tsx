// src/components/BackButton.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Icon için kütüphane ekleyeceğiz
import { Colors } from '../theme/colors';

// React Navigation'dan geri fonksiyonunu kullanmak için
import { useNavigation } from '@react-navigation/native';

const BackButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
      <Icon name="chevron-back-outline" size={30} color={Colors.text} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 50, // SafeAreaView'den sonra uygun pozisyon
    left: 20,
    zIndex: 10, // Diğer her şeyin üstünde görünmesi için
  },
});

export default BackButton;