import { ProfessorContext } from '@/context/Context/ProfessorContext';
import { Aulas, Turma } from '@/types';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';


const { width } = Dimensions.get('window');

const THEME = {
  colors: {
    primary: '#2563EB',
    secondary: '#4F46E5',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    textMain: '#1E293B',
    textSub: '#64748B',
    border: '#E2E8F0',
    accentBlue: '#DBEAFE',
    accentPurple: '#EDE9FE',
    accentGreen: '#DCFCE7',
    white: '#FFFFFF',
  },
  spacing: {
    container: 24,
    cardGap: 16,
  },
  radius: {
    card: 20,
    pill: 10,
  }
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);


export default function Turmas() {
  const navigation = useNavigation<any>();

  const { getTurmas, getAulas, professor } = useContext(ProfessorContext);

  const[turmas, setTurmas] = useState<Turma[]>([] as Turma[]);
  const[aulas, setAulas] = useState<Aulas[]>([] as Aulas[]);

    useEffect(() => {
      async function initData() {
        const turmasData = await getTurmas();
        if (turmasData) {
          setTurmas(turmasData.filter((t: Turma) => professor.turmas.filter((professorTurma) => professorTurma.id === t.id).length > 0));
        }
        const aulasData = await getAulas();
        if (aulasData) {
          setAulas(aulasData);
        }
      }
  
      initData();
    }, []);

    const ClassCard = ({ item, index }: { item: typeof turmas[0], index: number }) => {
        const scale = useSharedValue(1);
        const opacity = useSharedValue(1);

        const animatedStyle = useAnimatedStyle(() => ({
            transform: [{ scale: scale.value }],
            opacity: opacity.value
        }));

        const handlePressIn = () => {
            scale.value = withTiming(0.97, { duration: 100 });
            opacity.value = withTiming(0.85, { duration: 100 });
        };
        const handlePressOut = () => {
            scale.value = withTiming(1, { duration: 120 });
            opacity.value = withTiming(1, { duration: 120 });
        };

        return (
            <Animated.View entering={FadeInDown.delay(index * 100).duration(400)}>
            <AnimatedTouchableOpacity
                activeOpacity={1}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[styles.card, animatedStyle]}
                onPress={() => navigation.navigate('DetalhesTurma', { id: item.id })}
            >
                <View style={styles.cardIconBox}>
                    <Feather name="book-open" size={22} color={THEME.colors.primary} />
                </View>
                
                <View style={styles.cardMainContent}>
                    <View style={styles.cardLeft}>
                        <Text style={styles.className} numberOfLines={1}>{item.nomeTurma}</Text>
                        <Text style={styles.classLevel}>{aulas.filter(a => a.turma.id === item.id).length} aulas semanais com essa turma</Text>
                    </View>

                    <View style={styles.cardRight}>
                        <View style={[styles.pill, { backgroundColor: THEME.colors.accentBlue }]}>
                            <Feather name="users" size={12} color={THEME.colors.primary} />
                            <Text style={[styles.pillText, { color: THEME.colors.primary }]}>{item.numAlunos || 0}</Text>
                        </View>

                        <View style={[styles.pill, { backgroundColor: THEME.colors.accentPurple }]}>
                            <Feather name="award" size={12} color={THEME.colors.secondary} />
                            <Text style={[styles.pillText, { color: THEME.colors.secondary }]}>{item.numProfessores || 0}</Text>
                        </View>
                    </View>
                </View>
            </AnimatedTouchableOpacity>
            </Animated.View>
        );
};

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <LinearGradient
        colors={[THEME.colors.primary, THEME.colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <SafeAreaView style={styles.headerSafeArea} edges={['top']}>
          <View style={styles.navBar}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Feather name="chevron-left" size={26} color={THEME.colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.headerTextWrapper}>
            <Text style={styles.title}>Minhas Turmas</Text>
            <Text style={styles.subtitle}>Gerencie o progresso e atividades</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.contentContainer}>
        <FlatList
          data={turmas}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => <ClassCard item={item} index={index} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Feather name="inbox" size={40} color={THEME.colors.textSub} />
              <Text style={styles.emptyText}>Nenhuma turma encontrada</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },

  headerGradient: {
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    zIndex: 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 },
      android: { elevation: 8 }
    }),
  },

  headerSafeArea: {
    paddingHorizontal: THEME.spacing.container,
  },

  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -4,
  },

  addButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTextWrapper: {
    marginTop: 4,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: THEME.colors.white,
    letterSpacing: -0.8,
  },

  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    fontWeight: '500',
  },

  contentContainer: {
    flex: 1,
    marginTop: -12,
  },

  list: {
    paddingHorizontal: THEME.spacing.container,
    paddingTop: 20,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.card,
    marginBottom: THEME.spacing.cardGap,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
      android: { elevation: 3 },
    }),
  },

  cardIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  cardMainContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardLeft: {
    flex: 1,
  },

  className: {
    fontSize: 17,
    fontWeight: '800',
    color: THEME.colors.textMain,
    letterSpacing: -0.3,
  },

  classLevel: {
    fontSize: 12,
    color: THEME.colors.textSub,
    fontWeight: '500',
    marginTop: 2,
  },

  cardRight: {
    alignItems: 'flex-end',
    gap: 6,
  },

  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
    minWidth: 48,
    justifyContent: 'center',
  },

  pillText: {
    fontSize: 11,
    fontWeight: '800',
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },

  emptyText: {
    color: THEME.colors.textSub,
    marginTop: 12,
    fontSize: 15,
    fontWeight: '500',
  },
});