import { AlunoContext } from '@/context/Context/AlunoContext';
import { Aulas, Tarefa, TurmaDetails } from '@/types';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useEffect, useState } from 'react';
import {
    Dimensions,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    FadeInRight,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const THEME = {
  colors: {
    primary: '#2563EB',
    secondary: '#4F46E5',
    accent: '#8B5CF6',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    textMain: '#1E293B',
    textSub: '#64748B',
    border: '#E2E8F0',
    success: '#10B981',
    warning: '#F59E0B',
    white: '#FFFFFF',
  },
  spacing: {
    xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32
  },
  radius: {
    sm: 8, md: 12, lg: 20, xl: 28, full: 99
  }
};

const formatarDataDDMM = (data: string) => {
  if (!data || !data.includes('/')) return 0;

  const [dia, mes] = data.split("/").map(Number);

  return new Date(new Date().getFullYear(), mes - 1, dia).getTime();
};

const now = new Date();
const today = now.setHours(0, 0, 0, 0);


export default function DetalhesTurma() {
  const navigation = useNavigation<any>();

  const { getAulas, getTarefas, getTurmaDetails, aluno } = useContext(AlunoContext);

  const[aulas, setAulas] = useState<Aulas[]>([]);
  const[tarefas, setTarefas] = useState<Tarefa[]>([]);
  const[turmaDetails, setTurmaDetails] = useState<TurmaDetails>({} as TurmaDetails);


  useEffect(() => {
    async function loadData() {
      const aulaData = await getAulas();
      if (aulaData) {
        setAulas(aulaData);
      }
      const tarefaData = await getTarefas();
      if (tarefaData) {
        setTarefas(tarefaData);
      }
      const turmaDetailsData = await getTurmaDetails();
      if (turmaDetailsData) {
        setTurmaDetails(turmaDetailsData);
      }
    }
    loadData();

    console.log(turmaDetails);
  }, []);

  if (!turmaDetails?.id) return null;

  
  const PressableScale = ({ children, onPress, style }: any) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={() => (scale.value = withSpring(0.97))}
      onPressOut={() => (scale.value = withSpring(1))}
      onPress={onPress}
    >
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </TouchableOpacity>
  );
  };

  const SectionHeader = ({ title, actionLabel, onAction }: any) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {actionLabel && (
      <TouchableOpacity onPress={onAction}>
        <Text style={styles.sectionAction}>{actionLabel}</Text>
      </TouchableOpacity>
    )}
  </View>
  );


  const SummaryItem = ({ icon, label, value, color, delay }: any) => (
  <Animated.View entering={FadeInUp.delay(delay).springify()} style={styles.summaryCard}>
    <View style={[styles.summaryIconBox, { backgroundColor: color + '10' }]}>
      <Feather name={icon} size={16} color={color} />
    </View>
    <View>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  </Animated.View>
  );

  const LessonItem = ({ item, index }: { item: Aulas; index: number }) => {
  const days = ['', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
  const formatTime = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  return (
    <Animated.View entering={FadeInUp.delay(400 + index * 100)} style={styles.lessonCard}>
      <View style={styles.lessonDayBox}>
        <Text style={styles.lessonDayText}>{days[item.diaSemana]?.substring(0, 3).toUpperCase()}</Text>
      </View>
      <View style={styles.lessonInfo}>
        <Text style={styles.lessonTime}>
          {formatTime(item.horarioInicio)} — {formatTime(item.horarioFim)}
        </Text>
        <Text style={styles.lessonSubject}>{item.professor.materia}</Text>
      </View>
      <Feather name="chevron-right" size={16} color={THEME.colors.border} />
    </Animated.View>
  );
  };

const TaskItem = ({ item, index }: { item: Tarefa; index: number }) => (
  <Animated.View entering={FadeInRight.delay(500 + index * 100)} style={styles.taskCard}>
    <View style={styles.taskHeader}>
      <View style={[styles.taskBadge, { backgroundColor: THEME.colors.primary + '15' }]}>
        <Text style={[styles.taskBadgeText, { color: THEME.colors.primary }]}>
          {item.tipoTarefa.tipo}
        </Text>
      </View>
      <Text style={styles.taskPoints}>{item.notaTarefa} pts</Text>
    </View>
    <Text style={styles.taskTitle} numberOfLines={1}>{item.nomeTarefa}</Text>
    <View style={styles.taskFooter}>
      <Feather name="calendar" size={12} color={THEME.colors.textSub} />
      <Text style={styles.taskDate}>Limite: {item.dataLimite.split('-').reverse().join('/')}</Text>
    </View>
  </Animated.View>
);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollPadding}
      >
        {/* header */}
        <Animated.View entering={FadeInUp.duration(600)}>
          <LinearGradient
            colors={[THEME.colors.primary, THEME.colors.secondary]}
            style={styles.header}
          >
            <SafeAreaView edges={['top']} style={styles.headerContent}>
              <View style={styles.navBar}>
                <PressableScale onPress={() => navigation.goBack()} style={styles.backButton}>
                  <Feather name="arrow-left" size={22} color={THEME.colors.white} />
                </PressableScale>
              </View>
              
              <View style={styles.titleWrapper}>
                <Text style={styles.className}>{aluno.turma.nomeTurma}</Text>
                <View style={styles.subInfoRow}>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>Educap</Text>
                  </View>
                  <Text style={styles.studentCount}>• {turmaDetails.alunos.length || 0} Alunos</Text>
                </View>
              </View>
            </SafeAreaView>
          </LinearGradient>
        </Animated.View>

        {/* resumo */}
        <View style={styles.summaryContainer}>
          <SummaryItem 
            icon="users" 
            label="Alunos" 
            value={turmaDetails.alunos.length || 0} 
            color="#3B82F6" 
            delay={100} 
          />
          <SummaryItem 
            icon="book" 
            label="Aulas" 
            value={aulas.length} 
            color="#10B981" 
            delay={200} 
          />
          <SummaryItem 
            icon="check-square" 
            label="Tarefas" 
            value={tarefas.length} 
            color="#F59E0B" 
            delay={300} 
          />
        </View>

        {/* cards dos professores */}
        <SectionHeader title="Corpo Docente" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
        {turmaDetails.professores?.length > 0 ?
          turmaDetails.professores.map((professor, i) => (
            <Animated.View key={i} entering={FadeInRight.delay(300 + i * 100)} style={styles.profCard}>
              <View style={styles.avatarPlaceholder}>
                <Feather name="user" size={24} color={THEME.colors.primary} />
              </View>
              <Text style={styles.profName}>{professor.nome}</Text>
              <Text style={styles.profSubject}>{professor.materia}</Text>
            </Animated.View>
          )) : (
            <Text style={styles.emptyText}>Nenhum professor definido</Text>
          )}
        </ScrollView>

        {/* lista de aulas */}
        <SectionHeader title="Aulas" />
        <View style={styles.sectionContainer}>
          {aulas.length > 0 ? (
            aulas.sort((a,b) => a.diaSemana - b.diaSemana).sort((a,b) => a.horarioInicio - b.horarioInicio).map((aula, idx) => (
              <LessonItem key={aula.id} item={aula} index={idx} />
            ))
          ) : (
            <Text style={styles.emptyText}>Nenhuma aula definida</Text>
          )}
        </View>

        {/* lista de tarefas */}
        <SectionHeader title="Atividades Recentes" actionLabel="Ver Grade" onAction={() => navigation.navigate("Atividades")} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {tarefas.length > 0 ? (
            tarefas.filter(t => formatarDataDDMM(t.dataLimite) >= today).map((tarefa, idx) => (
              <TaskItem key={tarefa.id} item={tarefa} index={idx} />
            ))
          ) : (
            <Text style={styles.emptyText}>Sem atividades</Text>
          )}
        </ScrollView>

        {/* lista de alunos */}
        <SectionHeader title="Alunos" />
        <View style={styles.sectionContainer}>
        {turmaDetails.alunos?.length > 0 ?
          turmaDetails.alunos.map((alunos, i) => (
            <View key={i} style={styles.studentListItem}>
              <View style={styles.studentAvatarMini} >  
                <Feather name="user" size={20} color={THEME.colors.secondary} />
              </View>
              <View style={styles.flex1}>
                <Text style={styles.studentName}>{alunos.nome}</Text>
              </View>
            </View>
          )) : (
            <Text style={styles.emptyText}>Nenhum aluno definido</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.background },
  flex1: { flex: 1 },
  header: {
    paddingBottom: 32,
    borderBottomLeftRadius: THEME.radius.xl,
    borderBottomRightRadius: THEME.radius.xl,
  },
  headerContent: { paddingHorizontal: THEME.spacing.xl },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: THEME.spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: THEME.radius.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: THEME.radius.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleWrapper: { marginTop: THEME.spacing.lg },
  className: {
    fontSize: 28,
    fontWeight: '900',
    color: THEME.colors.white,
    letterSpacing: -0.5,
  },
  subInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: THEME.spacing.sm,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.sm,
    marginRight: 10,
  },
  tagText: { color: THEME.colors.white, fontSize: 12, fontWeight: '700' },
  studentCount: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '500' },
  
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.xl,
    marginTop: -20, 
  },
  summaryCard: {
    backgroundColor: THEME.colors.surface,
    width: (width - 64) / 3,
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
      android: { elevation: 3 }
    }),
  },
  summaryIconBox: {
    width: 32,
    height: 32,
    borderRadius: THEME.radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryValue: { fontSize: 18, fontWeight: '800', color: THEME.colors.textMain },
  summaryLabel: { fontSize: 11, color: THEME.colors.textSub, fontWeight: '600' },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.xl,
    marginTop: THEME.spacing.xxl,
    marginBottom: THEME.spacing.lg,
  },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: THEME.colors.textMain },
  sectionAction: { color: THEME.colors.primary, fontWeight: '700', fontSize: 14 },

  horizontalScroll: { paddingLeft: THEME.spacing.xl, paddingRight: THEME.spacing.xl },
  profCard: {
    width: 130,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    alignItems: 'center',
    marginRight: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profName: { fontSize: 14, fontWeight: '700', color: THEME.colors.textMain, textAlign: 'center' },
  profSubject: { fontSize: 12, color: THEME.colors.textSub, marginTop: 2 },

  sectionContainer: { paddingHorizontal: THEME.spacing.xl, gap: THEME.spacing.md },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  lessonDayBox: {
    width: 48,
    height: 48,
    borderRadius: THEME.radius.sm,
    backgroundColor: THEME.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  lessonDayText: { fontSize: 12, fontWeight: '900', color: THEME.colors.primary },
  lessonInfo: { flex: 1 },
  lessonTime: { fontSize: 15, fontWeight: '700', color: THEME.colors.textMain },
  lessonSubject: { fontSize: 13, color: THEME.colors.textSub, marginTop: 2 },

  taskCard: {
    width: 220,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.lg,
    marginRight: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  taskBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  taskBadgeText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  taskPoints: { fontSize: 12, fontWeight: '700', color: THEME.colors.success },
  taskTitle: { fontSize: 16, fontWeight: '700', color: THEME.colors.textMain },
  taskFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 6 },
  taskDate: { fontSize: 12, color: THEME.colors.textSub, fontWeight: '500' },

  studentListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  studentAvatarMini: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  studentName: { fontSize: 15, fontWeight: '700', color: THEME.colors.textMain },
  studentMeta: { fontSize: 12, color: THEME.colors.textSub, marginTop: 2 },

  scrollPadding: { paddingBottom: 60 },
  emptyText: { color: THEME.colors.textSub, fontStyle: 'italic', paddingVertical: 10 },
});