import { DiretorContext } from '@/context/Context/DiretorContext';
import { keys } from '@/types';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useEffect, useState } from 'react';
import {
    Clipboard, Platform, ScrollView,
    StatusBar,
    StyleSheet,
    Text, TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRIMARY_BLUE = '#2563EB';
const DEEP_INDIGO = '#3730A3';
const SUCCESS_GREEN = '#10B981';
const BG_SOFT = '#F8FAFC';
const TEXT_MAIN = '#1E293B';
const TEXT_SUB = '#64748B';
const BORDER_COLOR = '#E2E8F0';
const KEY_BG = '#F1F5F9';
const WHITE = '#FFFFFF';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const PressableScale = ({ children, onPress, style, activeScale = 0.97 }: any) => {
    const scale = useSharedValue(1);
    
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(activeScale, { damping: 25, stiffness: 300 });
    };
    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 25, stiffness: 300 });
    };

    return (
        <AnimatedTouchableOpacity
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
            activeOpacity={1}
            style={[style, animatedStyle]}
        >
            {children}
        </AnimatedTouchableOpacity>
    );
};

//Card para as chaves de acesso
const KeyCard = ({ title, value, icon, description, action }: { title: string, value: string, icon: any, description: string, action: () => void}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        Clipboard.setString(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const isTeacher = title.toLowerCase().includes('professor');

    return (
        <View style={[styles.card, styles.cardShadow]}>
            <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: isTeacher ? '#EEF2FF' : '#EFF6FF' }]}>
                    <Feather name={icon} size={24} color={isTeacher ? '#4F46E5' : PRIMARY_BLUE} />
                </View>
                <View style={styles.titleWrapper}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    <Text style={styles.cardDescription}>{description}</Text>
                </View>
            </View>

            <View style={[styles.keyDisplayContainer, styles.keyDisplayBorder]}>
                <Feather name="shield" size={18} color={PRIMARY_BLUE} style={styles.keyIcon} />
                <Text style={styles.keyValueText} numberOfLines={1}>
                    {value || "Nenhuma chave gerada"}
                </Text>
            </View>

            <View style={styles.buttonRow}>
                <PressableScale style={[styles.primaryButton, styles.primaryButtonShadow]} onPress={action}>
                    <Text style={styles.primaryButtonText}>Gerar Nova</Text>
                    <Feather name="refresh-cw" size={16} color="#FFF" />
                </PressableScale>

                <PressableScale 
                    style={[styles.secondaryButton, copied ? styles.secondaryButtonActive : styles.secondaryButtonBorder]} 
                    onPress={handleCopy}
                >
                    <Text style={[styles.secondaryButtonText, copied && styles.secondaryButtonTextActive]}>
                        {copied ? "Copiado" : "Copiar"}
                    </Text>
                    <Feather name={copied ? "check" : "copy"} size={16} color={copied ? WHITE : PRIMARY_BLUE} />
                </PressableScale>
            </View>
        </View>
    );
};

