import { useAppContext } from '@/context/Context/appContext';
import { AlunoDTO, Turma, UserDTO } from '@/types';
import { Feather } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CadastroStackParamList } from './CadastroRoutes';

const PRIMARY_COLOR = '#275BF5';
const BACKGROUND_COLOR = '#F3F4F6';


type NavigationProps = NativeStackNavigationProp<CadastroStackParamList, 'CadastroAluno'>;

type RouteProps = RouteProp<CadastroStackParamList, 'CadastroAluno'>;

export default function CadastroAluno() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProps>();

  const { getTurmas, cadastrarAluno, gerarError, gerarSucess } = useAppContext();
  const { key } = route.params;

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const[dataNascimento, setDataNascimento] = useState('');
  const [dataNascimentoDisplay, setDataNascimentoDisplay] = useState('');
  const[turmas, setTurmas] = useState<Turma[]>([]);

  const[modalVisible, setModalVisible] = useState(false);
  const[selectedTurma, setSelectedTurma] = useState<{ id: string; nome: string } | null>(null);

  useEffect(() => {
    async function initData() {
      const turmasData = await getTurmas();
      if (turmasData) {
        setTurmas(turmasData);
      }
    }

    initData();
  }, []);

  //formata a data de nascimento
  const handleDataNascimento = (text: string) => {
    let v = text.replace(/\D/g, "").slice(0, 8);
    if (v.length > 4) {
      v = v.replace(/^(\d{2})(\d{2})(\d{0,4})/, "$1/$2/$3");
    } else if (v.length > 2) {
      v = v.replace(/^(\d{2})(\d{0,2})/, "$1/$2");
    }
    setDataNascimentoDisplay(v);

    if (v.length === 10) {
      const [day, month, year] = v.split('/');
      setDataNascimento(`${year}-${month}-${day}`);
    } else {
      setDataNascimento('');
    }
  };

  const handleCadastro = async () => {
    if (!email || !senha || !nome || !dataNascimento || !selectedTurma) {
      gerarError("Atenção", "Preencha todos os campos");
      return;
    }
    var usuario: UserDTO = {
      email: email,
      senha: senha,
      key: key
    }
    var aluno: AlunoDTO = {
      nome: nome,
      dataNascimento: dataNascimento,
      idTurma: selectedTurma.id,
    }
    await cadastrarAluno(usuario, aluno);
  };

  if(!turmas) return null;

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
                <Feather name="user" size={32} color="#FFF" />
              </View>
              <Text style={styles.welcomeText}>Cadastro de Aluno</Text>
              <Text style={styles.brandText}>Educap</Text>
              <Text style={styles.subtitleText}>Preencha os dados para começar</Text>
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
                    onChangeText={setEmail}
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
                    onChangeText={setSenha}
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
                    placeholder="Insira o nome do aluno"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="words"
                    value={nome}
                    onChangeText={setNome}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Data de Nascimento</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="calendar" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="DD/MM/AAAA"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    maxLength={10}
                    value={dataNascimentoDisplay}
                    onChangeText={handleDataNascimento}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Turma</Text>
                <TouchableOpacity style={styles.inputWrapper} activeOpacity={0.7} onPress={() => setModalVisible(true)}>
                    <Feather name="users" size={20} color="#9CA3AF" style={styles.inputIcon} />
                    <Text style={[styles.selectPlaceholder, selectedTurma && styles.inputText]}>
                      {selectedTurma?.nome || 'Selecione a turma'}
                    </Text>
                    <Feather name="chevron-down" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* Botão Principal */}
              <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8} onPress={handleCadastro}>
                <Text style={styles.primaryButtonText}>Cadastrar Aluno</Text>
                <Feather name="arrow-right" size={20} color="#FFF" />
              </TouchableOpacity>
              
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <Modal transparent visible={modalVisible} animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalContent} onPress={() => {}}>
            <View style={styles.modalIndicator} />
            <Text style={styles.modalTitle}>Selecione a Turma</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {turmas.map((item, index, arr) => {
                const isSelected = selectedTurma?.id === item.id;

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.modalItem,
                      isSelected && styles.modalItemSelected,
                      index === arr.length - 1 && styles.modalItemLast,
                    ]}
                    onPress={() => {
                      setSelectedTurma({ id: item.id, nome: item.nomeTurma });
                      setModalVisible(false);
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
  inputText: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
  },
  selectPlaceholder: {
    flex: 1,
    fontSize: 14,
    color: '#9CA3AF',
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