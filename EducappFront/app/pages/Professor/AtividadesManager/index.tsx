import { useAppContext } from '@/context/Context/appContext';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { ProfessorContext } from '@/context/Context/ProfessorContext';
import { TiposTarefas, Turma } from '@/types';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const PRIMARY_COLOR = '#275BF5';
const BG_COLOR = '#F1F5F9';
const INPUT_BG = '#FFFFFF';
const INPUT_INNER_BG = '#F8FAFC';
const TEXT_MAIN = '#1E293B';
const TEXT_SUB = '#64748B';
const BORDER_COLOR = '#CBD5E1';
const CARD_BG = '#FFFFFF';

type SelectItem = {
        id: string;
        nome: string;
};

export default function AtividadeManager() {

  const navigation = useNavigation();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  const [modalVisible, setModalVisible] = useState<string | null>(null);
  const[isFocusedNome, setIsFocusedNome] = useState(false);
  const[isFocusedDescricao, setIsFocusedDescricao] = useState(false);
  const[isFocusedPeso, setIsFocusedPeso] = useState(false);
  const[isFocusedDataLimite, setIsFocusedDataLimite] = useState(false);

  const { gerarError } = useAppContext();
  const { getTurmas, getTiposTarefas, criarTarefa } = useContext(ProfessorContext);

  const[turmas, setTurmas] = useState<Turma[]>([] as Turma[]);
  const[tiposTarefas, setTiposTarefas] = useState<TiposTarefas[]>([] as TiposTarefas[]);


  const turmasSelect: SelectItem[] = turmas.map((turma: Turma) => ({
    id: turma.id,
    nome: turma.nomeTurma,
  }));

  const tiposTarefasSelect: SelectItem[] = tiposTarefas.map((tipoNota: TiposTarefas) => ({
    id: tipoNota.id,
    nome: tipoNota.tipo,
  }));


  const [selectedTurma, setSelectedTurma] = useState<string | null>(null);
  const [selectedTipoNota, setSelectedTipoNota] = useState<string | null>(null);
  const[nome, setNome] = useState("");
  const[descricao, setDescricao] = useState("");
  const[nota, setNota] = useState("");
  const[dataLimite, setDataLimite] = useState("");
  const[dataLimiteDisplay, setDataLimiteDisplay] = useState("");


  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
    ]).start();

    async function initData() {
      const dataTurma = await getTurmas();
      const dataTiposTarefas = await getTiposTarefas();

      if (dataTurma) setTurmas(dataTurma);
      if (dataTiposTarefas) setTiposTarefas(dataTiposTarefas);
    }
    initData();
  }, []);

  const handleNota = (valor: string) => {
    const notaInput = parseFloat(valor.replace(',', '.'));
    const notaMax = tiposTarefas.find((t) => t.tipo === selectedTipoNota)?.notaMax || 0;
    if (notaInput > notaMax) {
      setNota(notaMax.toString());
    } else if(notaInput < 0) {
      setNota("0");
    } 
    
    else {
      setNota(valor);
    }
  };

  function enviar() {

    if(!selectedTurma || !selectedTipoNota || !nome || !descricao || !nota) {
      gerarError("Atenção!", "Preencha todos os campos!");
      return;
    }
    criarTarefa({
      nomeTarefa: nome,
      descricaoTarefa: descricao,
      notaTarefa: parseFloat(nota.replace(',', '.')),
      idTipoTarefa: tiposTarefas.find((t) => t.tipo === selectedTipoNota)?.id || '',
      idTurma: turmas.find((turma) => turma.nomeTurma === selectedTurma)?.id || '',
      dataLimite: dataLimite,
      idProfessor: ''
    });
    setSelectedTipoNota(null);
    setSelectedTurma(null);
    setNome("");
    setDescricao("");
    setNota("");
    setDataLimiteDisplay("");
    navigation.goBack();
  }

  // Componente para Select
  const CustomSelect = ({ label, icon, value, placeholder, onOpenModal }: {
    label: string;
    icon: any;
    value: string;
    placeholder: string;
    onOpenModal: () => void;
  }) => {
    return (
      <View style={[styles.inputContainer, { flex: 1 }]}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity 
          activeOpacity={0.7} 
          style={[
            styles.selectWrapper,
            value && value !== 'Selecione' && styles.selectWrapperFilled
          ]} 
          onPress={onOpenModal}
        >
          <View style={styles.selectContent}>
            <Feather name={icon} size={16} color={TEXT_SUB} style={styles.inputIcon} />
            <Text style={[styles.selectText, !value && styles.placeholderText]}>
              {value || placeholder}
            </Text>
          </View>
          <Feather name="chevron-down" size={18} color={TEXT_SUB} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            { opacity: fadeAnim, transform: [{ translateY }] },
          ]}
        >
          {/* Cabeçalho */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Nova Atividade</Text>
              <Text style={styles.headerSubtitle}>Preencha os detalhes para os alunos</Text>
            </View>
            <View style={styles.headerIconContainer}>
              <Feather name="clipboard" size={22} color="#FFF" />
            </View>
          </View>

          {/* Informações Básicas */}
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Informações Básicas</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Título da atividade</Text>
              <View style={[styles.inputWrapper, isFocusedNome && styles.inputWrapperFocused]}>
                <TextInput
                  style={[styles.input, styles.inputTitle]}
                  placeholder="Ex: Trabalho sobre Revolução Francesa"
                  placeholderTextColor="#9CA3AF"
                  onFocus={() => setIsFocusedNome(true)}
                  onBlur={() => setIsFocusedNome(false)}
                  onChangeText={setNome}
                  value={nome}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Instruções para os alunos</Text>
              <View style={[styles.inputWrapper, styles.inputWrapperMultiline, isFocusedDescricao && styles.inputWrapperFocused]}>
                <TextInput
                  style={[styles.input, styles.inputMultiline]}
                  multiline
                  placeholder="Descreva o que os alunos devem fazer..."
                  placeholderTextColor="#9CA3AF"
                  onFocus={() => setIsFocusedDescricao(true)}
                  onBlur={() => setIsFocusedDescricao(false)}
                  onChangeText={setDescricao}
                  value={descricao}
                />
              </View>
            </View>
          </View>

          {/* Detalhes da Atividade */}
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Detalhes e Destino</Text>
            </View>
            
            <View style={styles.row}>
              <CustomSelect
                label="Turma"
                icon="users"
                placeholder="Selecione"
                value={selectedTurma || ''}
                onOpenModal={() => setModalVisible('turma')}
              />
              <View style={styles.spacer} />
              <CustomSelect
                label="Tipo"
                icon="bookmark"
                placeholder="Selecione"
                value={selectedTipoNota || ''}
                onOpenModal={() => setModalVisible('tipoNota')}
              />
            </View>
          </View>

          {/* Configurações Adicionais */}
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Configurações Adicionais</Text>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.label}>Pontuação</Text>
                <View style={[styles.inputWrapper, isFocusedPeso && styles.inputWrapperFocused]}>
                  <Feather name="award" size={16} color={TEXT_SUB} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="0.0"
                    keyboardType="numeric"
                    onFocus={() => selectedTipoNota ? setIsFocusedPeso(true) : (Keyboard.dismiss(), setModalVisible('warningNota'))}
                    onBlur={() => setIsFocusedPeso(false)}
                    onChangeText={handleNota}
                    value={nota}
                  />
                </View>
              </View>
              <View style={styles.spacer} />
              <View style={[styles.inputContainer, { flex: 1.2 }]}>
                <Text style={styles.label}>Data de Entrega</Text>
                <View style={[styles.inputWrapper, isFocusedDataLimite && styles.inputWrapperFocused]}>
                  <Feather name="calendar" size={16} color={TEXT_SUB} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="DD/MM"
                    keyboardType="numeric"
                    maxLength={5}
                    value={dataLimiteDisplay}
                    onChangeText={(text) => {
                      let v = text.replace(/\D/g, "");
                      if (v.length > 4) v = v.slice(0, 4);
                      if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,2})/, "$1/$2");
                      setDataLimiteDisplay(v);
                      if (v.length === 5) {
                        const [day, month] = v.split('/');
                        setDataLimite(`${new Date().getFullYear()}-${month}-${day}`);
                      }
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Rodapé Fixo com Botão */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={enviar}>
          <Feather name='plus-circle' size={20} color="#FFF" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Criar atividade</Text>
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>

      <Modal transparent visible={modalVisible !== null} animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(null)}>
          <Pressable style={styles.modalContent} onPress={() => {}}>
            <View style={styles.modalIndicator} />
            {modalVisible === 'success' ? (
              <View style={{ alignItems: 'center', paddingVertical: 10 }}>
                <View style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: '#EFF6FF',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 16
                }}>
                  <Feather name="check" size={32} color={PRIMARY_COLOR} />
                </View>
                <Text style={styles.modalTitle}>Sucesso!</Text>
                <Text style={{
                  fontSize: 16,
                  color: '#6B7280',
                  textAlign: 'center',
                  marginBottom: 24
                }}>
                  Tarefa cadastrada com sucesso!
                </Text>
                <TouchableOpacity style={[styles.button, { width: '100%' }]} onPress={() => setModalVisible(null)}>
                  <Text style={styles.buttonText}>Continuar</Text>
                </TouchableOpacity>
              </View>
            ) : modalVisible === 'error' ? (
              <View style={{ alignItems: 'center', paddingVertical: 10 }}>
                <View style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: '#FEF2F2',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 16
                }}>
                  <Feather name="alert-circle" size={32} color="#EF4444" />
                </View>
                <Text style={styles.modalTitle}>Atenção!</Text>
                <Text style={{
                  fontSize: 16,
                  color: '#6B7280',
                  textAlign: 'center',
                  marginBottom: 24
                }}>
                  Por favor, preencha todos os campos para continuar.
                </Text>
                <TouchableOpacity
                  style={[styles.button, { width: '100%', marginTop: 0, backgroundColor: '#EF4444' }]}
                  activeOpacity={0.8}
                  onPress={() => setModalVisible(null)}
                >
                  <Text style={styles.buttonText}>Entendi</Text>
                </TouchableOpacity>
              </View>
            ) : modalVisible === 'warningNota' ? (
              <View style={{ alignItems: 'center', paddingVertical: 10 }}>
                <View style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: '#FEF2F2',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 16
                }}>
                  <Feather name="alert-triangle" size={32} color="#EF4444" />
                </View>
                <Text style={styles.modalTitle}>Atenção!</Text>
                <Text style={{
                  fontSize: 16,
                  color: '#6B7280',
                  textAlign: 'center',
                  marginBottom: 24
                }}>
                  Selecione um tipo de tarefa antes de definir a nota.
                </Text>
                <TouchableOpacity
                  style={[styles.button, { width: '100%', marginTop: 0, backgroundColor: '#EF4444' }]}
                  activeOpacity={0.8}
                  onPress={() => setModalVisible(null)}
                >
                  <Text style={styles.buttonText}>Entendi</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.modalTitle}>
                  {modalVisible === 'turma' ? 'Selecione a Turma' : 'Tipo de Tarefa'}
                </Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {(modalVisible === 'turma' ? turmasSelect : tiposTarefasSelect).map((item: SelectItem, index, arr) => {
                    const isSelected =
                      modalVisible === 'turma'
                        ? selectedTurma === item.nome
                        : selectedTipoNota === item.nome;

                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.modalItem,
                          isSelected && styles.modalItemSelected,
                          index === arr.length - 1 && styles.modalItemLast,
                        ]}
                        onPress={() => {
                          if (modalVisible === 'turma') {
                            setSelectedTurma(item.nome);
                          } else {
                            setSelectedTipoNota(item.nome);
                          }
                          setModalVisible(null);
                        }}
                      >
                        <Text style={[styles.modalItemText, isSelected && styles.modalItemTextSelected]}>
                          {item.nome}
                        </Text>
                        {isSelected && <Feather name="check" size={20} color={PRIMARY_COLOR} />}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 24,
  },
  content: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  headerIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 0,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: TEXT_MAIN,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: TEXT_SUB,
    marginBottom: 8,
    marginLeft: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: INPUT_INNER_BG,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  inputWrapperFocused: {
    borderColor: PRIMARY_COLOR,
    backgroundColor: '#FFF',
  },
  inputWrapperMultiline: {
    height: 120,
    paddingTop: 12,
  },
  inputIcon: {
    marginRight: 12,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: TEXT_MAIN,
    fontWeight: '500',
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  inputMultiline: {
    textAlignVertical: 'top',
    height: '100%',
  },
  selectWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: INPUT_INNER_BG,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  selectWrapperFilled: {
    backgroundColor: '#FFF',
    borderColor: PRIMARY_COLOR + '40',
  },
  selectContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
  },
  placeholderText: {
    color: '#94A3B8',
  },
  row: {
    flexDirection: 'row',
  },
  spacer: {
    width: 16,
  },
  button: {
    backgroundColor: PRIMARY_COLOR,
    height: 56,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  footer: {
    padding: 24,
    backgroundColor: BG_COLOR,
    paddingBottom: Platform.OS === 'ios' ? 10 : 20,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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