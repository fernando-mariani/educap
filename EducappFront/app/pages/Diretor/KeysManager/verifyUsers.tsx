import { DiretorContext } from '@/context/Context/DiretorContext';
import { NotVerifiedUsers } from '@/types';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useEffect, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Modal,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Animated, {
    FadeIn,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const PRIMARY_BLUE = '#275BF5';
const DEEP_INDIGO = '#4F46E5';
const RED = '#EF4444';
const BG_COLOR = '#F8FAFC';
const TEXT_MAIN = '#1E293B';
const TEXT_SUB = '#64748B';
const BORDER_COLOR = '#E2E8F0';


const AnimatedPressable = ({ children, onPress, style, activeScale = 0.97 }: any) => {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(activeScale, { damping: 20, stiffness: 250 });
    };
    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 20, stiffness: 250 });
    };

    return (
        <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
        >
            <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
        </Pressable>
    );
};

//Card de usuários
const UserCard = ({ user, onApprove, onDeny, index }: any) => {
    const isTeacher = user.professor !== null;

    return (
        <Animated.View
            entering={FadeInUp.duration(300).delay(index * 50)}
            style={[styles.card, styles.cardShadow]}
        >
            <View style={styles.cardInfoRow}>
                <View style={[styles.avatarContainer, { backgroundColor: isTeacher ? '#EEF2FF' : '#F0FDF4' }]}>
                    <Feather name={isTeacher ? "award" : "user"} size={22} color={isTeacher ? DEEP_INDIGO : '#16A34A'} />
                </View>
                
                <View style={styles.userDetails}>
                    <View style={styles.nameBadgeRow}>
                        <Text style={styles.userName}>{isTeacher ? user.professor.nome : user.aluno.nome}</Text>
                        <View style={[styles.roleBadge, { backgroundColor: isTeacher ? '#4F46E515' : '#275BF515' }]}>
                            <Text style={[styles.roleBadgeText, { color: isTeacher ? DEEP_INDIGO : PRIMARY_BLUE }]}>
                                {isTeacher ? 'Professor' : 'Aluno'}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.userEmail}>{user.email}</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.extraInfoContainer}>
                {isTeacher ? (
                    <>
                        <View style={styles.infoItem}>
                            <Feather name="book" size={14} color={TEXT_SUB} />
                            <Text style={styles.infoText}>Matéria: <Text style={styles.infoBold}>{user.professor.materia}</Text></Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Feather name="grid" size={14} color={TEXT_SUB} />
                            <Text style={styles.infoText}>Turmas: <Text style={styles.infoBold}>{user.professor.turmas.map((turma: any) => (turma.nomeTurma)).join(', ')}</Text></Text>
                        </View>
                    </>
                ) : (
                    <View style={styles.infoItem}>
                        <Feather name="layers" size={14} color={TEXT_SUB} />
                        <Text style={styles.infoText}>Turma: <Text style={styles.infoBold}>{user.aluno.turma.nomeTurma}</Text></Text>
                    </View>
                )}
            </View>

            <View style={styles.actionsRow}>
                <AnimatedPressable
                    style={styles.denyButton}
                    activeScale={0.96}
                    onPress={() => onDeny(user.id)}
                >
                    <Feather name="x" size={16} color={RED} />
                    <Text style={styles.denyButtonText}>Negar</Text>
                </AnimatedPressable>

                <AnimatedPressable
                    style={styles.approveButton}
                    activeScale={0.96}
                    onPress={() => onApprove(user.id)}
                >
                    <Feather name="check" size={16} color="#FFF" />
                    <Text style={styles.approveButtonText}>Verificar</Text>
                </AnimatedPressable>
            </View>
        </Animated.View>
    );
};

