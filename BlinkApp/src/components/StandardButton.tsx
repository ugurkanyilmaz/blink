import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Theme } from '../theme/theme';

interface StandardButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: React.ReactNode;
}

const StandardButton = ({
    title,
    onPress,
    loading = false,
    disabled = false,
    variant = 'primary',
    style,
    textStyle,
    icon,
}: StandardButtonProps) => {

    const getColors = () => {
        switch (variant) {
            case 'primary': return Theme.gradients.primary;
            case 'secondary': return Theme.gradients.secondary;
            case 'danger': return ['#FF3B30', '#D32F2F'];
            case 'outline': return ['transparent', 'transparent'];
            default: return Theme.gradients.primary;
        }
    };

    const getTextColor = () => {
        if (variant === 'outline') return Theme.colors.primary;
        return '#0F0F1E'; // Dark text on bright buttons
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            style={[
                styles.container,
                variant === 'outline' && styles.outlineContainer,
                disabled && styles.disabled,
                style,
            ]}>
            <LinearGradient
                colors={getColors()}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}>
                {loading ? (
                    <ActivityIndicator color={getTextColor()} />
                ) : (
                    <>
                        {icon}
                        <Text style={[
                            styles.text,
                            { color: getTextColor() },
                            icon ? { marginLeft: 8 } : undefined,
                            textStyle
                        ]}>
                            {title}
                        </Text>
                    </>
                )}
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 56,
        borderRadius: Theme.borderRadius.m,
        overflow: 'hidden',
        ...Theme.shadows.glow,
    },
    outlineContainer: {
        borderWidth: 2,
        borderColor: Theme.colors.primary,
        shadowOpacity: 0,
        elevation: 0,
    },
    gradient: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        ...Theme.typography.button,
    },
    disabled: {
        opacity: 0.6,
        shadowOpacity: 0,
    },
});

export default StandardButton;
