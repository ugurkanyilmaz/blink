# React Native Vector Icons Setup için gerekli komutlar

## Android için
Android otomatik olarak ayarlanmıştır (build.gradle'da apply from eklendi)

## iOS için (sadece macOS)
```bash
cd ios
pod install
cd ..
```

## Icon kullanımı
İconlar artık kullanıma hazır:
```tsx
import Icon from 'react-native-vector-icons/Ionicons';

<Icon name="videocam" size={30} color="#900" />
```
