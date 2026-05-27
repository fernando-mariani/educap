import { DiretorContext } from '@/context/Context/DiretorContext';
import { TurmaDetails } from '@/types';
import { Feather } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useEffect, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TurmasStackParamList } from '../Routes/TurmaRoutes';

const PRIMARY_BLUE = '#275BF5';
const DEEP_INDIGO = '#4F46E5';
const BG_SOFT = '#F8FAFC';
const TEXT_MAIN = '#1E293B';
const TEXT_SUB = '#64748B';
const WHITE = '#FFFFFF';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

type TurmaDetailsProps = RouteProp<
  TurmasStackParamList,
  'TurmaDetails'
>;

const formatarDataDDMM = (data: string) => {
  if (!data || !data.includes('/')) return 0;

  const [dia, mes] = data.split("/").map(Number);

  return new Date(new Date().getFullYear(), mes - 1, dia).getTime();
};

const now = new Date();
const hoje = now.setHours(0, 0, 0, 0);

const SectionHeader = ({ title, icon, color }: { title: string; icon: any; color: string }) => (
  <View style={styles.sectionHeader}>
    <View style={[styles.sectionIconWrapper, { backgroundColor: color + '15' }]}>
      <Feather name={icon} size={18} color={color} />
    </View>
    <View>
      <Text style={styles.sectionTitleText}>{title}</Text>
      <View style={[styles.sectionTitleLine, { backgroundColor: color }]} />
    </View>
  </View>
);

const formatarHorario = (minutos: number) => {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;

    return `${h.toString().padStart(2, '0')}:${m
    .toString()
    .padStart(2, '0')}`;
}

