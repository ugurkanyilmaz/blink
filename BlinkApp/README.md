This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Blink App - React Native

Video sohbet ve mesajlaşma uygulaması.

## Kurulum

### 1. Bağımlılıkları yükle
```bash
npm install
```

### 2. iOS için (sadece macOS)
```bash
cd ios
pod install
cd ..
```

### 3. Backend'i başlat
Backend'in Docker'da çalıştığından emin olun:
```bash
# Ana dizinde (c:\blink)
docker-compose up -d
```

## Geliştirme

### Android
```bash
npm run android
```

### iOS (sadece macOS)
```bash
npm run ios
```

## Backend Bağlantısı

Backend API Docker'da çalışıyor: `http://localhost:3000`

- **Android Emulator**: `http://10.0.2.2:3000`
- **iOS Simulator**: `http://localhost:3000`
- **Gerçek Cihaz**: Bilgisayarınızın IP adresini kullanın (örn: `http://192.168.1.100:3000`)

API konfigürasyonunu `src/utils/api.ts` dosyasından değiştirebilirsiniz.

## Özellikler

- ✅ Kullanıcı kayıt/giriş
- ✅ JWT token authentication
- ✅ Otomatik token yenileme
- ⏳ Video sohbet
- ⏳ Mesajlaşma
- ⏳ Eşleşme sistemi

## Teknolojiler

- React Native 0.82
- React Navigation
- Axios
- AsyncStorage
- TypeScript

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
