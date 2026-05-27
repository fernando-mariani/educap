import { AlunoContext } from '@/context/Context/AlunoContext';
import { Aulas, AulaTemplate } from '@/types';
import { Feather } from '@expo/vector-icons';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// Configuração do grid e horários
const START_HOUR = 7;
const END_HOUR = 18;
const HOUR_HEIGHT = 100; // Altura de cada hora em pixels
const MINUTE_HEIGHT = HOUR_HEIGHT / 60;
const COLUMN_WIDTH = 150;
const TIME_COLUMN_WIDTH = 55;
const PRIMARY_COLOR = '#2563EB';
const ACCENT_COLOR = '#EF4444';

const DAYS = [
  { id: 1, label: 'SEG', full: 'Segunda' },
  { id: 2, label: 'TER', full: 'Terça' },
  { id: 3, label: 'QUA', full: 'Quarta' },
  { id: 4, label: 'QUI', full: 'Quinta' },
  { id: 5, label: 'SEX', full: 'Sexta' },
];


const getDatesOfWeek = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Dom) a 6 (Sáb)
  
  // Calcula a diferença para chegar na Segunda-feira (1)
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);
  
  return DAYS.map((_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return {
      dayNum: date.getDate(),
      isToday: date.toDateString() === new Date().toDateString(),
      rawDate: date
    };
  });
};

const formatMinutesToTime = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};



