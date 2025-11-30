import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, StatusBar, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import LinearGradient from 'react-native-linear-gradient';
import BackButton from '../components/BackButton';
import { Theme } from '../theme/theme';
import GlassView from '../components/GlassView';
import ActionMenu from '../components/ActionMenu';

type ChatScreenProps = NativeStackScreenProps<RootStackParamList, 'Chat'>;

const ChatScreen = ({ route, navigation }: ChatScreenProps) => {
    const { matchId } = route.params;
    const { user } = useAuth();
    const [messages, setMessages] = useState<any[]>([]);
    const [inputText, setInputText] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const socketRef = useRef<any>(null);

    useEffect(() => {
        socketRef.current = io('http://10.0.2.2:3000');
        socketRef.current.emit('join_room', { roomId: matchId });

        socketRef.current.on('new_message', (message: any) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [matchId]);

    const sendMessage = () => {
        if (!inputText.trim()) return;

        const message = {
            matchId,
            senderId: user?.id,
            content: inputText,
            createdAt: new Date().toISOString(),
        };

        // socketRef.current.emit('send_message', message);
        setMessages((prev) => [...prev, message]);
        setInputText('');
    };

    const handleAction = (action: string) => {
        setMenuVisible(false);
        setTimeout(() => {
            Alert.alert(action, `Are you sure you want to ${action.toLowerCase()} this user?`, [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert('Success', `User has been ${action.toLowerCase()}ed.`);
                        navigation.goBack();
                    }
                }
            ]);
        }, 500);
    };

    const renderItem = ({ item }: { item: any }) => {
        const isMe = item.senderId === user?.id;
        return (
            <View style={[
                styles.messageBubbleWrapper,
                isMe ? styles.myMessageWrapper : styles.theirMessageWrapper
            ]}>
                {isMe ? (
                    <LinearGradient
                        colors={Theme.gradients.primary}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.messageBubble}>
                        <Text style={styles.myMessageText}>{item.content}</Text>
                    </LinearGradient>
                ) : (
                    <GlassView intensity="light" style={styles.messageBubble}>
                        <Text style={styles.theirMessageText}>{item.content}</Text>
                    </GlassView>
                )}
            </View>
        );
    };

    return (
        <LinearGradient colors={Theme.gradients.background} style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

                <View style={styles.header}>
                    <BackButton />
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>Anonymous</Text>
                        <View style={styles.statusDot} />
                    </View>
                    <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
                        <Text style={styles.menuDots}>•••</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.messagesList}
                />

                <GlassView intensity="dark" style={styles.inputContainer} noBorder>
                    <TextInput
                        style={styles.input}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Type a message..."
                        placeholderTextColor={Theme.colors.textTertiary}
                    />
                    <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                        <LinearGradient
                            colors={Theme.gradients.primary}
                            style={styles.sendButtonGradient}>
                            <Text style={styles.sendArrow}>→</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </GlassView>

                <ActionMenu
                    visible={menuVisible}
                    onClose={() => setMenuVisible(false)}
                    title="Chat Options"
                    actions={[
                        { label: 'Report User', onPress: () => handleAction('Report'), type: 'danger' },
                        { label: 'Block User', onPress: () => handleAction('Block'), type: 'danger' },
                        { label: 'Unmatch', onPress: () => handleAction('Unmatch'), type: 'default' },
                    ]}
                />
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        ...Theme.typography.h3,
        color: Theme.colors.text,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Theme.colors.success,
        marginLeft: 8,
        ...Theme.shadows.glow,
    },
    menuButton: {
        padding: 8,
    },
    menuDots: {
        color: Theme.colors.text,
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    messagesList: {
        padding: 16,
        paddingBottom: 100,
    },
    messageBubbleWrapper: {
        marginBottom: 12,
        maxWidth: '80%',
    },
    myMessageWrapper: {
        alignSelf: 'flex-end',
    },
    theirMessageWrapper: {
        alignSelf: 'flex-start',
    },
    messageBubble: {
        padding: 12,
        borderRadius: 16,
        borderBottomRightRadius: 4, // for my message
    },
    myMessageText: {
        ...Theme.typography.body,
        color: '#0F0F1E',
        fontWeight: '600',
    },
    theirMessageText: {
        ...Theme.typography.body,
        color: Theme.colors.text,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 16,
        padding: 8,
        borderRadius: 30,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    input: {
        flex: 1,
        color: Theme.colors.text,
        paddingHorizontal: 16,
        height: 40,
        fontSize: 16,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
    },
    sendButtonGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendArrow: {
        color: '#0F0F1E',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default ChatScreen;
