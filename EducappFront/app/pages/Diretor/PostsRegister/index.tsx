import { useAppContext } from '@/context/Context/appContext';
import { DiretorContext } from '@/context/Context/DiretorContext';
import { PublicacaoDTO } from '@/types';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRIMARY_COLOR = '#275BF5';
const BG_COLOR = '#F1F5F9';
const INPUT_BG = '#FFFFFF';
const INPUT_INNER_BG = '#F8FAFC';
const TEXT_MAIN = '#1E293B';
const TEXT_SUB = '#64748B';
const BORDER_COLOR = '#CBD5E1';
const CARD_BG = '#FFFFFF';


export default function AtividadeManager() {

  const navigation = useNavigation();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  const [modalVisible, setModalVisible] = useState<string | null>(null);
  const[isFocusedNome, setIsFocusedNome] = useState(false);
  const[isFocusedDescricao, setIsFocusedDescricao] = useState(false);

  const { gerarError } = useAppContext();
  const { novaPublicacao } = useContext(DiretorContext);


  const[nome, setNome] = useState("");
  const[descricao, setDescricao] = useState("");


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

    
  }, []);

  

  async function enviar() {
    if(nome == '' || descricao == '') {
      gerarError("Atenção!", "Preencha todos os campos!");
      return;
    }

    var publicacao: PublicacaoDTO = {
      titulo: nome,
      descricao: descricao,
      idDiretor: ''
    }
    await novaPublicacao(publicacao);
    setNome("");
    setDescricao("");
    navigation.goBack();
  }


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
              <Text style={styles.headerTitle}>Nova Publicação</Text>
              <Text style={styles.headerSubtitle}>Preencha os dados da nova publicação.</Text>
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
              <Text style={styles.label}>Título da publicação</Text>
              <View style={[styles.inputWrapper, isFocusedNome && styles.inputWrapperFocused]}>
                <TextInput
                  style={[styles.input, styles.inputTitle]}
                  placeholder="Ex: Aviso para os alunos"
                  placeholderTextColor="#9CA3AF"
                  onFocus={() => setIsFocusedNome(true)}
                  onBlur={() => setIsFocusedNome(false)}
                  onChangeText={setNome}
                  value={nome}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Descrição da publicação</Text>
              <View style={[styles.inputWrapper, styles.inputWrapperMultiline, isFocusedDescricao && styles.inputWrapperFocused]}>
                <TextInput
                  style={[styles.input, styles.inputMultiline]}
                  multiline
                  placeholder="Descrição..."
                  placeholderTextColor="#9CA3AF"
                  onFocus={() => setIsFocusedDescricao(true)}
                  onBlur={() => setIsFocusedDescricao(false)}
                  onChangeText={setDescricao}
                  value={descricao}
                />
              </View>
            </View>
          </View>

        </Animated.View>
      </ScrollView>

      {/* Rodapé Fixo com Botão */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={enviar}>
          <Feather name='plus-circle' size={20} color="#FFF" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Criar Post</Text>
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
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