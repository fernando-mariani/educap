import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRIMARY_COLOR = '#275BF5';
const DEEP_INDIGO = '#4F46E5';
const BACKGROUND_COLOR = '#F8FAFC';
const WHITE = '#FFFFFF';
const TEXT_MAIN = '#1E293B';
const TEXT_SUB = '#64748B';
const BORDER_COLOR = '#E2E8F0';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function CriarTurma() {
  const navigation = useNavigation();
  const [nomeTurma, setNomeTurma] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const buttonScale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePressIn = useCallback(() => {
    buttonScale.value = withSpring(0.98, { damping: 20, stiffness: 250 });
  }, []);

  const handlePressOut = useCallback(() => {
    buttonScale.value = withSpring(1, { damping: 20, stiffness: 250 });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <View style={styles.flex1}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex1}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Header */}
            <Animated.View entering={FadeInUp.duration(300)}>
              <LinearGradient
                colors={[PRIMARY_COLOR, DEEP_INDIGO]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.headerGradient, styles.headerShadow]}
              >
                <SafeAreaView edges={['top']} style={styles.headerContent}>
                  <View style={styles.headerRow}>
                    <TouchableOpacity 
                      style={styles.backButton} 
                      activeOpacity={0.8}
                      onPress={() => navigation.goBack()}
                    >
                      <Feather name="arrow-left" size={24} color={WHITE} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Registrar Turma</Text>
                    <View style={{ width: 40 }} />
                  </View>
                </SafeAreaView>
              </LinearGradient>
            </Animated.View>

            {/* Info principal */}
            <Animated.View 
              entering={FadeInUp.duration(300).delay(100)} 
              style={styles.heroContainer}
            >
              <View style={styles.heroIconWrapper}>
                <Feather name="plus-circle" size={40} color={PRIMARY_COLOR} />
              </View>
              <Text style={styles.heroBadge}>Gestão Escolar</Text>
              <Text style={styles.heroTitle}>Criar Nova Turma</Text>
              <Text style={styles.heroSubtitle}>
                Crie turmas para organizar alunos, professores e atividades
              </Text>
            </Animated.View>

            {/* Formulário em Card */}
            <Animated.View 
              entering={FadeInUp.duration(300).delay(150)} 
              style={[styles.card, styles.cardShadow]}
            >
              <Text style={styles.cardSectionTitle}>Informações Básicas</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Nome da Turma</Text>
                <View style={[
                  styles.inputWrapper, 
                  isFocused && styles.inputWrapperFocused
                ]}>
                  <Feather name="book" size={18} color={TEXT_SUB} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: 1º Ano A – Ensino Fundamental"
                    placeholderTextColor={TEXT_SUB}
                    autoCapitalize="words"
                    value={nomeTurma}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChangeText={setNomeTurma}
                  />
                </View>
              </View>

              <AnimatedTouchableOpacity 
                style={[styles.primaryButton, animatedButtonStyle]} 
                activeOpacity={1}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
              >
                <LinearGradient
                  colors={[PRIMARY_COLOR, '#1D4ED8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.primaryButtonText}>Criar Turma</Text>
                  <Feather name="check" size={20} color={WHITE} />
                </LinearGradient>
              </AnimatedTouchableOpacity>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND_COLOR },
  flex1: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  headerGradient: {
    paddingBottom: 24,
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { color: WHITE, fontSize: 18, fontWeight: '700' },
  headerShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  heroContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  heroIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(39, 91, 245, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: TEXT_SUB,
    opacity: 0.6,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: PRIMARY_COLOR,
    letterSpacing: -1,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    color: TEXT_SUB,
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 20,
  },
  card: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
  },
  cardSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_MAIN,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_SUB,
    marginBottom: 8,
    marginLeft: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 56,
  },
  inputWrapperFocused: {
    borderColor: PRIMARY_COLOR,
    backgroundColor: WHITE,
  },
  inputIcon: { marginRight: 12, opacity: 0.7 },
  input: {
    flex: 1,
    fontSize: 15,
    color: TEXT_MAIN,
    fontWeight: '500',
    height: '100%',
  },
  primaryButton: {
    marginTop: 12,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonGradient: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  primaryButtonText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});