export default function TurmaDetailsScreen() {
    const navigation = useNavigation();
    const route = useRoute<TurmaDetailsProps>();
    const { id } = route.params;

    const {getTurmaDetails} = useContext(DiretorContext);

    const [turmaDetails, setTurmaDetails] = useState<TurmaDetails>({} as TurmaDetails);
    
    useEffect(() => {
      async function initData() {
        const data = await getTurmaDetails(id);
        if (data) {
          setTurmaDetails(data);
        }
      }
      initData();
    }, []);

  // Animação para o botão de voltar
  const backScale = useSharedValue(1);
  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backScale.value }]
  }));

  const handlePressIn = () => { backScale.value = withSpring(0.95, { damping: 20, stiffness: 250 }); };
  const handlePressOut = () => { backScale.value = withSpring(1, { damping: 20, stiffness: 250 }); };

  if (turmaDetails.id === '' || turmaDetails.id === undefined) {
    return null;
  } 

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <View style={styles.flex1}>
        <Animated.View entering={FadeInUp.duration(300)} style={styles.headerWrapper}>
          <LinearGradient
            colors={[PRIMARY_BLUE, DEEP_INDIGO]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <SafeAreaView edges={['top']} style={styles.headerContent}>
              <View style={styles.headerTopBar}>
                <AnimatedTouchableOpacity 
                  style={[styles.backButton, backAnimatedStyle]} 
                  onPress={() => navigation.goBack()}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  activeOpacity={1}
                >
                  <Feather name="arrow-left" size={22} color="#FFF" />
                </AnimatedTouchableOpacity>
                <Text style={styles.headerTitle}>Detalhes da Turma</Text>
                <View style={{ width: 40 }} />
              </View>
            </SafeAreaView>
          </LinearGradient>
        </Animated.View>

        <ScrollView 
          style={styles.flex1}
          contentContainerStyle={styles.scrollPadding}
          showsVerticalScrollIndicator={false}
        >
          {/* Nome da Turma em Destaque */}
          <Animated.View entering={FadeInUp.duration(300).delay(100)} style={[styles.mainInfoCard, styles.cardShadow]}>
            <View style={styles.mainIconContainer}>
              <Feather name="book-open" size={32} color={PRIMARY_BLUE} />
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Turma</Text>
            </View>
            <Text style={styles.classNameText}>{turmaDetails.nomeTurma}</Text>
            <Text style={styles.institutionText}>Instituição Educap</Text>
          </Animated.View>

          {/* Seção de Alunos */}
          <Animated.View entering={FadeInUp.duration(300).delay(150)} style={[styles.sectionCard, styles.cardShadow]}>
            <SectionHeader title="Alunos Matriculados" icon="users" color="#3B82F6" />
            {(turmaDetails.alunos.length === 0) ? (
                <Text style={styles.noneMsg}>Nenhum aluno matriculado nesta turma.</Text>
            ) : null}
            {turmaDetails.alunos.map((aluno) => (
              <View key={aluno.id} style={styles.listItem}>
                <View style={styles.avatarMini}>
                  <Feather name="user" size={14} color={PRIMARY_BLUE} />
                </View>
                <Text style={styles.listItemText}>{aluno.nome}</Text>
              </View>
            ))}
          </Animated.View>

          {/* Seção de Professores */}
          <Animated.View entering={FadeInUp.duration(300).delay(200)} style={[styles.sectionCard, styles.cardShadow]}>
            <SectionHeader title="Corpo Docente" icon="award" color="#10B981" />
            {(turmaDetails.professores.length === 0) ? (
                <Text style={styles.noneMsg}>Nenhum professor registrado nesta turma.</Text>
            ) : null}
            {turmaDetails.professores.map((prof) => (
              <View key={prof.id} style={styles.listItem}>
                <View style={[styles.avatarMini, { backgroundColor: '#ECFDF5' }]}>
                  <Feather name="book-open" size={14} color="#10B981" />
                </View>
                <View style={styles.flex1}>
                  <Text style={styles.listItemText}>{prof.nome}</Text>
                  <Text style={styles.listSubItemText}>{prof.materia}</Text>
                </View>
              </View>
            ))}
          </Animated.View>

          {/* Aulas do Dia */}
          <Animated.View entering={FadeInUp.duration(300).delay(250)} style={[styles.sectionCard, styles.cardShadow]}>
            <SectionHeader title="Aulas de Hoje" icon="calendar" color={PRIMARY_BLUE} />
            {(turmaDetails.aulas.filter((aula) => aula.diaSemana === new Date().getDay()).length === 0) ? (
                <Text style={styles.noneMsg}>Nenhuma aula registrada para hoje nesta turma.</Text>
            ) : null}
            {turmaDetails.aulas.filter((aula) => aula.diaSemana === new Date().getDay()).sort((a, b) => a.horarioInicio - b.horarioInicio).map((aula, index) => (
              <View key={`aula-${index}`} style={styles.listItem}>
                <View style={[styles.avatarMini, { backgroundColor: '#FFF7ED' }]}>
                  <Feather name="clock" size={14} color="#EA580C" />
                </View>
                <View style={styles.rowSpaceBetween}>
                  <View style={styles.flex1}>
                    <Text style={styles.listItemText}>{aula.professor.materia}</Text>
                    <Text style={styles.listSubItemText}>Prof. {aula.professor.nome}</Text>
                  </View>
                  <Text style={styles.timeText}>{formatarHorario(aula.horarioInicio)} - {formatarHorario(aula.horarioFim)}</Text>
                </View>
              </View>
            ))}
          </Animated.View>

          {/* Tarefas da Turma */}
          <Animated.View entering={FadeInUp.duration(300).delay(300)} style={[styles.sectionCard, styles.cardShadow]}>
            <SectionHeader title="Tarefas e Atividades" icon="edit-3" color="#7C3AED" />
            {(turmaDetails.tarefas.length === 0) ? (
                <Text style={styles.noneMsg}>Nenhuma tarefa registrada para esta turma.</Text>
            ) : null}
            {turmaDetails.tarefas.filter(t => (formatarDataDDMM(t.dataLimite) as number) >= hoje).map((tarefa) => (
              <View key={tarefa.id} style={styles.listItem}>
                <View style={[styles.avatarMini, { backgroundColor: '#F5F3FF' }]}>
                  <Feather name="check-square" size={14} color="#7C3AED" />
                </View>
                <View style={styles.rowSpaceBetween}>
                  <Text style={[styles.listItemText, { flex: 1, marginRight: 8 }]} numberOfLines={1}>{tarefa.nomeTarefa}</Text>
                  <Text style={styles.deadlineText}>Prazo: {tarefa.dataLimite}</Text>
                </View>
              </View>
            ))}
          </Animated.View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_SOFT },
  flex1: { flex: 1 },
  headerWrapper: {
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  headerGradient: {
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: { 
    paddingHorizontal: 24,
    paddingTop: 4 
  },
  headerTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: WHITE },
  scrollPadding: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 40,
  },
  mainInfoCard: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
  },
  mainIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  badge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 14,
  },
  badgeText: { fontSize: 11, fontWeight: '800', color: PRIMARY_BLUE, textTransform: 'uppercase', letterSpacing: 0.5 },
  classNameText: {
    fontSize: 26,
    fontWeight: '800',
    color: TEXT_MAIN,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  institutionText: { fontSize: 14, color: TEXT_SUB, marginTop: 6, fontWeight: '500' },
  sectionCard: {
    backgroundColor: WHITE,
    borderRadius: 22,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitleText: { fontSize: 17, fontWeight: '700', color: TEXT_MAIN },
  sectionTitleLine: { height: 3, width: 20, borderRadius: 2, marginTop: 4 },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  avatarMini: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listItemText: { fontSize: 15, fontWeight: '700', color: TEXT_MAIN },
  listSubItemText: { fontSize: 12, color: TEXT_SUB, fontWeight: '500', marginTop: 1 },
  rowSpaceBetween: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: { fontSize: 13, fontWeight: '700', color: PRIMARY_BLUE },
  deadlineText: { fontSize: 12, color: '#EF4444', fontWeight: '700' },
  noneMsg: {
    fontSize: 13,
    color: TEXT_SUB,
    fontWeight: '500',
    textAlign: 'center',
    paddingVertical: 8,
    fontStyle: 'italic',
  },
});