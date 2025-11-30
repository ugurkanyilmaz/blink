import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Theme } from '../theme/theme';
import GlassView from './GlassView';

interface ActionItem {
    label: string;
    onPress: () => void;
    type?: 'default' | 'danger';
}

interface ActionMenuProps {
    visible: boolean;
    onClose: () => void;
    actions: ActionItem[];
    title?: string;
}

const ActionMenu = ({ visible, onClose, actions, title }: ActionMenuProps) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.containerWrapper}>
                            <GlassView intensity="dark" style={styles.container}>
                                {title && <Text style={styles.title}>{title}</Text>}

                                {actions.map((action, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.actionButton,
                                            index < actions.length - 1 && styles.borderBottom
                                        ]}
                                        onPress={() => {
                                            action.onPress();
                                            onClose();
                                        }}>
                                        <Text style={[
                                            styles.actionText,
                                            action.type === 'danger' && styles.dangerText
                                        ]}>
                                            {action.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </GlassView>

                            <TouchableOpacity onPress={onClose} style={styles.cancelButtonWrapper}>
                                <GlassView intensity="medium" style={styles.cancelButton}>
                                    <Text style={styles.cancelText}>Cancel</Text>
                                </GlassView>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
        padding: 20,
        paddingBottom: 40,
    },
    containerWrapper: {
        width: '100%',
    },
    container: {
        borderRadius: Theme.borderRadius.l,
        marginBottom: 16,
        overflow: 'hidden',
    },
    title: {
        ...Theme.typography.caption,
        textAlign: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.glassBorder,
    },
    actionButton: {
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.glassBorder,
    },
    actionText: {
        fontSize: 18,
        color: Theme.colors.primary,
        fontWeight: '600',
    },
    dangerText: {
        color: Theme.colors.error,
    },
    cancelButtonWrapper: {
        width: '100%',
    },
    cancelButton: {
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Theme.borderRadius.l,
    },
    cancelText: {
        fontSize: 18,
        fontWeight: '700',
        color: Theme.colors.text,
    },
});

export default ActionMenu;
