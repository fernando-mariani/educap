import { ProfessorContext } from '@/context/Context/ProfessorContext';
import { Aulas, Tarefa } from '@/types';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Animated, {
  FadeInUp,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const THEME = {
  colors: {
    primary: '#275BF5',
    secondary: '#4F46E5',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    border: 'rgba(226, 232, 240, 0.8)',
  },
  spacing: {
    xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32
  },
  radius: {
    sm: 8, md: 12, lg: 18, xl: 24, full: 999
  },
  font: {
    xs: 11, sm: 13, md: 15, lg: 18, xl: 26, display: 34
  }
};

const TODAY_STR = new Date().toISOString().split('T')[0];
const NOW_IN_MINUTES = new Date().getHours() * 60 + new Date().getMinutes();


const PressableScale = React.memo(({ children, onPress, style, accessibilityLabel }: any) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Pressable 
      onPressIn={() => {
        scale.value = withTiming(0.98, { duration: 100 });
        opacity.value = withTiming(0.85, { duration: 100 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 120 });
        opacity.value = withTiming(1, { duration: 120 });
      }}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Animated.View style={[style, animatedStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
});

//Cards reutilizaveis
const SummaryCard = React.memo(({ title, value, icon, color, delay = 0 }: any) => (
  <Animated.View 
    entering={FadeInUp.delay(delay).springify()} 
    style={styles.flex1}
  >
    <PressableScale style={styles.smallCard} accessibilityLabel={`${title}: ${value}`}>
    <View style={[styles.smallIconBox, { backgroundColor: color + '15' }]}>
      <Feather name={icon} size={18} color={color} />
    </View>
    <View style={styles.smallTextContainer}>
      <Text style={[styles.smallValue, { color }]}>{value}</Text>
        <Text style={styles.smallTitle}>{title}</Text>
      </View>
    </PressableScale>
  </Animated.View>
));


const NextClassCard = React.memo(({ nextClass }: { nextClass: Aulas | undefined }) => {
  const displayTime = nextClass ? formatMinutesToTime(nextClass.horarioInicio) : '--:--';
  
  return (
    <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.flex12}>
      <LinearGradient
        colors={[THEME.colors.primary, THEME.colors.secondary]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={[styles.nextClassCard, styles.cardShadowHighlight]}
      >
        <View style={styles.nextClassHeader}>
          <Text style={styles.nextClassBadge}>PRÓXIMA AULA</Text>
          <Feather name="clock" size={14} color="rgba(255,255,255,0.7)" />
        </View>
        <View style={styles.nextClassBody}>
          <Text style={styles.nextClassTime}>{displayTime}</Text>
          <Text style={styles.nextClassSubject} numberOfLines={1}>
            {nextClass ? nextClass.professor.materia : 'Sem aulas'}
          </Text>
          <Text style={styles.nextClassTurma}>
            {nextClass ? nextClass.turma.nomeTurma : 'Agendadas'}
          </Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
});

const AgendaItem = React.memo(({ item, index }: { item: Aulas; index: number }) => (
  <Animated.View entering={FadeInUp.delay(300 + index * 100).springify()} layout={Layout.springify()}>
    <PressableScale style={styles.classItem} accessibilityLabel={`Aula de ${item.professor.materia} para ${item.turma.nomeTurma}`}>
      <View style={styles.classTimeContainer}>
        <Text style={styles.classTimeText}>{formatMinutesToTime(item.horarioInicio)}</Text>
        <Text style={styles.classTimeEndText}>{formatMinutesToTime(item.horarioFim)}</Text>
      </View>
      <View style={styles.verticalDivider} />
      <View style={styles.classContent}>
        <Text style={styles.classSubject}>{item.professor.materia}</Text>
        <View style={styles.classTurmaRow}>
          <Feather name="users" size={12} color={THEME.colors.textSecondary} style={{ marginRight: 4 }} />
          <Text style={styles.classTurma}>{item.turma.nomeTurma}</Text>
        </View>
      </View>
      <View style={styles.classIconWrapper}>
        <Feather name="book-open" size={16} color={THEME.colors.primary} />
      </View>
    </PressableScale>
  </Animated.View>
));

const ActivityItem = React.memo(({ task, todayStr, index }: { task: Tarefa; todayStr: string; index: number }) => {
  const taskISO = parseDateToISO(task.dataLimite);
  const isToday = taskISO === todayStr;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = taskISO === tomorrow.toISOString().split('T')[0];
  
  const statusLabel = isToday ? 'Hoje' : isTomorrow ? 'Amanhã' : 'Em breve';
  const displayDate = task.dataLimite.includes('/') 
    ? task.dataLimite 
    : task.dataLimite.split('-').reverse().slice(0, 2).join('/');

  return (
    <Animated.View entering={FadeInUp.delay(500 + index * 100).springify()} layout={Layout.springify()}>
      <PressableScale style={styles.taskItem}>
        <View style={styles.taskInfo}>
          <Text style={styles.taskTitle} numberOfLines={1}>{task.nomeTarefa}</Text>
          <Text style={styles.taskClass}>{task.turma.nomeTurma}</Text>
        </View>
        <View style={[
          styles.dateBadge, 
          isToday ? styles.dateBadgeToday : isTomorrow ? styles.dateBadgeTomorrow : null
        ]}>
          <Text style={[
            styles.dateText, 
            isToday ? styles.dateTextToday : isTomorrow ? styles.dateTextTomorrow : null
          ]}>
            {statusLabel} • {displayDate}
          </Text>
        </View>
      </PressableScale>
    </Animated.View>
  );
});

// Funçoes para formatar datas
const parseDateToISO = (dateStr: string) => {
  if (!dateStr) return '';
  if (dateStr.includes('-')) return dateStr;
  const [day, month] = dateStr.split('/');
  return `2026-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

const formatMinutesToTime = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

const SectionHeader = ({ title }: { title: string }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const EmptyState = ({ message }: { message: string }) => (
  <View style={styles.emptyState}>
    <Feather name="inbox" size={24} color={THEME.colors.textSecondary} style={{ opacity: 0.5, marginBottom: 8 }} />
    <Text style={styles.emptyText}>{message}</Text>
  </View>
);

export default function Dashboard() {
  const { getAulas, getTarefas, professor } = useContext(ProfessorContext);
  const [aulas, setAulas] = useState<Aulas[]>([]);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);

  useEffect(() => {
    const initData = async () => {
      const [aData, tData] = await Promise.all([getAulas(), getTarefas()]);
      if (aData) setAulas(aData);
      if (tData) setTarefas(tData);
    };
    initData();
  }, []);

  const logic = useMemo(() => {
    const pendingTasks = tarefas.filter(t => parseDateToISO(t.dataLimite) >= TODAY_STR);
    const todayClasses = aulas.filter(c => Number(c.diaSemana) === new Date().getDay()).sort((a, b) => a.horarioInicio - b.horarioInicio);
    const remainingClasses = todayClasses.filter(c => c.horarioInicio > NOW_IN_MINUTES);
    const nextClass = todayClasses.find(c => c.horarioInicio > NOW_IN_MINUTES);
    const upcomingTasks = [...tarefas]
      .filter(t => parseDateToISO(t.dataLimite) >= TODAY_STR)
      .sort((a, b) => parseDateToISO(a.dataLimite).localeCompare(parseDateToISO(b.dataLimite)));

    return { pendingCount: pendingTasks.length, remainingCount: remainingClasses.length, nextClass, todayClasses, upcomingTasks };
  }, [aulas, tarefas]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.surface} />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Relatório Diário</Text>
          <Text style={styles.headerSubtitle}>Resumo do seu dia</Text>
        </View>
        <View style={styles.greetingBadge}>
          <Text style={styles.greetingText}>Bom dia, {professor.nome.split(' ')[0]} 👋</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.summarySection}>
          <View style={styles.summaryGridLeft}>
            <SummaryCard title="Tarefas" value={logic.pendingCount} icon="edit-3" color={THEME.colors.warning} delay={0} />
            <SummaryCard title="Aulas" value={logic.remainingCount} icon="calendar" color={THEME.colors.primary} delay={100} />
          </View>
          <NextClassCard nextClass={logic.nextClass} />
        </View>

        <SectionHeader title="Agenda de Hoje" />
        <View style={styles.sectionContainer}>
          {logic.todayClasses.length > 0 ? (
            logic.todayClasses.map((c, idx) => <AgendaItem key={c.id} item={c} index={idx} />)
          ) : (
            <EmptyState message="Nenhuma aula hoje" />
          )}
        </View>

        <SectionHeader title="Próximas Atividades" />
        <View style={styles.sectionContainer}>
          {logic.upcomingTasks.length > 0 ? (
            logic.upcomingTasks.map((t, idx) => <ActivityItem key={t.id} task={t} todayStr={TODAY_STR} index={idx} />)
          ) : (
            <EmptyState message="Nenhuma tarefa pendente" />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.background },
  flex1: { flex: 1 },
  flex12: { flex: 1.2 },
  header: {
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  headerTitle: { fontSize: THEME.font.xl, fontWeight: '800', color: THEME.colors.textPrimary, letterSpacing: -0.5 },
  headerSubtitle: { fontSize: THEME.font.sm, color: THEME.colors.textSecondary, marginTop: 2 },
  greetingBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 14, paddingVertical: 6, borderRadius: THEME.radius.full },
  greetingText: { fontSize: 12, fontWeight: '700', color: THEME.colors.primary },
  scrollContent: { paddingBottom: THEME.spacing.xxl },
  summarySection: { flexDirection: 'row', paddingHorizontal: 20, marginTop: THEME.spacing.xl, gap: THEME.spacing.md, minHeight: 160 },
  summaryGridLeft: { flex: 1, gap: 10 },
  smallCard: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 3 }
    }),
  },
  smallIconBox: { width: 40, height: 40, borderRadius: THEME.radius.md, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  smallTextContainer: { flex: 1 },
  smallValue: { fontSize: 22, fontWeight: '800', lineHeight: 26 },
  smallTitle: { fontSize: 10, fontWeight: '700', color: THEME.colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  nextClassCard: { flex: 1, borderRadius: THEME.radius.xl, padding: THEME.spacing.xl },
  cardShadowHighlight: {
    ...Platform.select({
      ios: { shadowColor: THEME.colors.primary, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.3, shadowRadius: 16 },
      android: { elevation: 8 }
    }),
  },
  nextClassHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  nextClassBody: { flex: 1, justifyContent: 'center' },
  nextClassTime: { fontSize: THEME.font.display, fontWeight: '900', color: '#FFF', letterSpacing: -1 },
  nextClassBadge: { fontSize: 10, fontWeight: '900', color: '#FFF', opacity: 0.8, letterSpacing: 1.2 },
  nextClassSubject: { fontSize: 19, fontWeight: '700', color: '#FFF', marginTop: 4 },
  nextClassTurma: { fontSize: 14, fontWeight: '500', color: 'rgba(255,255,255,0.8)' },
  sectionHeader: { paddingHorizontal: THEME.spacing.xl, marginTop: THEME.spacing.xxl, marginBottom: THEME.spacing.lg },
  sectionTitle: { fontSize: THEME.font.lg, fontWeight: '800', color: THEME.colors.textPrimary },
  sectionContainer: { paddingHorizontal: THEME.spacing.xl, gap: THEME.spacing.md },
  classItem: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  classTimeContainer: { width: 55, alignItems: 'center' },
  classTimeText: { fontSize: 14, fontWeight: '800', color: THEME.colors.textPrimary },
  classTimeEndText: { fontSize: 11, color: THEME.colors.textSecondary, fontWeight: '500', marginTop: 2 },
  verticalDivider: { width: 3, height: '70%', backgroundColor: '#E2E8F0', marginHorizontal: 16, borderRadius: 2 },
  classContent: { flex: 1 },
  classSubject: { fontSize: 16, fontWeight: '700', color: THEME.colors.textPrimary },
  classTurmaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  classIconWrapper: { padding: 8, backgroundColor: '#EFF6FF', borderRadius: THEME.radius.md },
  classTurma: { fontSize: 13, color: THEME.colors.textSecondary, marginTop: 2 },
  taskItem: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: 15, fontWeight: '600', color: THEME.colors.textPrimary },
  taskClass: { fontSize: 12, color: THEME.colors.textSecondary, marginTop: 2 },
  dateBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 4, borderRadius: THEME.radius.full },
  dateBadgeToday: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA' },
  dateBadgeTomorrow: { backgroundColor: '#FFF7ED', borderWidth: 1, borderColor: '#FED7AA' },
  dateText: { fontSize: 11, fontWeight: '700', color: THEME.colors.textSecondary },
  dateTextToday: { color: THEME.colors.danger },
  dateTextTomorrow: { color: THEME.colors.warning },
  emptyState: {
    padding: THEME.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: THEME.radius.lg,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  emptyText: { color: THEME.colors.textSecondary, fontSize: 14 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: 'bold' }
});