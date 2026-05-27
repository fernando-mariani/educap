import { useAppContext } from '@/context/Context/appContext';
import { Turma } from '@/types';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
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
import { TurmasStackParamList } from '../Routes/TurmaRoutes';

const THEME = {
  colors: {
    primary: '#2563EB',
    secondary: '#4F46E5',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    textMain: '#1E293B',
    textSub: '#64748B',
    white: '#FFFFFF',
    blueTint: '#EFF6FF',
    purpleTint: '#F5F3FF',
    border: 'rgba(226, 232, 240, 0.6)',
  },
  spacing: {
    xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32
  }
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

type NavigationProps = NativeStackNavigationProp<
  TurmasStackParamList,
  'TurmasManager'
>;

export default function TurmasManager() {

  const navigation = useNavigation<NavigationProps>();
  const { getTurmas } = useAppContext();

  const [turmas, setTurmas] = useState<Turma[]>([] as Turma[]);

  //pegar dados iniciais
  useEffect(() => {
    async function initData() {
      const data = await getTurmas();
      if (data) {
        setTurmas(data);
      }
    }

    initData();
  }, []);

  //retornar null enquanto nao tiver turma
  if(!turmas){
    return null;
  }

  const TurmaCard = ({ item, index }: { item: typeof turmas[0], index: number }) => {
    const scale = useSharedValue(1);
    
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }]
    }));

    const handlePressIn = () => {
      scale.value = withSpring(0.97, { damping: 20, stiffness: 240 });
    };

    const handlePressOut = () => {
      scale.value = withSpring(1, { damping: 20, stiffness: 240 });
    };

    return (
      <AnimatedTouchableOpacity 
        style={[styles.card, animatedStyle]}
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => navigation.navigate('TurmaDetails', { id: item.id })}
        entering={FadeInUp.delay(100 + Math.min(index * 40, 200)).duration(300)}
      >
        <View style={styles.accentBar} />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Feather name="book-open" size={18} color={THEME.colors.primary} />
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.cardTitle}>{item.nomeTurma}</Text>
              <Text style={styles.cardSubtitle}>Instituição Educap</Text>
            </View>
          </View>

          <View style={styles.infoGrid}>
            <View style={[styles.pill, { backgroundColor: THEME.colors.blueTint }]}>
              <Feather name="users" size={14} color={THEME.colors.primary} style={styles.infoIcon} />
              <Text style={[styles.pillText, { color: THEME.colors.primary }]}>{item.numAlunos} Alunos</Text>
            </View>
            <View style={[styles.pill, { backgroundColor: THEME.colors.purpleTint }]}>
              <Feather name="user-check" size={14} color={THEME.colors.secondary} style={styles.infoIcon} />
              <Text style={[styles.pillText, { color: THEME.colors.secondary }]}>{item.numProfessores} Profs</Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.detailsLink}>Ver detalhes</Text>
            <Feather name="arrow-right" size={16} color={THEME.colors.primary} />
          </View>
        </View>
      </AnimatedTouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <Animated.View entering={FadeInUp.duration(350)}>
        <LinearGradient
          colors={[THEME.colors.primary, THEME.colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <SafeAreaView edges={['top']} style={styles.headerContent}>
            <View style={styles.headerRow}>
              <View style={styles.headerTextWrapper}>
                <Text style={styles.headerTitle}>Gestão de Turmas</Text>
                <Text style={styles.headerSubtitle}>{turmas.length} turmas cadastradas</Text>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </Animated.View>

      <Animated.View style={styles.flex1} entering={FadeInUp.delay(100).duration(300)}>
        <FlatList
          data={turmas}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => <TurmaCard item={item} index={index} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      </Animated.View>

      <Animated.View 
        entering={FadeIn.delay(200).duration(250)}
        style={styles.fabContainer}
      >
        <TouchableOpacity 
          style={styles.fab} 
          activeOpacity={0.8} 
          onPress={() => navigation.navigate('TurmaRegister')}
        >
          <Feather name="plus" size={30} color="#FFF" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  flex1: { flex: 1 },
  headerGradient: {
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    paddingHorizontal: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTextWrapper: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: { elevation: 3 },
    }),
  },
  accentBar: {
    width: 4,
    backgroundColor: THEME.colors.primary,
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: THEME.colors.blueTint,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: THEME.colors.textMain,
  },
  cardSubtitle: {
    fontSize: 12,
    color: THEME.colors.textSub,
    fontWeight: '500',
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  infoIcon: {
    marginRight: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  detailsLink: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.primary,
    marginRight: 4,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 24,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: THEME.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: THEME.colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: { elevation: 6 },
    }),
  },
});