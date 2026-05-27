import { useAppContext } from '@/context/Context/appContext';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
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

type NavigationProps = NativeStackNavigationProp<CadastroStackParamList, 'CadastroUser'>;

export default function Cadastro() {

    const navigation = useNavigation<NavigationProps>();
    const [chave, setChave] = useState('');
    const { verificarChave } = useAppContext();


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
                <Feather name="user-plus" size={32} color="#FFF" />
              </View>
              <Text style={styles.welcomeText}>Criar Conta</Text>
              <Text style={styles.brandText}>Educap</Text>
              <Text style={styles.subtitleText}>Junte-se à nossa comunidade escolar</Text>
            </View>

            {/* Card de Cadastro */}
            <View style={styles.card}>
              
              {/* Input Chave da Escola */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Chave da Escola</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="key" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Insira a chave de acesso"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="characters"
                    value={chave}
                    onChangeText={(text) => setChave(text)}
                  />
                </View>
              </View>

              {/* Botão Principal */}
              <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8} onPress={async() => {
                const role = await verificarChave(chave);

                if(role === 'ALUNO') {
                  navigation.navigate('CadastroAluno',  {key: chave});
                } else if(role === 'PROFESSOR') {
                  navigation.navigate('CadastroProfessor', {key: chave});
                } else {
                  alert('Chave inválida');
                }
              }}>
                <Text style={styles.primaryButtonText}>Ir para o cadastro</Text>
                <Feather name="arrow-right" size={20} color="#FFF" />
              </TouchableOpacity>

              {/* Divisor Visual */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>ou</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Botão Secundário */}
              <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.8} onPress={() => navigation.goBack()}>
                <Text style={styles.secondaryButtonText}>Já tenho conta</Text>
              </TouchableOpacity>

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
  
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
  },

  secondaryButton: {
    backgroundColor: 'transparent',
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
  },
  secondaryButtonText: {
    color: PRIMARY_COLOR,
    fontSize: 14,
    fontWeight: 'bold',
  },
});