export default function VerifyUsers() {
    const navigation = useNavigation<any>();

    const{getNotVerifiedUsers, excluirUser, verifyUser} = useContext(DiretorContext);
    

    const[NotVerifiedUsers, setNotVerifiedUsers] = useState<NotVerifiedUsers[]>([]);
    const[refresh, setRefresh] = useState(false);

    const[idUserDelete, setIdUserDelete] = useState('');

    useEffect(() => {
        async function initData() {
            const [dataNotVerifiedUsers] = await Promise.all([
                getNotVerifiedUsers(),
            ]);
            if (dataNotVerifiedUsers) setNotVerifiedUsers(dataNotVerifiedUsers);
        }
        initData();

        
    }, [refresh]);
    
    // Estados do Modal
    const [modalVisible, setModalVisible] = useState(false);

    const handleApprove = async (id: string) => {
        await verifyUser(id);
        setRefresh(!refresh);
    };

    const handleOpenDenyModal = (id: string) => {
        setIdUserDelete(id);
        setModalVisible(true);
    };

    const confirmDeny = async () => {
        await excluirUser(idUserDelete);
        setRefresh(!refresh);
        setModalVisible(false);
        setIdUserDelete('');
    };

    if(!NotVerifiedUsers) return null;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            
            {/* Header */}
            <View style={styles.headerWrapper}>
                <LinearGradient
                    colors={[PRIMARY_BLUE, DEEP_INDIGO]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerGradient}
                >
                    <SafeAreaView edges={['top']} style={styles.headerContent}>
                        <View style={styles.headerTop}>
                            <AnimatedPressable 
                                style={styles.backButton} 
                                onPress={() => navigation.goBack()}
                            >
                                <Feather name="arrow-left" size={22} color="#FFF" />
                            </AnimatedPressable>
                        </View>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>Validação de Usuários</Text>
                            <Text style={styles.headerSubtitle}>Aprove ou negue solicitações de acesso</Text>
                        </View>
                    </SafeAreaView>
                </LinearGradient>
            </View>
            {/* Lista de Usuários Pendentes */}
            <FlatList
                data={NotVerifiedUsers}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <UserCard 
                        user={item} 
                        index={index}
                        onApprove={handleApprove}
                        onDeny={handleOpenDenyModal}
                    />
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Feather name="check-circle" size={48} color={BORDER_COLOR} />
                        <Text style={styles.emptyText}>Nenhuma solicitação pendente.</Text>
                    </View>
                }
            />

            {/* Modal de Confirmação de Exclusão */}
            <Modal
                transparent
                visible={modalVisible}
                animationType="none"
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable 
                    style={styles.modalOverlay} 
                    onPress={() => setModalVisible(false)}
                >
                    <Animated.View 
                        entering={FadeIn.duration(250)}
                        style={styles.modalContent}
                    >
                        <View style={styles.modalIconCircle}>
                            <Feather name="alert-triangle" size={32} color={RED} />
                        </View>
                        <Text style={styles.modalTitle}>Confirmar exclusão</Text>
                        <Text style={styles.modalMessage}>
                            Tem certeza que deseja negar este usuário? Essa ação excluirá a conta e todos os dados permanentemente.
                        </Text>
                        
                        <View style={styles.modalButtons}>
                            <Pressable 
                                style={styles.modalCancelBtn}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.modalCancelBtnText}>Cancelar</Text>
                            </Pressable>
                            
                            <Pressable 
                                style={styles.modalDeleteBtn}
                                onPress={confirmDeny}
                            >
                                <Text style={styles.modalDeleteBtnText}>Excluir</Text>
                            </Pressable>
                        </View>
                    </Animated.View>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG_COLOR },
    headerWrapper: {
        zIndex: 10,
    },
    headerGradient: {
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        paddingBottom: 16,
        elevation: 10,
        shadowColor: PRIMARY_BLUE,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    headerContent: { paddingHorizontal: 24 },
    headerTop: { marginTop: 8 },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitleContainer: { marginTop: 12 },
    headerTitle: { fontSize: 22, fontWeight: '800', color: '#FFF' },
    headerSubtitle: { fontSize: 13, color: 'rgba(255, 255, 255, 0.8)', marginTop: 4 },
    
    listContent: { padding: 20, paddingBottom: 40 },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: BORDER_COLOR,
    },
    cardShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },
    cardInfoRow: { flexDirection: 'row', alignItems: 'center' },
    avatarContainer: {
        width: 52,
        height: 52,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userDetails: { flex: 1, marginLeft: 16 },
    nameBadgeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    userName: { fontSize: 16, fontWeight: '700', color: TEXT_MAIN },
    roleBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    roleBadgeText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
    userEmail: { fontSize: 13, color: TEXT_SUB, marginTop: 2 },
    
    divider: { height: 1, backgroundColor: BORDER_COLOR, marginVertical: 16 },
    
    extraInfoContainer: { gap: 8, marginBottom: 20 },
    infoItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    infoText: { fontSize: 13, color: TEXT_SUB },
    infoBold: { fontWeight: '700', color: TEXT_MAIN },

    actionsRow: { flexDirection: 'row', gap: 12 },
    approveButton: {
        flex: 1.5,
        backgroundColor: PRIMARY_BLUE,
        height: 48,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 6,
        elevation: 4,
        shadowColor: PRIMARY_BLUE,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    approveButtonText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
    denyButton: {
        flex: 1,
        backgroundColor: '#FFF1F2',
        height: 48,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#FECDD3',
        gap: 8,
        padding: 6,
    },
    denyButtonText: { 
        color: RED, 
        fontSize: 14, 
        fontWeight: '700' 
    },

    emptyContainer: { alignItems: 'center', marginTop: 100 },
    emptyText: { color: TEXT_SUB, marginTop: 12, fontSize: 15 },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
    },
    modalIconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FEF2F2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: { fontSize: 20, fontWeight: '800', color: TEXT_MAIN, marginBottom: 12 },
    modalMessage: { fontSize: 15, color: TEXT_SUB, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
    modalButtons: { flexDirection: 'row', gap: 12, width: '100%' },
    modalCancelBtn: { flex: 1, height: 52, borderRadius: 14, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
    modalCancelBtnText: { color: TEXT_MAIN, fontWeight: '700' },
    modalDeleteBtn: { flex: 1, height: 52, borderRadius: 14, backgroundColor: RED, justifyContent: 'center', alignItems: 'center' },
    modalDeleteBtnText: { color: '#FFF', fontWeight: '700' },
});