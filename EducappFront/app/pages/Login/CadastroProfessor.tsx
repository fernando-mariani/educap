import { useAppContext } from '@/context/Context/appContext';
import GlobalLoading from '@/context/Context/GlobalLoading';
import { ProfessorDTO, Turma, UserDTO } from '@/types';
import { Feather } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
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
import { CadastroStackParamList } from './CadastroRoutes';

const PRIMARY_COLOR = '#275BF5';
const BACKGROUND_COLOR = '#F3F4F6';


type RouteProps = RouteProp<CadastroStackParamList, 'CadastroProfessor'>;


export default function CadastroProfessor() {
  const route = useRoute<RouteProps>();

  const [selectedTurmas, setSelectedTurmas] = useState<Turma[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { getTurmas, cadastrarProfessor, gerarError } = useAppContext();
  const{key} = route.params;

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [materia, setMateria] = useState('');
  const[turmas, setTurmas] = useState<Turma[]>([]);


  useEffect(() => {
    async function initData() {
      const turmasData = await getTurmas();
      if (turmasData) {
        setTurmas(turmasData);
      }
    }

    initData();
  }, []);

  const handleCadastro = async () => {
    if (!email || !senha || !nome || !materia || !selectedTurmas) {
      gerarError('Atenção', 'Preencha todos os campos');
      return;
    }

    const professor: ProfessorDTO = {
      nome: nome,
      materia: materia,
      idTurmas: selectedTurmas.map((turma) => turma.id),
    };

    const usuario: UserDTO = {
      email: email,
      senha: senha,
      key: key,
    };

    await cadastrarProfessor(usuario, professor);
  };

  if(!turmas || turmas.length === 0) return <GlobalLoading />;

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
              <View style={styles.logoContainer}>
                <Feather name="briefcase" size={32} color="#FFF" />
              </View>
              <Text style={styles.welcomeText}>Cadastro de Professor</Text>
              <Text style={styles.brandText}>Educap</Text>
              <Text style={styles.subtitleText}>Gerencie suas turmas e alunos</Text>
            </View>

            {/* Card de Cadastro */}
            <View style={styles.card}>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="mail" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="seu@email.com"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={(txt) => setEmail(txt)}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Senha</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="lock" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Crie uma senha forte"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry
                    value={senha}
                    onChangeText={(txt) => setSenha(txt)}
                  />
                  <Feather name="eye-off" size={20} color="#9CA3AF" />
                </View>
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nome Completo</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="user" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Insira o nome do professor"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="words"
                    value={nome}
                    onChangeText={(txt) => setNome(txt)}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Matéria</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="book" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Ex: Matemática, História"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="words"
                    value={materia}
                    onChangeText={(txt) => setMateria(txt)}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Turmas</Text>
                <TouchableOpacity style={styles.inputWrapper} activeOpacity={0.7} onPress={() => setModalVisible(true)}>
                    <Feather name="users" size={20} color="#9CA3AF" style={styles.inputIcon} />
                    <Text style={[styles.selectPlaceholder, selectedTurmas.length > 0 && { color: '#1F2937' }]}>
                        {selectedTurmas.length > 0 
                            ? `${selectedTurmas.length} turma${selectedTurmas.length > 1 ? 's' : ''} selecionada${selectedTurmas.length > 1 ? 's' : ''}` 
                            : 'Selecione as turmas'}
                    </Text>
                    <Feather name="chevron-down" size={20} color="#9CA3AF" />
                </TouchableOpacity>

                <View style={styles.tagsContainer}>
                    {selectedTurmas.map((item) => (
                        <View key={item.id} style={styles.tag}>
                            <Text style={styles.tagText}>{item.nomeTurma}</Text>
                            <TouchableOpacity onPress={() => setSelectedTurmas(selectedTurmas.filter((t) => t.id !== item.id))}>
                                <Feather name="x" size={14} color={PRIMARY_COLOR} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
              </View>

              {/* Botão Principal */}
              <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8} onPress={handleCadastro}>
                <Text style={styles.primaryButtonText}>Cadastrar Professor</Text>
                <Feather name="arrow-right" size={20} color="#FFF" />
              </TouchableOpacity>
            
              <Modal transparent visible={modalVisible} animationType="fade" onRequestClose={() => setModalVisible(false)}>
                      <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                        <Pressable style={styles.modalContent} onPress={() => {}}>
                          <View style={styles.modalIndicator} />
                          <Text style={styles.modalTitle}>Selecione as Turmas</Text>
                          <ScrollView showsVerticalScrollIndicator={false}>
                            {turmas.map((item, index, arr) => {
                              const isSelected = selectedTurmas.some((turma) => turma.id === item.id);
              
                              return (
                                <TouchableOpacity
                                  key={item.id}
                                  style={[
                                    styles.modalItem,
                                    isSelected && styles.modalItemSelected,
                                    index === arr.length - 1 && styles.modalItemLast,
                                  ]}
                                  onPress={() => {
                                    if (isSelected) {
                                      setSelectedTurmas(selectedTurmas.filter((t) => t.id !== item.id));
                                    } else {
                                      setSelectedTurmas([...selectedTurmas, item]);
                                    }
                                  }}
                                >
                                  <Text style={[styles.modalItemText, isSelected && styles.modalItemTextSelected]}>
                                    {item.nomeTurma}
                                  </Text>
                                  {isSelected && <Feather name="check" size={20} color={PRIMARY_COLOR} />}
                                </TouchableOpacity>
                              );
                            })}
                          </ScrollView>
                        </Pressable>
                      </Pressable>
                    </Modal>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
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
    justifyContent: 'center',
    padding: 20,
  },

  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: '#4B5563',
    fontWeight: '500',
    marginBottom: 4,
  },
  brandText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    letterSpacing: -1,
  },
  subtitleText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    height: '100%',
  },
  selectPlaceholder: {
    flex: 1,
    fontSize: 14,
    color: '#9CA3AF',
  },

  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  tagText: {
    fontSize: 12,
    color: PRIMARY_COLOR,
    fontWeight: '600',
    marginRight: 6,
  },

  primaryButton: {
    backgroundColor: PRIMARY_COLOR,
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
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
    paddingBottom: 40,
    maxHeight: '50%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
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
    marginBottom: 16,
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
  modalItemLast: {
    borderBottomWidth: 0,
  },
  modalItemSelected: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginHorizontal: -12,
  },
  modalItemText: {
    fontSize: 16,
    color: '#4B5563',
    fontWeight: '500',
  },
  modalItemTextSelected: {
    color: PRIMARY_COLOR,
    fontWeight: 'bold',
  },
});