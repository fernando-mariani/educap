import { AlunoContext } from '@/context/Context/AlunoContext';
import { Tarefa } from '@/types';
import { Feather } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AtividadesStackParamList } from '../Routes/atividadesRoutes';

const PRIMARY_COLOR = '#275BF5';
const BACKGROUND_COLOR = '#F3F4F6';


//cores usadas no app
const PRIMARY_BLUE = '#275BF5';
const DEEP_INDIGO = '#4F46E5';
const BG_SOFT = '#F8FAFC';
const TEXT_MAIN = '#1E293B';
const TEXT_SUB = '#64748B';

type detalhesAtividadesRouteProp = RouteProp<
  AtividadesStackParamList,
  'detalhesTarefa'
>;

type NavigationProps = NativeStackNavigationProp<
  AtividadesStackParamList,
  'detalhesTarefa'
>;

export default function DetalhesDaTarefa() {
    
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute<detalhesAtividadesRouteProp>();

    const { id } = route.params;
    const{getTarefas} = useContext(AlunoContext);

    const [tarefas, setTarefas] = useState<Tarefa[]>([] as Tarefa[]);



    useEffect(() => {
      async function initData() {
        const data = await getTarefas();
        if (data) {
          setTarefas(data);
        }
      }
  
      initData();
    }, []);

    if (!tarefas || tarefas.length === 0 ) {
        console.log(tarefas);
        return null;
    }

    const tarefa: Tarefa | undefined = tarefas.find((tarefa) => tarefa.id === id);

    if (!tarefa) {
        return null;
    }
    
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header Fixo e Sobreposto */}
      <View style={styles.fixedHeader}>
        <LinearGradient
          colors={[PRIMARY_BLUE, DEEP_INDIGO]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <SafeAreaView edges={['top']} style={styles.headerContent}>
            <View style={styles.headerTopBar}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Feather name="arrow-left" size={24} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Detalhes da Tarefa</Text>
              <View style={{ width: 24 }} />
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.contentContainer}>
          
          {/* Card Principal */}
            <View style={styles.card}>
              
              {/* Cabeçalho do Card (Tipo e Matéria) */}
              <View style={styles.cardHeader}>
                <View style={styles.badge}>
                  <Feather name="briefcase" size={12} color={PRIMARY_COLOR} style={{ marginRight: 4 }} />
                  <Text style={styles.badgeText}>{tarefa?.tipoTarefa?.tipo}</Text>
                </View>
                <Text style={styles.subjectText}>{tarefa?.professor?.materia}</Text>
              </View>

              {/* Título e Professor */}
              <Text style={styles.taskTitle}>{tarefa?.nomeTarefa}</Text>
              
              <View style={styles.professorContainer}>
                <View style={styles.avatarSmall}>
                    <Feather name="user" size={14} color="#FFF" />
                </View>
                <Text style={styles.professorText}>Prof. {tarefa?.professor?.nome}</Text>
              </View>

              <View style={styles.divider} />

              {/* Seção Descrição */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Feather name="align-left" size={18} color={PRIMARY_COLOR} style={{ marginRight: 8 }} />
                    <Text style={styles.sectionTitle}>Descrição</Text>
                </View>
                <Text style={styles.descriptionText}>{tarefa?.descricaoTarefa}</Text>
              </View>

              <View style={styles.divider} />

              {/* Informações Adicionais (Grid) */}
              <View style={styles.infoGrid}>
                <InfoItem 
                    label="Data Limite" 
                    value={tarefa?.dataLimite?.split('-').reverse().join('/')}                     
                    icon="calendar" 
                    color="#EF4444"
                    bgColor="#FEF2F2"
                />
                <InfoItem 
                    label="Nota" 
                    value={tarefa?.notaTarefa} 
                    icon="star" 
                    color="#F59E0B"
                    bgColor="#FFFBEB"
                />
                <InfoItem 
                    label="Data que foi registrada" 
                    value={new Date(tarefa?.dataRegistro).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })} 
                    icon="clock" 
                    color={PRIMARY_COLOR}
                    bgColor="#EFF6FF"
                />
              </View>

            </View>
          </View>

        </ScrollView>
    </View>
  );
}

// Componente Auxiliar para Itens de Informação
const InfoItem = ({ label, value, icon, color, bgColor }: any) => (
    <View style={styles.infoItem}>
        <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
            <Feather name={icon} size={20} color={color} />
        </View>
        <View>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: BACKGROUND_COLOR,
    paddingTop: 110, 
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerGradient: {
    paddingBottom: 20, 
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    paddingHorizontal: 24,
  },
  headerTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  contentContainer: {
    paddingHorizontal: 20,
    marginTop: -20, 
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
  },
  subjectText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  taskTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    lineHeight: 30,
  },
  professorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  professorText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 20,
  },
  section: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  descriptionText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 24,
    textAlign: 'justify',
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
  },
});
