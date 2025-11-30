import { TextStyle } from 'react-native';

export const Theme = {
    colors: {
        // Backgrounds
        background: '#0F0F1E',       // Deepest dark blue/black
        backgroundSecondary: '#1A1A2E', // Slightly lighter for contrast
        backgroundTertiary: '#2C2C3E',  // Used for cards/inputs

        // Accents
        primary: '#00FFFF',          // Electric Cyan (Main Action)
        primaryDark: '#00D4D4',      // Darker Cyan for gradients
        secondary: '#FF00FF',        // Neon Magenta (Secondary Action/Highlight)
        accent: '#7000FF',           // Electric Purple (Gradients)

        // Status
        success: '#00FF9D',          // Neon Green
        error: '#FF3B30',            // Bright Red
        warning: '#FFCC00',          // Neon Yellow
        info: '#00C6FF',             // Sky Blue

        // Text
        text: '#FFFFFF',             // Pure White
        textSecondary: 'rgba(255, 255, 255, 0.7)',
        textTertiary: 'rgba(255, 255, 255, 0.4)',

        // UI Elements
        border: 'rgba(0, 255, 255, 0.2)',
        glassBorder: 'rgba(255, 255, 255, 0.1)',
        overlay: 'rgba(0, 0, 0, 0.7)',
    },

    gradients: {
        primary: ['#00FFFF', '#00D4D4'],
        secondary: ['#FF00FF', '#D400D4'],
        darkGlass: ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)'],
        card: ['rgba(44, 44, 62, 0.9)', 'rgba(26, 26, 46, 0.95)'],
        background: ['#0F0F1E', '#1A1A2E', '#0F0F1E'], // Deep space effect
    },

    spacing: {
        xs: 4,
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
        xxl: 48,
    },

    borderRadius: {
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
        round: 9999,
    },

    typography: {
        h1: { fontSize: 32, fontWeight: '800' as TextStyle['fontWeight'], letterSpacing: 0.5 },
        h2: { fontSize: 24, fontWeight: '700' as TextStyle['fontWeight'], letterSpacing: 0.5 },
        h3: { fontSize: 20, fontWeight: '600' as TextStyle['fontWeight'], letterSpacing: 0.5 },
        body: { fontSize: 16, fontWeight: '400' as TextStyle['fontWeight'], lineHeight: 24 },
        caption: { fontSize: 12, fontWeight: '400' as TextStyle['fontWeight'], color: 'rgba(255, 255, 255, 0.5)' },
        button: { fontSize: 16, fontWeight: '700' as TextStyle['fontWeight'], letterSpacing: 1 },
    },

    shadows: {
        glow: {
            shadowColor: '#00FFFF',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 10,
            elevation: 5,
        },
        card: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
        }
    }
};
