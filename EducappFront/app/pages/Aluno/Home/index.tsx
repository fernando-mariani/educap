import { AlunoContext } from '@/context/Context/AlunoContext';
import { Aulas, Publicacao, Tarefa } from '@/types';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { SafeAreaView } from "react-native-safe-area-context";
const { width } = Dimensions.get('window');

const PRIMARY_BLUE = '#275BF5';
const DEEP_INDIGO = '#4F46E5';
const BG_SOFT = '#F8FAFC';
const TEXT_MAIN = '#1E293B';
const TEXT_SUB = '#64748B';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const TODAY = new Date().toISOString().split('T')[0];
const NOW_IN_MINUTES = new Date().getHours() * 60 + new Date().getMinutes();


const formartarTimestamp = (timestamp: number) => {
  const data = new Date(timestamp);
  const today = new Date();
  const dia = data.getDate().toString().padStart(2, '0');
  const mes = (data.getMonth() + 1).toString().padStart(2, '0');
  const ano = data.getFullYear();
  const horas = data.getHours().toString().padStart(2, '0');
  const minutos = data.getMinutes().toString().padStart(2, '0');

  //verifica se é hoje o timestamp
  if(data.getDate() === today.getDate() && data.getMonth() === today.getMonth() && data.getFullYear() === today.getFullYear()) {
    //verifica se faz menos de uma hora o timestamp, retornando os minutos passados se sim, se nao, retorna as horas passadas
    if(((today.getMinutes() + 60 * today.getHours()) - (data.getMinutes() + 60 * data.getHours())) < 60)  return `${(today.getMinutes() + 60 * today.getHours()) - (data.getMinutes() + 60 * data.getHours())} minutos atrás`;
    return `${today.getHours() - data.getHours()} horas atrás`;
  }

  //verifica se foi ontem o timestamp
  if(data.getDate() === today.getDate() - 1) {
    //verifica se faz menos de uma hora o timestamp, retornando as horas passadas se sim
    if((24 - data.getHours()) + today.getHours() < 24){
      return `${(24 - data.getHours()) + today.getHours()} horas atrás`;
    }
    return 'Ontem';
  }

  //verifica se foi nesse mes o timestamp, se sim ele retorna os dias passados
  if(data.getMonth() == today.getMonth()) {
    return `${today.getDate() - data.getDate()} dias atrás`;
  }

  //retorna a data completa se nao for desse ano
  return `${dia}/${mes}/${ano}`;
};

