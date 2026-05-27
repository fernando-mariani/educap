import { AlunoContext } from '@/context/Context/AlunoContext';
import { Tarefa } from '@/types';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  FadeInLeft,
  FadeInUp,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AtividadesStackParamList } from '../Routes/atividadesRoutes';

const PRIMARY_COLOR = '#275BF5';
const BG_SOFT = '#F8FAFC';
const TEXT_MAIN = '#1E293B';
const TEXT_SUB = '#64748B';
const WHITE = '#FFFFFF';
const BORDER = '#E2E8F0';

// Cores para cada Tipo de Atividade
const getBadgeStyle = (tipo: string) => {
  switch (tipo.toUpperCase()) {
    case 'PROVA':
      return { bg: '#FEF2F2', color: '#EF4444', icon: 'alert-circle' };
    case 'TRABALHO':
      return { bg: '#EFF6FF', color: '#275BF5', icon: 'briefcase' };
    case 'DEVER':
      return { bg: '#ECFDF5', color: '#10B981', icon: 'edit-3' };
    default:
      return { bg: '#F3F4F6', color: '#6B7280', icon: 'file' };
  }
};

//animacao de apertar botao
const PressableScale = ({ children, onPress, style, activeScale = 0.98 }: any) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value
  }));

  return (
    <Pressable
      onPressIn={() => { scale.value = withTiming(activeScale, { duration:100 });
                        opacity.value = withTiming(0.9, { duration:100 }); }}
      onPressOut={() => { scale.value = withTiming(1, { duration:120 });
                        opacity.value = withTiming(1, { duration:120 }); }}
      onPress={onPress}
    >
      <Animated.View style={[style, animatedStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

interface Props {
  navigation: NativeStackNavigationProp<AtividadesStackParamList>;
}

const formatarDataDDMM = (data: string) => {
  if (!data || !data.includes('/')) return 0;

  const [dia, mes] = data.split("/").map(Number);

  return new Date(new Date().getFullYear(), mes - 1, dia).getTime();
};

export default function Atividades() {
    const navigation = useNavigation<Props['navigation']>();
    const isFocused = useIsFocused();
    const {  getTarefas, getTiposTarefas } = useContext(AlunoContext);

  const [tarefas, setTarefas] = useState<Tarefa[]>([] as Tarefa[]);
  const [tiposCadastrados, setTiposCadastrados] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  
  // Estados de Filtro
  const [filterTipo, setFilterTipo] = useState<string | null>(null);
  const [sortAscending, setSortAscending] = useState(true);


  useFocusEffect(
    useCallback(() => {
      async function initData() {
        const [dataTarefas, dataTipos] = await Promise.all([
          getTarefas(),
          getTiposTarefas()
        ]);
        
        if (dataTarefas) setTarefas(dataTarefas);
        if (dataTipos) setTiposCadastrados(dataTipos.map((t: any) => t.tipo));
      }
      initData();
    }, [])
  );

  // Lógica de Filtragem e Ordenação
  const filteredTarefas = useMemo(() => {
    let result = [...tarefas];
    if (filterTipo) {
      result = result.filter(t => 
        t.tipoTarefa.tipo.trim().toUpperCase() === filterTipo.toUpperCase()
      );
    }
    
    if (searchText) {
      result = result.filter(t => 
        t.nomeTarefa.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    const now = new Date();
    const todayStart = now.setHours(0, 0, 0, 0);

    const sortFn = (a: Tarefa, b: Tarefa) => {
      const dateA = formatarDataDDMM(a.dataLimite) as number;
      const dateB = formatarDataDDMM(b.dataLimite) as number;
      return sortAscending ? dateA - dateB : dateB - dateA;
    };

    const active = result.filter(t => (formatarDataDDMM(t.dataLimite) as number) >= todayStart).sort(sortFn);
    const expired = result.filter(t => (formatarDataDDMM(t.dataLimite) as number) < todayStart).sort(sortFn);
    
    return [...active, ...expired];
  }, [tarefas, filterTipo, sortAscending, searchText]);

  if (!tarefas) {
    return null;
  }

  const renderItem = ({ item, index }: { item: typeof tarefas[0]; index: number}) => {
    const badge = getBadgeStyle(item.tipoTarefa.tipo);
    const deadlineTime = formatarDataDDMM(item.dataLimite) as number;
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const isExpired = deadlineTime < todayStart;
    const isRecent = !isExpired && deadlineTime <= todayStart; // Hoje

    return (
      <Animated.View 
        entering={FadeInUp.duration(300).delay(index * 40)}
        layout={Layout.duration(250)}
      >
        <PressableScale 
        style={[styles.card, styles.cardShadow, { overflow: 'hidden' }, isExpired && { opacity: 0.45, backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' }]}
        onPress={() => navigation.navigate('detalhesTarefa', { id: item.id })}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.badge, { backgroundColor: isExpired ? '#E2E8F0' : badge.bg }]}>
            <Feather name={badge.icon as any} size={14} color={isExpired ? TEXT_SUB : badge.color} style={{ marginRight: 4 }} />
            <Text style={[styles.badgeText, { color: isExpired ? TEXT_SUB : badge.color }]}>{item.tipoTarefa.tipo}</Text>
          </View>
          <View style={styles.gradeContainer}>
             <Text style={[styles.gradeLabel, isExpired && { color: TEXT_SUB }]}>⭐ {item.notaTarefa.toFixed(1)} pts</Text>
          </View>
        </View>

        <Text style={[styles.cardTitle, isExpired && { color: TEXT_SUB }]}>{item.nomeTarefa}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>{item.descricaoTarefa}</Text>

        <View style={styles.cardFooter}>
          <View style={styles.footerMeta}>
            <View style={styles.footerInfo}>
              <Feather name="users" size={16} color={isExpired ? TEXT_SUB : PRIMARY_COLOR} style={{ marginRight: 4 }} />
              <Text style={[styles.footerText, isExpired && { color: TEXT_SUB }]}>{item.turma.nomeTurma}</Text>
            </View>
            <View style={[styles.footerInfo, { marginLeft: 12 }, isExpired && { borderLeftWidth: 1, borderLeftColor: '#CBD5E1', paddingLeft: 12 }]}>
              <Feather name="calendar" size={16} color={isRecent ? '#EF4444' : TEXT_SUB} style={{ marginRight: 4 }} />
              <Text style={[styles.footerText, isRecent ? { color: '#EF4444' } : { color: TEXT_SUB }]}>
                {item.dataLimite.split('-').reverse().join('/')}
              </Text>
            </View>
          </View>
        </View>
        </PressableScale>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={BG_SOFT} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={{ flex: 1 }}>
          {/* Header */}
          <Animated.View entering={FadeInUp.duration(400)} style={styles.header}>
            <View style={styles.headerIconContainer}>
              <Feather name="layers" size={28} color="#FFF" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Atividades Cadastradas</Text>
              <Text style={styles.headerSubtitle}>Gerencie suas avaliações</Text>
            </View>
          </Animated.View>

          {/* Barra de Busca */}
          <Animated.View entering={FadeInLeft.duration(250).delay(30)} style={styles.searchSection}>
            <View style={styles.searchWrapper}>
              <Feather name="search" size={18} color={TEXT_SUB} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por título..."
                placeholderTextColor={TEXT_SUB}
                value={searchText}
                onChangeText={setSearchText}
              />
              {searchText !== '' && (
                <TouchableOpacity onPress={() => setSearchText('')}>
                  <Feather name="x-circle" size={18} color={TEXT_SUB} />
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>

          {/* Barra de Filtros */}
          <View style={styles.filterContainer}>
            <Animated.View entering={FadeInUp.duration(250).delay(150)} style={styles.secondaryFilterRow}>
              <PressableScale 
                style={styles.sortButton} 
                onPress={() => setSortAscending(!sortAscending)}
              >
                <Feather name={sortAscending ? "trending-up" : "trending-down"} size={16} color={PRIMARY_COLOR} />
                <Text style={styles.sortButtonText}>{sortAscending ? "Mais próximas" : "Mais distantes"}</Text>
              </PressableScale>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {tiposCadastrados.map(tipo => (
                  <PressableScale 
                    key={tipo}
                    style={[styles.typeChip, filterTipo === tipo && styles.typeChipActive, { marginRight: 8 }]}
                    onPress={() => setFilterTipo(filterTipo === tipo ? null : tipo)}
                  >
                    <Text style={[styles.typeText, filterTipo === tipo && styles.typeTextActive]}>{tipo}</Text>
                  </PressableScale>
                ))}
              </ScrollView>
            </Animated.View>
          </View>

          {/* Lista de Cards de Tarefas */}
          <FlatList
            data={filteredTarefas}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <View style={styles.emptyIconCircle}>
                  <Feather name="file-text" size={40} color={TEXT_SUB} />
                </View>
                <Text style={styles.emptyStateTitle}>Nenhuma atividade encontrada</Text>
                <Text style={styles.emptyStateText}>Tente ajustar seus filtros.</Text>
              </View>
            }
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_SOFT },
  safeArea: { 
    flex: 1, 
    backgroundColor: BG_SOFT
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 8,
  },
  headerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: TEXT_MAIN },
  headerSubtitle: { fontSize: 14, color: TEXT_SUB, marginTop: 2 },
  

  searchSection: { paddingHorizontal: 24, marginBottom: 8 },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 15, color: TEXT_MAIN, fontWeight: '500' },

  filterContainer: { paddingBottom: 12 },
  filterScroll: { paddingHorizontal: 24, paddingVertical: 12 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: { backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR },
  filterText: { fontSize: 13, fontWeight: '600', color: TEXT_SUB },
  filterTextActive: { color: '#FFF' },
  
  secondaryFilterRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 24,
    marginTop: 0,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 12,
  },
  sortButtonText: { fontSize: 12, fontWeight: '700', color: PRIMARY_COLOR, marginLeft: 6 },
  typeChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  typeChipActive: { backgroundColor: TEXT_MAIN },
  typeText: { fontSize: 11, fontWeight: 'bold', color: TEXT_SUB },
  typeTextActive: { color: '#FFF' },

  listContent: { 
    paddingHorizontal: 20, 
    paddingBottom: 100 
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  gradeContainer: {
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  gradeLabel: { fontSize: 13, fontWeight: 'bold', color: '#0369A1' },
  cardTitle: { fontSize: 18, fontWeight: '800', color: TEXT_MAIN, marginBottom: 6 },
  cardDescription: {
    fontSize: 14,
    color: TEXT_SUB,
    lineHeight: 20,
    marginBottom: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    paddingTop: 14,
  },
  footerMeta: { flexDirection: 'row', alignItems: 'center' },
  footerInfo: { flexDirection: 'row', alignItems: 'center' },
  footerText: { fontSize: 13, color: TEXT_MAIN, fontWeight: '700' },
  deleteIconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyState: { 
    alignItems: 'center', 
    marginTop: 60, 
    paddingHorizontal: 40 
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TEXT_MAIN,
    marginBottom: 8
  },
  emptyStateText: { 
    marginTop: 12, 
    textAlign: 'center', 
    color: TEXT_SUB, 
    fontSize: 15,
    lineHeight: 22
  },
  emptyStateButton: {
    marginTop: 24,
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
  },
  emptyStateButtonText: {
    color: WHITE,
    fontWeight: 'bold',
    fontSize: 16
  },
});