export default function ManageKeysScreen() {
    const navigation = useNavigation();
    const { getKeys, gerarKey } = useContext(DiretorContext);

    const[keys, setKeys] = useState<keys[]>([] as keys[]);
    const[refresh, setRefresh] = useState(false);

    useEffect(() => {
        async function initData() {
            const [dataKeys] = await Promise.all([
                getKeys(),
            ]);

            if (dataKeys) setKeys(dataKeys);
        }

        initData();
    }, [refresh]);

    async function handleGerarKey(role: string) {
        await gerarKey(role);
        setRefresh(!refresh);
    }


    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            
            {/* Header */}
            <Animated.View entering={FadeInUp.duration(300)} style={styles.headerWrapper}>
                <LinearGradient
                    colors={[PRIMARY_BLUE, DEEP_INDIGO]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerGradient}
                >
                    <SafeAreaView edges={['top']} style={styles.headerContent}>
                        <View style={styles.headerTopBar}>
                            <TouchableOpacity 
                                style={styles.backButton} 
                                onPress={() => navigation.goBack()}
                            >
                                <Feather name="arrow-left" size={22} color="#FFF" />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Gerenciar Chaves</Text>
                            <View style={{ width: 40 }} /> 
                        </View>
                        <View style={styles.headerSubtitleContainer}>
                            <Text style={styles.headerSubtitle}>
                                Controle o acesso de novos usuários à plataforma
                            </Text>
                        </View>
                    </SafeAreaView>
                </LinearGradient>
            </Animated.View>

            <ScrollView 
                contentContainerStyle={styles.scrollContent} 
                showsVerticalScrollIndicator={false}
            >
                <Animated.View entering={FadeInUp.duration(300).delay(100)}>
                    <KeyCard 
                        title="Chave de Alunos" 
                        value={keys.find(k => k.role.toUpperCase() == "ALUNO")?.id || ""} 
                        icon="users"
                        description="Permite o cadastro de novos estudantes"
                        action={() => {handleGerarKey("ALUNO");}}
                    />
                </Animated.View>

                <Animated.View entering={FadeInUp.duration(300).delay(150)}>
                    <KeyCard 
                        title="Chave de Professores" 
                        value={keys.find(k => k.role.toUpperCase() == "PROFESSOR")?.id || ""} 
                        icon="award"
                        description="Permite o cadastro de novos docentes"
                        action={() => {handleGerarKey("PROFESSOR");}}
                    />
                </Animated.View>
                
                <View style={styles.infoContainer}>
                    <Feather name="info" size={14} color={TEXT_SUB} />
                    <Text style={styles.warningText}>
                        Ao gerar uma nova chave, a anterior expira instantaneamente.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BG_SOFT,
    },
    headerWrapper: {
        zIndex: 10,
    },
    headerGradient: {
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        paddingBottom: 24,
    },
    headerContent: {
        paddingHorizontal: 24,
    },
    headerTopBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: WHITE,
        letterSpacing: -0.5,
    },
    headerSubtitleContainer: {
        marginTop: 5,
        alignItems: 'center',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
    },
    scrollContent: {
        padding: 24,
        paddingTop: 28,
    },
    card: {
        backgroundColor: WHITE,
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: BORDER_COLOR,
    },
    cardShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    iconContainer: {
        width: 52,
        height: 52,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 18,
    },
    titleWrapper: { flex: 1, justifyContent: 'center' },
    cardTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: TEXT_MAIN,
    },
    cardDescription: {
        fontSize: 13,
        color: TEXT_SUB,
        marginTop: 4,
        lineHeight: 18,
    },
    keyDisplayContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: KEY_BG,
        borderRadius: 16,
        padding: 18,
        marginBottom: 24,
    },
    keyDisplayBorder: {
        borderWidth: 1,
        borderColor: '#CBD5E1',
    },
    keyIcon: { marginRight: 12, opacity: 0.8 },
    keyValueText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
        letterSpacing: 1.5,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    primaryButton: {
        flex: 1.5,
        backgroundColor: PRIMARY_BLUE,
        height: 48,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    primaryButtonShadow: {
        shadowColor: PRIMARY_BLUE,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonText: {
        color: WHITE,
        fontSize: 15,
        fontWeight: '700',
    },
    secondaryButton: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    secondaryButtonBorder: {
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
    },
    secondaryButtonActive: {
        backgroundColor: SUCCESS_GREEN,
        borderColor: SUCCESS_GREEN,
    },
    secondaryButtonText: {
        color: TEXT_MAIN,
        fontSize: 15,
        fontWeight: '700',
    },
    secondaryButtonTextActive: {
        color: WHITE,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        gap: 8,
        paddingHorizontal: 20,
    },
    warningText: {
        fontSize: 12,
        color: TEXT_SUB,
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: 18,
    },
});