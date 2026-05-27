import { useAppContext } from '@/context/Context/appContext';
import { DiretorContext } from '@/context/Context/DiretorContext';
import GlobalLoading from '@/context/Context/GlobalLoading';
import { AulaTemplateDTO, Professor } from '@/types';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRIMARY_COLOR = '#275BF5';
const BACKGROUND_COLOR = '#F8FAFC';
const TEXT_MAIN = '#1F2937';
const TEXT_SUB = '#6B7280';
const INPUT_BG = '#FFFFFF';
const BORDER_COLOR = '#F1F5F9';

const COLOR_PALETTE = [
  '#275BF5', '#16A34A', '#D97706', '#DC2626', 
  '#7C3AED', '#DB2777', '#0D9488', '#F59E0B', 
  '#6366F1', '#14B8A6', '#F43F5E', '#8B5CF6',
  '#475569', '#1E293B'
];

export default function CriarTemplate() {
  const navigation = useNavigation();
  const {gerarError} = useAppContext();
  const {getProfessores, criarTemplate} = useContext(DiretorContext);

  const [professorList, setProfessorList] = useState<Professor[]>([] as Professor[]);

  useEffect(() => {
    async function initData() {
      const professores = await getProfessores();
      if(professores) {
        setProfessorList(professores);
      }
    }

    initData();
  }, []);

  if(!professorList) {
    return <GlobalLoading />;
  }
  
  // Estados do formulário
  const [color, setColor] = useState('#275BF5');
  const [duration, setDuration] = useState('50');
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [selectedTurmas, setSelectedTurmas] = useState<string[]>([]);

  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Estados dos Modais
  const [colorModalVisible, setColorModalVisible] = useState(false);
  const [professorModalVisible, setProfessorModalVisible] = useState(false);
  const [turmasModalVisible, setTurmasModalVisible] = useState(false);

  const [aulaTemplate, setAulaTemplate] = useState<AulaTemplateDTO>();

  const toggleTurma = (id: string) => {
    if (selectedTurmas.includes(id)) {
      setSelectedTurmas(selectedTurmas.filter(t => t !== id));
    } else {
      setSelectedTurmas([...selectedTurmas, id]);
    }
  };

  // Animação para o botão de submit
  const buttonScale = React.useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(buttonScale, { toValue: 0.96, useNativeDriver: true }).start();
  };
  const onPressOut = () => {
    Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();
  };

  useEffect(() => {
    console.log("Dados para envio:", aulaTemplate);
  }, [aulaTemplate])

  const submit = () => {
    if (!selectedProfessor || selectedTurmas.length === 0) {
      gerarError("Aviso", "Selecione um professor e pelo menos uma turma antes de enviar.");
      return;
    }

    criarTemplate({
        cor: color,
        duracao: parseInt(duration),
        idProfessor: selectedProfessor.id,
        idTurmas: selectedTurmas
    })
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={BACKGROUND_COLOR} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Cabeçalho */}
            <View style={styles.headerContainer}>
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
              >
                <Feather name="arrow-left" size={24} color={PRIMARY_COLOR} />
              </TouchableOpacity>
              <View style={styles.logoContainer}>
                <Feather name="layers" size={24} color="#FFF" />
              </View>
              <Text style={styles.welcomeText}>CONFIGURAÇÃO</Text>
              <Text style={styles.brandText}>Novo Template</Text>
              <Text style={styles.subtitleText}>Defina as regras básicas para as aulas</Text>
            </View>

            {/* Card do Formulário */}
            <View style={styles.card}>
              
              {/* Input de Cor */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Cor do Template</Text>
                <TouchableOpacity 
                  activeOpacity={0.7}
                  style={[
                    styles.inputWrapper, 
                    colorModalVisible && styles.inputWrapperFocused
                  ]} 
                  onPress={() => {
                    setColorModalVisible(true);
                  }}
                >
                  <View style={[styles.colorPreview, { backgroundColor: color }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.inputText, { fontWeight: '700', color: color }]}>Visual do Card</Text>
                    <Text style={{ fontSize: 11, color: TEXT_SUB }}>Toque para alterar a cor</Text>
                  </View>
                  <Feather name="chevron-down" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* Input de Duração */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Duração (em minutos)</Text>
                <View style={[
                    styles.inputWrapper, 
                    focusedField === 'duration' && styles.inputWrapperFocused
                ]}>
                  <Feather name="clock" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="50"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={duration}
                    onFocus={() => setFocusedField('duration')}
                    onBlur={() => setFocusedField(null)}
                    onChangeText={setDuration}
                  />
                  <Text style={styles.unitText}>min</Text>
                </View>
                <Text style={styles.helperText}>Tempo padrão estimado para cada aula.</Text>
              </View>

              {/* Select de Professor */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Professor</Text>
                <TouchableOpacity 
                  activeOpacity={0.7}
                  style={[
                    styles.inputWrapper, 
                    professorModalVisible && styles.inputWrapperFocused
                  ]} 
                  onPress={() => setProfessorModalVisible(true)}
                >
                  <Feather name="user" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <Text style={[styles.inputText, !selectedProfessor && { color: '#9CA3AF' }, selectedProfessor && { fontWeight: '600' }]}>
                    {selectedProfessor ? selectedProfessor.nome : 'Selecione um professor'}
                  </Text>
                  <Feather name="chevron-down" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* Multi-Select de Turmas */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Turmas</Text>
                <TouchableOpacity 
                  activeOpacity={0.7}
                  style={[
                    styles.inputWrapper, 
                    turmasModalVisible && styles.inputWrapperFocused
                  ]}
                  onPress={() => {
                    if (!selectedProfessor) {
                      Alert.alert("Aviso", "Selecione um professor antes de escolher as turmas.");
                      return;
                    }
                    setTurmasModalVisible(true);
                  }}
                >
                  <Feather name="users" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <Text style={[styles.inputText, selectedTurmas.length === 0 && { color: '#9CA3AF' }, selectedTurmas.length > 0 && { fontWeight: '600' }]} numberOfLines={1}>
                    {selectedTurmas.length > 0 
                      ? `${selectedTurmas.length} turma(s) selecionada(s)` 
                      : 'Selecione as turmas'}
                  </Text>
                  <Feather name="plus" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* Botão Principal */}
              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity 
                    style={styles.primaryButton} 
                    activeOpacity={1} 
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    onPress={submit}>
                    <Text style={styles.primaryButtonText}>Confirmar Template</Text>
                    <Feather name="arrow-right" size={20} color="#FFF" />
                </TouchableOpacity>
              </Animated.View>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Modal de Cores */}
      <Modal transparent visible={colorModalVisible} animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setColorModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalIndicator} />
            <Text style={styles.modalTitle}>Selecione uma Cor</Text>
            <View style={styles.colorGrid}>
              {COLOR_PALETTE.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.colorOption,
                    { backgroundColor: item },
                    color === item && styles.colorOptionSelected
                  ]}
                  onPress={() => {
                    setColor(item);
                    setColorModalVisible(false);
                  }}
                >
                  {color === item && <Feather name="check" size={24} color="#FFF" />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Modal Professor */}
      <Modal transparent visible={professorModalVisible} animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setProfessorModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalIndicator} />
            <Text style={styles.modalTitle}>Selecionar Professor</Text>
            <ScrollView>
              {professorList.map((prof) => (
                <TouchableOpacity 
                  key={prof.id} 
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedProfessor(prof);
                    setSelectedTurmas([]); // Limpa as turmas selecionadas ao trocar de professor
                    setProfessorModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{prof.nome} ({prof.materia})</Text>
                  {selectedProfessor?.id === prof.id && <Feather name="check" size={20} color={PRIMARY_COLOR} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* Modal Turmas (Multi-select) */}
      <Modal transparent visible={turmasModalVisible} animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setTurmasModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalIndicator} />
            <Text style={styles.modalTitle}>Selecionar Turmas</Text>
            <ScrollView>
              {selectedProfessor?.turmas?.map((turma: any) => {
                const isSelected = selectedTurmas.includes(turma.id);
                return (
                  <TouchableOpacity 
                    key={turma.id} 
                    style={styles.modalItem}
                    onPress={() => toggleTurma(turma.id)}
                  >
                    <Text style={styles.modalItemText}>{turma.nomeTurma}</Text>
                    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                      {isSelected && <Feather name="check" size={14} color="#FFF" />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity 
              style={styles.modalConfirmButton} 
              onPress={() => setTurmasModalVisible(false)}
            >
              <Text style={styles.modalConfirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 8,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 0,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  welcomeText: {
    fontSize: 11,
    color: TEXT_SUB,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: 1.5,
  },
  brandText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: TEXT_MAIN,
    letterSpacing: -0.5,
  },
  subtitleText: {
    fontSize: 13,
    color: TEXT_SUB,
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  inputContainer: {
    marginBottom: 26,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: TEXT_SUB,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: INPUT_BG,
    borderWidth: 2,
    borderColor: BORDER_COLOR,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 60,
  },
  inputWrapperFocused: {
    borderColor: PRIMARY_COLOR,
    backgroundColor: '#FFF',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: TEXT_MAIN,
    fontWeight: '500',
  },
  inputText: {
    flex: 1,
    fontSize: 15,
    color: TEXT_MAIN,
  },
  unitText: {
    fontSize: 14,
    color: TEXT_SUB,
    fontWeight: '600',
    marginLeft: 8,
  },
  helperText: {
    fontSize: 12,
    color: TEXT_SUB,
    marginTop: 6,
    marginLeft: 4,
  },
  colorPreview: {
    width: 32,
    height: 32,
    borderRadius: 10,
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  primaryButton: {
    backgroundColor: PRIMARY_COLOR,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    elevation: 6,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '70%',
  },
  modalIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalItemText: {
    fontSize: 16,
    color: '#4B5563',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  modalConfirmButton: {
    backgroundColor: PRIMARY_COLOR,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  modalConfirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  colorOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: '#E5E7EB',
  },
});