export default function WeeklyScheduleScreen() {

  const { getAulas, getAulasTemplates } = useContext(AlunoContext);
  const [aulas, setAulas] = useState<Aulas[]>([] as Aulas[]);
  const [templates, setTemplates] = useState<AulaTemplate[]>([] as AulaTemplate[]);
  const [nowMinutes, setNowMinutes] = useState((new Date().getHours()) * 60 + new Date().getMinutes());
  const dates = useMemo(() => getDatesOfWeek(), []);
  const todayId = new Date().getDay() === 0 ? 7 : new Date().getDay(); // 1-5, skip weekend for grid highlight

  useEffect(() => {
    async function initData() {
      const Auladata = await getAulas();
      const TemplateData = await getAulasTemplates();

      if (TemplateData) setTemplates(TemplateData);
      if (Auladata) setAulas(Auladata);
    }
    initData();
  }, []);

  useEffect(() => {
          const timer = setInterval(() => {
        setNowMinutes(new Date().getHours() * 60 + new Date().getMinutes());
      }, 60000);
  
      return () => clearInterval(timer);
    }, [nowMinutes]);

  const horarioAgora = useMemo(() => formatMinutesToTime(nowMinutes), [nowMinutes]);

  const summary = useMemo(() => {
    const todayClasses = aulas.filter(a => a.diaSemana === todayId);
    const next = todayClasses
      .filter(a => a.horarioInicio > nowMinutes)
      .sort((a, b) => a.horarioInicio - b.horarioInicio)[0];

    return {
      count: todayClasses.length,
      next: next ? formatMinutesToTime(next.horarioInicio) : null
    };
  }, [aulas, nowMinutes]);

  const getRelativeTop = (minutes: number) => {
  return (minutes - START_HOUR * 60) * MINUTE_HEIGHT;
};

const getColorBySubject = (subject: string) => {
    const hash = subject.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    const colors = ['#EFF6FF', '#F0FDF4', '#FFFBEB', '#FEF2F2', '#F5F3FF'];
    
    const template = templates.find(
      (t) => t.professor.materia.toLowerCase() === subject.toLowerCase()
    );

    return { 
      bg: colors[hash % colors.length], 
      border: template ? template.cor : PRIMARY_COLOR 
    };
  };

//componente da aula em cards
const ClassBlock = ({ item }: { item: any }) => {
  const top = getRelativeTop(item.horarioInicio);
  const height = (item.horarioFim - item.horarioInicio) * MINUTE_HEIGHT - 4; // Small gap between blocks
  const theme = getColorBySubject(item.professor.materia);

  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      style={[styles.classBlock, { top, height, backgroundColor: theme.bg, borderLeftColor: theme.border }]}
    >
      <View style={styles.classContent}>
        <View style={styles.blockHeader}>
          <Text style={[styles.subjectText, { color: theme.border }]} numberOfLines={1}>{item.professor.materia}</Text>
          <Feather name="book-open" size={12} color={theme.border} style={{ opacity: 0.6 }} />
        </View>
        <Text style={styles.classText} numberOfLines={1}>{item.turma.nomeTurma}</Text>
        <View style={styles.timeBadge}>
          <Text style={styles.timeText}>
            {formatMinutesToTime(item.horarioInicio)} - {formatMinutesToTime(item.horarioFim)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <Feather name="calendar" size={48} color="#CBD5E1" />
    <Text style={styles.emptyTitle}>Nenhuma aula cadastrada</Text>
    <Text style={styles.emptySubtitle}>Sua agenda está livre para este período.</Text>
  </View>
);

  const SummarySection = () => (
    <View style={styles.summaryCard}>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>AULAS HOJE</Text>
        <Text style={styles.summaryValue}>{summary.count}</Text>
      </View>
      <View style={styles.summaryDivider} />
      <View style={styles.summaryItem}>
        <Text style={styles.summaryLabel}>PRÓXIMA AULA</Text>
        <Text style={styles.summaryValue}>{summary.next || '--:--'}</Text>
      </View>
    </View>
  );
  
  const hourLabels = useMemo(() => {
    const labels = [];
    for (let i = START_HOUR; i <= END_HOUR; i++) {
      labels.push(`${i.toString().padStart(2, '0')}:00`);
    }
    return labels;
  }, []);

  if (aulas.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header />
        <View style={styles.flexCenter}>
          <SummarySection />
          <EmptyState />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <Header />
      <SummarySection />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false}>
        <View>
          {/* Header de Dias */}
          <View style={styles.daysHeaderRow}>
            <View style={{ width: TIME_COLUMN_WIDTH }} />
            {DAYS.map((day, index) => {
              const isToday = dates[index].isToday;
              return (
                <View key={day.id} style={styles.dayHeaderCell}>
                  <Text style={[styles.dayHeaderText, isToday && styles.activeDayText]}>{day.label}</Text>
                  <View style={[styles.dateCircle, isToday && styles.activeDateCircle]}>
                    <Text style={[styles.dateText, isToday && styles.activeDateText]}>{dates[index].dayNum}</Text>
                  </View>
                  {isToday && <Text style={styles.hojeTag}>HOJE</Text>}
                </View>
              );
            })}
          </View>

          {/* Grid */}
          <ScrollView 
            style={styles.gridVerticalScroll} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ height: (END_HOUR - START_HOUR + 1) * HOUR_HEIGHT + 40 }}
          >
            <View style={styles.gridContainer}>
              {/* Horários na Coluna */}
              <View style={styles.timeColumn}>
                {hourLabels.map((label, index) => (
                  <View key={index} style={[styles.timeLabelContainer, { top: index * HOUR_HEIGHT }]}>
                    <Text style={styles.timeLabelText}>{label}</Text>
                  </View>
                ))}
              </View>

              {/* Renderizar os cards de aulas em seus repectivos dias */}
              <View style={styles.columnsWrapper}>
                {DAYS.map((day) => (
                  <View key={day.id} style={[styles.dayColumn, day.id === todayId && styles.todayColumnHighlight]}>
                    
                    {hourLabels.map((_, index) => (
                      <View key={index} style={[styles.gridLine, { top: index * HOUR_HEIGHT }]} />
                    ))}

                    {aulas
                      .filter((item) => Number(item.diaSemana) === day.id)
                      .map((item) => (
                        <ClassBlock key={item.id} item={item} />
                      ))}
                  </View>
                ))}
              </View>
                {/* Indicador de Horário Atual*/}
                {!(nowMinutes < START_HOUR * 60 || nowMinutes > END_HOUR * 60 || todayId > 5) && (
                  <View 
                    style={[
                      styles.currentTimeContainer, 
                      { 
                        top: getRelativeTop(nowMinutes) + 20, // +20 para alinhar com o paddingTop do gridContainer
                        left: 0,
                        width: TIME_COLUMN_WIDTH + (COLUMN_WIDTH * 5),
                        zIndex: 999,
                        elevation: 10 // Necessário para Android
                      }
                    ]} 
                    pointerEvents="none"
                  >
                    <View style={styles.currentTimeLabel}>
                      <Text style={styles.currentTimeLabelText}>{horarioAgora}</Text>
                    </View>
                    <View style={styles.currentTimeLine} />
                    <View style={styles.currentTimeDot} />
                  </View>
                )}
            </View>
            {aulas.length === 0 && <EmptyState />}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const Header = () => (
  <View style={styles.headerContainer}>
    <Text style={styles.headerTitle}>Minha Agenda</Text>
    <Text style={styles.headerSubtitle}>Aulas da semana</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
  },
  daysHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 12,
    borderTopLeftRadius: 24,
  },
  dayHeaderCell: {
    width: COLUMN_WIDTH,
    alignItems: 'center',
  },
  dayHeaderText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  activeDayText: {
    color: PRIMARY_COLOR,
  },
  dateCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  activeDateCircle: {
    backgroundColor: PRIMARY_COLOR,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
  },
  activeDateText: {
    color: '#FFF',
  },
  hojeTag: {
    fontSize: 8,
    fontWeight: '900',
    color: PRIMARY_COLOR,
    marginTop: 2,
  },
  gridVerticalScroll: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  gridContainer: {
    flexDirection: 'row',
    paddingTop: 20,
  },
  todayColumnHighlight: {
    backgroundColor: 'rgba(37, 99, 235, 0.02)',
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  timeColumn: {
    width: TIME_COLUMN_WIDTH,
    alignItems: 'center',
  },
  timeLabelContainer: {
    position: 'absolute',
    height: 20,
    justifyContent: 'center',
  },
  timeLabelText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  columnsWrapper: {
    flexDirection: 'row',
  },
  dayColumn: {
    width: COLUMN_WIDTH,
    borderLeftWidth: 1,
    borderLeftColor: '#F1F5F9',
  },
  currentTimeContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentTimeLabel: {
    backgroundColor: ACCENT_COLOR,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 11,
  },
  currentTimeLabelText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  currentTimeLine: {
    flex: 1,
    height: 2,
    backgroundColor: ACCENT_COLOR,
  },
  currentTimeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ACCENT_COLOR,
    marginLeft: -4,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#F8FAFC',
  },
  classBlock: {
    position: 'absolute',
    left: 4,
    right: 4,
    borderRadius: 12,
    borderLeftWidth: 5,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  classContent: {
    flex: 1,
  },
  blockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  subjectText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  classText: {
    fontSize: 12,
    color: '#1E40AF',
    marginTop: 2,
    fontWeight: '500',
  },
  timeBadge: {
    marginTop: 'auto',
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignSelf: 'flex-start',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  timeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#475569',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#475569',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
  },
});
