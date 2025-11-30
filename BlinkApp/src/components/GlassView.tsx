import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Theme } from '../theme/theme';

interface GlassViewProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    intensity?: 'light' | 'medium' | 'dark';
    noBorder?: boolean;
}

const GlassView = ({ children, style, intensity = 'medium', noBorder = false }: GlassViewProps) => {
    let colors = Theme.gradients.darkGlass;
    let borderColor = Theme.colors.glassBorder;

    if (intensity === 'light') {
        colors = ['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)'];
        borderColor = 'rgba(255, 255, 255, 0.2)';
    } else if (intensity === 'dark') {
        colors = ['rgba(15, 15, 30, 0.8)', 'rgba(15, 15, 30, 0.95)'];
        borderColor = 'rgba(255, 255, 255, 0.05)';
    }

    return (
        <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
                styles.container,
                !noBorder && { borderWidth: 1, borderColor },
                style,
            ]}>
            {children}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: Theme.borderRadius.m,
        overflow: 'hidden',
    },
});

export default GlassView;