const parseDateToISO = (dateStr: string) => {
  if (!dateStr) return '';
  if (dateStr.includes('-')) return dateStr;
  const [day, month] = dateStr.split('/');
  return `2026-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

export default function AlunoHome() {
    const navigation = useNavigation<any>();
    const {aluno, getAulas, getTarefas, getPublicacoes} = useContext(AlunoContext);

    const[aulas, setAulas] = useState<Aulas[]>([] as Aulas[]);
    const[tarefas, setTarefas] = useState<Tarefa[]>([] as Tarefa[]);
    const[publicacoes, setPublicacoes] = useState<Publicacao[]>([] as Publicacao[]);

    const scaleNextClass = useSharedValue(1);
    const scaleTasks = useSharedValue(1);

    const animatedNextClassStyle = useAnimatedStyle(() => ({ transform: [{ scale: scaleNextClass.value }] }));
    const animatedTasksStyle = useAnimatedStyle(() => ({ transform: [{ scale: scaleTasks.value }] }));

    
    useEffect(() => {
      if (!aluno?.id) return;

      async function initData() {
        const aulasData = await getAulas();
        if (aulasData) {
          setAulas(aulasData);
        }
        const tarefasData = await getTarefas();
        if (tarefasData) {
          setTarefas(tarefasData);
        }
        const publicacoesData = await getPublicacoes();
        if (publicacoesData) {
          setPublicacoes(publicacoesData);
        }
      }
  
      initData();
    }, [aluno?.id]);

    useFocusEffect(
      React.useCallback(() => {
        if (!aluno?.id) return;

        async function initData() {
          const aulasData = await getAulas();
          if (aulasData) {
            setAulas(aulasData);
          }
          const tarefasData = await getTarefas();
          if (tarefasData) {
            setTarefas(tarefasData);
          }
        }
    
        initData();
      }, [aluno?.id])
    );

    const nextClass = useMemo(() => {
      if (aulas.length === 0) return null;

      return [...aulas.filter(a => a.diaSemana === new Date().getDay())].filter(a => a.horarioInicio > NOW_IN_MINUTES).sort((a, b) => a.horarioInicio - b.horarioInicio)[0];
    }, [aulas]);

    const formatTime = (minutes: number) => {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    if(!aluno || !aluno.nome) {
      return null;
    }
   
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        
        <ScrollView 
          style={styles.flex1}
          contentContainerStyle={styles.scrollPadding}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View entering={FadeInUp.duration(300)}>
            <LinearGradient
              colors={[PRIMARY_BLUE, DEEP_INDIGO]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerGradient}
            >
            <SafeAreaView edges={['top']} style={styles.headerContent}>
              <View style={styles.headerRow}>
                <View style={styles.profileSection}>
                  <View style={styles.avatarWrapper}>
                    <Feather name="user" size={22} color={PRIMARY_BLUE} />
                  </View>
                  <View style={styles.greetingWrapper}>
                    <Text style={styles.greetingText}>Olá, {aluno.nome.split(' ')[0]} 👋</Text>
                    <Text style={styles.subGreetingText}>
                      {aulas.length > 0 ? `Você tem ${aulas.filter(a => a.diaSemana === new Date().getDay()).length} aulas hoje` : 'Nenhuma aula agendada'}
                    </Text>
                  </View>  
                </View>
              </View>
            </SafeAreaView>
            </LinearGradient>
          </Animated.View>

          {/* Card de próxima aula e tarefas para fazer */}
          <Animated.View 
            entering={FadeInUp.duration(300).delay(100)} 
            style={styles.summaryGrid}
          >
            <AnimatedTouchableOpacity 
              style={[styles.summaryCard, styles.cardShadow, animatedNextClassStyle]} 
              activeOpacity={0.8}
              onPressIn={() => { scaleNextClass.value = withSpring(0.98, { damping: 20, stiffness: 250 }); }}
              onPressOut={() => { scaleNextClass.value = withSpring(1, { damping: 20, stiffness: 250 }); }}
              onPress={() => navigation.navigate('Aulas')}
            >
              <View style={styles.summaryIconBox}>
                <Feather name="clock" size={18} color={PRIMARY_BLUE} />
              </View>
              <View style={styles.flex1}>
                <Text style={styles.summaryLabel}>Próxima Aula</Text>
                <Text style={[styles.summaryValue, !nextClass && styles.summaryValueEmpty]}>
                  {nextClass ? formatTime(nextClass.horarioInicio) : 'Sem aulas'}
                </Text>
                <Text style={styles.summaryDetail} numberOfLines={1}>
                  {nextClass ? nextClass.turma.nomeTurma : 'Dia livre'}
                </Text>
              </View>
              <Feather name="chevron-right" size={16} color={TEXT_SUB} style={styles.cardChevron} />
            </AnimatedTouchableOpacity>

            <AnimatedTouchableOpacity 
              style={[styles.summaryCard, styles.cardShadow, animatedTasksStyle]} 
              activeOpacity={0.8}
              onPressIn={() => { scaleTasks.value = withSpring(0.98, { damping: 20, stiffness: 250 }); }}
              onPressOut={() => { scaleTasks.value = withSpring(1, { damping: 20, stiffness: 250 }); }}
              onPress={() => navigation.navigate('Atividades', { screen: 'Atividades' })}
            >
              <View style={[styles.summaryIconBox, { backgroundColor: '#FEF2F2' }]}>
                <Feather name="edit-3" size={18} color="#EF4444" />
              </View>
              <View style={styles.flex1}>
                <Text style={styles.summaryLabel}>Tarefas</Text>
                <Text style={[styles.summaryValue, { color: '#EF4444' }]}>{tarefas.filter(t => parseDateToISO(t.dataLimite) >= TODAY).length}</Text>
                <Text style={styles.summaryDetail}>Para fazer</Text>
              </View>
              <Feather name="chevron-right" size={16} color={TEXT_SUB} style={styles.cardChevron} />
            </AnimatedTouchableOpacity>
          </Animated.View>

          {/* Açoes Rapidas */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          </View>
          <Animated.View 
            entering={FadeInUp.duration(250).delay(150)} 
            style={styles.quickActionsContainer}
          >
            <ActionCard 
              icon="book-open" 
              label="Sua Turma" 
              color="#3B82F6"
              onPress={() => navigation.navigate('Turma')}
            />
            <ActionCard 
              icon="pie-chart" 
              label="Relatório" 
              color="#F59E0B"
              onPress={() => navigation.navigate('Dashboard')}
            />
          </Animated.View>

          {/* Feed de publicações */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Feed de Publicações</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Feed")}><Text style={styles.seeMoreText}>Ver tudo</Text></TouchableOpacity>
          </View>
          
          <View style={styles.feedContainer}>
            {publicacoes.slice(0, 4).sort((a, b) => new Date(b.dataRegistro).getTime() - new Date(a.dataRegistro).getTime()).map(post => (
              <View key={post.id} style={[styles.feedCard, styles.cardShadow]}>
                <View style={styles.postHeader}>
                  <View style={styles.postAvatar}>
                    <Feather name='user' size={18} color={PRIMARY_BLUE} />
                  </View>
                  <View style={styles.postMeta}>
                    <Text style={styles.postAuthor} numberOfLines={1}>
                      {post.diretor.nome} <Text style={styles.postRole}>• {formartarTimestamp(post.dataRegistro)}</Text>
                    </Text>
                  </View>
                </View>
                <View style={styles.postBody}>
                  <Text style={styles.postTitleText}>{post.titulo}</Text>
                  <Text style={styles.postContent}>{post.descricao}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
      
    );
}

const ActionCard = ({ icon, label, color, onPress, style }: any) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 20, stiffness: 250 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 20, stiffness: 250 });
  };

  return (
    <AnimatedTouchableOpacity 
      style={[styles.actionCard, style, animatedStyle]} 
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <View style={[styles.actionIconWrapper, { backgroundColor: color + '15' }]}>
        <Feather name={icon} size={24} color={color} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_SOFT },
  flex1: { flex: 1 },
  scrollPadding: { paddingBottom: 40 },
  headerGradient: {
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: { paddingHorizontal: 24, paddingTop: 8 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  profileSection: { flexDirection: 'row', alignItems: 'center' },
  avatarWrapper: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingWrapper: { marginLeft: 12 },
  greetingText: { color: '#FFF', fontSize: 17, fontWeight: 'bold' },
  subGreetingText: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 1 },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 24,
  },
  summaryCard: {
    width: '48%',
    borderRadius: 20,
    padding: 18,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  summaryIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  summaryLabel: { fontSize: 11, color: TEXT_SUB, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  summaryValue: { fontSize: 20, fontWeight: '800', color: PRIMARY_BLUE, marginTop: 4, marginBottom: 2 },
  summaryValueEmpty: { color: TEXT_SUB, fontSize: 16 },
  summaryDetail: { fontSize: 12, color: TEXT_SUB, fontWeight: '500' },
  cardChevron: {
    alignSelf: 'center',
    opacity: 0.4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 28,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: TEXT_MAIN },
  seeMoreText: { color: PRIMARY_BLUE, fontWeight: '600', fontSize: 14 },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '47%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 2,
  },
  fullWidthCard: {
    width: '100%',
  },
  actionIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionLabel: { fontSize: 14, fontWeight: '600', color: TEXT_MAIN },
  feedContainer: { paddingHorizontal: 20 },
  feedCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  postHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  postAvatar: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    backgroundColor: '#EFF6FF', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  postMeta: { marginLeft: 10, flex: 1 },
  postAuthor: { fontSize: 13, fontWeight: '700', color: TEXT_MAIN },
  postRole: { fontSize: 12, color: TEXT_SUB, fontWeight: '400' },
  postBody: { marginTop: 2 },
  postTitleText: { fontSize: 18, fontWeight: '800', color: TEXT_MAIN, marginBottom: 6, letterSpacing: -0.4 },
  postContent: { fontSize: 14, color: TEXT_SUB, lineHeight: 20 },
});