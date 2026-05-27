import { useAppContext } from '@/context/Context/appContext';
import { DiretorContext } from '@/context/Context/DiretorContext';
import { AulaDTO, Aulas, AulaTemplate, Turma } from '@/types';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  FadeInUp
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRIMARY_COLOR = '#275BF5';
const BACKGROUND_COLOR = '#F8FAFC';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const COLUMN_WIDTH = 150; 
const HOUR_HEIGHT = 100; // Altura de cada hora em pixels
const MINUTE_HEIGHT = HOUR_HEIGHT / 60;
const START_HOUR = 7;

// Dados estáticos
const DIAS_SEMANA = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
const HORARIOS_LABELS = ['06:00' ,'07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// Converte horário em deslocamento Y (pixels)
const getTimeOffset = (time: string) => {
  if (!time || typeof time !== 'string' || !time.includes(':')) return 0;
  const [h, m] = time.split(':').map(Number);
  const totalMinutes = (h - START_HOUR) * 60 + m;
  return totalMinutes * MINUTE_HEIGHT;
};

// Componente de Card de Aula no Grid
const GridCard = React.memo(({ aula, day, index, onRemove }: { aula: GridAula, day: string, index: number, onRemove: (day: string, id: any) => void }) => (
  <Animated.View 
    entering={FadeInUp.delay(index * 50).duration(400)}
    style={[
      styles.aulaCard, 
      { 
        top: getTimeOffset(aula.inicio), 
        height: aula.duracao * MINUTE_HEIGHT - 4, 
        backgroundColor: aula.color,
        borderLeftWidth: 4,
        borderLeftColor: 'rgba(0,0,0,0.2)'
      }
    ]}
  >
    <View style={styles.aulaCardContent}>
      <Text style={[styles.aulaTime, { color: aula.textColor }]} numberOfLines={1}>{aula.inicio} - {aula.fim}</Text>
      <Text style={[styles.aulaMateria, { color: aula.textColor }]} numberOfLines={2}>{aula.materia}</Text>
      <Text style={[styles.aulaProfessor, { color: aula.textColor }]} numberOfLines={1}>{aula.professor}</Text>
    </View>
    <TouchableOpacity style={styles.removeBtn} onPress={() => onRemove(day, aula.id)}>
      <Feather name="x" size={12} color={aula.textColor} />
    </TouchableOpacity>
  </Animated.View>
));

interface GridAula {
  id: string;
  materia: string;
  professor: string;
  color: string;
  textColor: string;
  inicio: string;
  fim: string;
  duracao: number;
  idProfessor: string;
}

interface AulaEnvioDTO {
  horarioInicio: number;
  horarioFim: number;
  idProfessor: string;
  idTurma: string;
  diaSemana: number;
}


export default function AulasManager() {
  const navigation = useNavigation<any>();

  const { getTurmas, gerarError, gerarSucess } = useAppContext();
  const [turmas, setTurmas] = useState<Turma[]>([] as Turma[]);
  const [aulas, setAulas] = useState<Aulas[]>([] as Aulas[]);
  const [aulasTemplate, setAulasTemplate] = useState<AulaTemplate[]>([] as AulaTemplate[]);
  const[novasAulas, setNovasAulas] = useState<AulaDTO[]>([] as AulaDTO[]);
  const[deletedAulas, setDeletedAulas] = useState<string[]>([] as string[]);

  const { getAulasTemplates, getAulas, criarAula, deletarAula } = useContext(DiretorContext);

  useEffect(() => {
    const today = new Date().getDay();
    setTodayId(today === 0 ? 7 : today);
    async function initData() {
      const [dataTurmas] = await Promise.all([
        getTurmas(),
      ]);

      if (dataTurmas) setTurmas(dataTurmas);
    }

    initData();
  }, []);

  const [defaultStartTime, setDefaultStartTime] = useState('07:00');
  const [selectedTurma, setSelectedTurma] = useState<Turma | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTimeModalVisible, setIsTimeModalVisible] = useState(false);
  const [tempDay, setTempDay] = useState('');
  const [selectedStartTime, setSelectedStartTime] = useState('07:00');
  const [activeTemplate, setActiveTemplate] = useState<AulaTemplate | null>(null);
  const [todayId, setTodayId] = useState<number>(0);

  const [gridClasses, setGridClasses] = useState<{ [key: string]: GridAula[] }>({
    'Segunda': [],
    'Terça': [],
    'Quarta': [],
    'Quinta': [],
    'Sexta': [],
  });

  const desformatarHorario = (horario: string) => {
    const [hora, minuto] = horario.split(':').map(Number);
    return hora * 60 + minuto;
  }

  const formatarHorario = (minutos: number) => {
      const h = Math.floor(minutos / 60);
      const m = minutos % 60;

    return `${h.toString().padStart(2, '0')}:${m
    .toString()
    .padStart(2, '0')}`;
  }

  const formatarDiaSemana = (diaSemana: number) => {
    switch (diaSemana) {
      case 1:
        return 'Segunda';
      case 2:
        return 'Terça';
      case 3:
        return 'Quarta';
      case 4:
        return 'Quinta';
      case 5:
        return 'Sexta';
      default:
        return '';
    }
  }

  useEffect(() => {
    const initialGrid = {
        'Segunda': [],
        'Terça': [],
        'Quarta': [],
        'Quinta': [],
        'Sexta': [],
    };
    if(!aulasTemplate) return;
    const aulasFormat = aulas.reduce<{ [key: string]: GridAula[] }>((acc, a: Aulas) => {
      const dia = formatarDiaSemana(a.diaSemana);
      if (!dia) return acc;

      const templateOriginal = aulasTemplate.find(t => t.professor.id === a.professor.id);

      acc[dia].push({
        id: a.id,
        materia: a.professor.materia,
        professor: a.professor.nome,
        idProfessor: a.professor.id,
        color: templateOriginal?.cor || '#275BF5', 
        textColor: '#FFFFFF',
        inicio: formatarHorario(a.horarioInicio),
        fim: formatarHorario(a.horarioFim),
        duracao: a.horarioFim - a.horarioInicio
      });
      return acc;
    }, initialGrid);

  setGridClasses(aulasFormat);
  }, [aulas, aulasTemplate]);

  useEffect(() => {
    async function carregarAulas() {
      if (!selectedTurma) return;

      const data = await getAulas(selectedTurma.id);
      if (data) {
        setAulas(data);
      }
      const[dataTemplates] = await Promise.all([
        getAulasTemplates(selectedTurma.id),
      ]);

      if (dataTemplates) {
        setAulasTemplate(dataTemplates);
      }
    }
      
    if (selectedTurma) {
      carregarAulas();
    }
  }, [selectedTurma]);

  useEffect(() => {
    console.log('novasAulas: ', novasAulas);
  }, [novasAulas])

  useEffect(() => {
    console.log('Aulas deletadas: ', novasAulas);
  }, [deletedAulas])

  useFocusEffect(
    React.useCallback(() => {
      async function carregarAulas() {
        if (!selectedTurma) return;

        const data = await getAulas(selectedTurma.id);
        if (data) {
          setAulas(data);
        }
        const[dataTemplates] = await Promise.all([
          getAulasTemplates(selectedTurma.id),
        ]);

        if (dataTemplates) {
          setAulasTemplate(dataTemplates);
        }
      }
      
      if (selectedTurma) {
        carregarAulas();
      }
    }, [])
  );

  const handleSelectTemplate = (template: AulaTemplate) => {
    if (activeTemplate?.id === template.id) {
      setActiveTemplate(null);
    } else {
      setActiveTemplate(template);
      ToastAndroid.show(`Selecionado: ${template.professor.materia}. Toque em um dia.`, ToastAndroid.SHORT);
    }
  };

  const handleAddClassToDay = (day: string, event: any) => {
    if (!activeTemplate) {
      gerarError("Aviso", "Selecione uma disciplina abaixo primeiro para adicioná-la aqui.");
      return;
    }

    if (!selectedTurma) {
      gerarError("Aviso", "Selecione uma turma antes de adicionar aula.");
      return;
    }

    const { locationY } = event.nativeEvent;
    const totalMinutesClicked = locationY / MINUTE_HEIGHT;
    const h = Math.floor(totalMinutesClicked / 60) + START_HOUR;
    const m = Math.floor(totalMinutesClicked % 60);
    
    const formattedTime = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    
    setTempDay(day);
    setSelectedStartTime(formattedTime);
    setIsTimeModalVisible(true);
  };

  const confirmAddTime = () => {
    if (!activeTemplate || !selectedTurma) return;

    const startTimeInMinutes = desformatarHorario(selectedStartTime);
    const endTimeInMinutes = startTimeInMinutes + activeTemplate.duracao;

    // Validação de sobreposição
    const hasOverlap = (gridClasses[tempDay] || []).some(aula => {
      const aulaStart = desformatarHorario(aula.inicio);
      const aulaEnd = desformatarHorario(aula.fim);
      return !(startTimeInMinutes >= aulaEnd || endTimeInMinutes <= aulaStart);
    });

    if (hasOverlap) {
      gerarError("Conflito", "Já existe uma aula agendada neste horário.");
      return;
    }
    
    const currentDayClasses = gridClasses[tempDay] || [];

    const newAula: GridAula = {
        id: Math.random().toString(),
        materia: activeTemplate.professor.materia,
        professor: activeTemplate.professor.nome,
        idProfessor: activeTemplate.professor.id,
        color: activeTemplate.cor,
        textColor: '#FFFFFF',
        inicio: selectedStartTime,
        fim: formatarHorario(endTimeInMinutes),
        duracao: activeTemplate.duracao
    };
    const aulaDTO: AulaDTO = {
      nome: newAula.materia,
      idProfessor: newAula.idProfessor,
      horarioInicio: startTimeInMinutes, 
      horarioFim: endTimeInMinutes, 
      diaSemana: DIAS_SEMANA.indexOf(tempDay) + 1, 
      idTurma: selectedTurma.id
    };

    setNovasAulas(prev => [...prev, aulaDTO]);
    setGridClasses({
      ...gridClasses,
      [tempDay]: [...currentDayClasses, newAula]
    });
    setIsTimeModalVisible(false);
  };

  const removeAula = (day: string, id: any) => {
    console.log(id);
    const aula = gridClasses[day].find(a => a.id === id);
    if (!aula) return;

    setNovasAulas(prev => prev.filter(a => a.horarioFim.toString() !== aula.fim && a.horarioInicio.toString() !== aula.inicio && a.diaSemana !== DIAS_SEMANA.indexOf(day) + 1));
    try {
      const verifiedId = id * 2;
    
      if (isNaN(verifiedId)) {
        throw new Error('ID válido');
      }
    } catch (error) {
      console.log('ID válido:', id);
      setDeletedAulas(prev => [...prev, id]);
    }

    setGridClasses(prev => ({
        ...prev,
        [day]: prev[day].filter(a => a.id !== id)
    }));
  };

  const handleSave = () => {
    if (!selectedTurma) {
      gerarError("Erro", "Selecione uma turma antes de salvar.");
      return;
    }

    if (novasAulas.length === 0 || deletedAulas.length === 0) {
      gerarError("Erro", "Nenhuma mudança foi feita.");
      return;
    }

    novasAulas.forEach(aula => {
      criarAula(aula);
    });

    deletedAulas.forEach(id => {
      deletarAula(id);
    });
  }
    
    
  return(
    <View style={styles.container}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        
        {/* Header fixo */}
        <View style={styles.headerWrapper}>
            <LinearGradient
                colors={[PRIMARY_COLOR, '#4F46E5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <SafeAreaView edges={['top']} style={styles.headerContent}>
                    <View style={styles.headerTopBar}>
                        <Text style={styles.headerTitle}>Gestão de Horários</Text>
                        <TouchableOpacity onPress={handleSave}>
                            <Feather name="save" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        </View>

        <ScrollView style={styles.mainScroll} showsVerticalScrollIndicator={false}>
            
            {/* Select de Turma */}
            <View style={styles.topSection}>
                <Text style={styles.label}>Turma Selecionada</Text>
                <TouchableOpacity 
                    style={styles.fakeSelect} 
                    onPress={() => setIsModalVisible(true)}
                    activeOpacity={0.7}
                >
                    <Feather name="users" size={20} color={PRIMARY_COLOR} />
                    <Text style={styles.fakeSelectText}>{selectedTurma ? selectedTurma.nomeTurma : 'Selecione uma turma'}</Text>
                    <Feather name="chevron-down" size={20} color="#9CA3AF" />
                </TouchableOpacity>

                <View style={{ marginTop: 16 }}>
                    <Text style={styles.label}>Horário de Início Padrão (1ª Aula)</Text>
                    <View style={styles.inputWrapper}>
                        <Feather name="clock" size={20} color={PRIMARY_COLOR} />
                        <TextInput
                            style={styles.input}
                            value={defaultStartTime}
                            onChangeText={(text) => {
                                let cleaned = text.replace(/[^0-9]/g, '');
                                if (cleaned.length > 4) cleaned = cleaned.slice(0, 4);
                                
                                let formatted = cleaned;
                                if (cleaned.length >= 3) {
                                    formatted = cleaned.slice(0, 2) + ':' + cleaned.slice(2);
                                }
                                setDefaultStartTime(formatted);
                            }}
                            onBlur={() => {
                                // Validação ao sair do campo: Garante o formato 00:00
                                if (!defaultStartTime || defaultStartTime.length < 1) {
                                    setDefaultStartTime('07:00');
                                    return;
                                }
                                
                                let [h, m] = defaultStartTime.split(':');
                                h = (h || '07').padStart(2, '0');
                                m = (m || '00').padEnd(2, '0');
                                
                                if (parseInt(h) > 23) h = '23';
                                if (parseInt(m) > 59) m = '59';
                                
                                setDefaultStartTime(`${h}:${m}`);
                            }}
                            placeholder="07:00"
                            keyboardType="numeric"
                            maxLength={5}
                        />
                    </View>
                </View>
            </View>

            {/* Grid com Scroll Horizontal Unificado */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false} style={styles.horizontalGridScroll}>
                <View style={styles.unifiedGridContainer}>
                    {/* Cabeçalho dos Dias */}
                    <View style={styles.daysHeaderContainer}>
                        <View style={styles.timeGutterHeader} />
                        {DIAS_SEMANA.map(dia => (
                            <View key={dia} style={styles.dayLabelContainer}>
                                <Text style={styles.dayLabelText}>{dia}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.gridContainer}>
                        {/* Eixo do Tempo (Esquerda) */}
                        <View style={styles.timeGutter}>
                            {HORARIOS_LABELS.map(time => (
                                <View key={time} style={[styles.timeLabelContainer, { top: getTimeOffset(time) }]}>
                                    <Text style={styles.timeLabelText}>{time}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Colunas dos Dias */}
                        <View style={styles.columnsContainer}>
                            {DIAS_SEMANA.map((dia, index) => (
                                <TouchableOpacity 
                                  key={dia} 
                                  style={[
                                    styles.dayColumn,
                                    (index + 1) === todayId && styles.todayColumn,
                                    activeTemplate && styles.dayColumnActive
                                  ]}
                                  activeOpacity={1}
                                  onPress={(e) => handleAddClassToDay(dia, e)}
                                >
                                    {HORARIOS_LABELS.map(h => (
                                        <View key={h} style={[styles.hourLine, { top: getTimeOffset(h) }]} />
                                    ))}

                                    {(gridClasses[dia] || []).map((aula, idx) => <GridCard key={aula.id} aula={aula} day={dia} index={idx} onRemove={removeAula} />)}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* 4. Área de Templates (Disciplinas) */}
            <View style={styles.templatesWrapper}>
                <View style={styles.templatesHeader}>
                    <View style={styles.sectionHeader}>
                        <Feather name="layers" size={20} color={PRIMARY_COLOR} />
                        <Text style={styles.sectionTitle}>Disciplinas Disponíveis</Text>
                    </View>
                    <Text style={[styles.helperText, activeTemplate && styles.helperTextActive]}>
                        {activeTemplate 
                            ? `Agora toque em um dia no grid para adicionar ${activeTemplate.professor.materia}` 
                            : 'Selecione uma disciplina para começar o agendamento'}
                    </Text>
                </View>

                <View style={styles.templatesGrid}>
                    {(aulasTemplate) ? aulasTemplate.map(item => (
                        <AnimatedTouchableOpacity 
                            key={item.id} 
                            style={[
                              styles.templateCard, 
                              { backgroundColor: item.cor + '15', borderColor: item.cor + '30' },
                              activeTemplate?.id === item.id && styles.templateCardSelected,
                              activeTemplate?.id === item.id && { borderColor: item.cor }
                            ]}
                            onPress={() => handleSelectTemplate(item)}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.templateMateria, { color: item.cor }]}>{item.professor.materia}</Text>
                            <Text style={[styles.templateProf, { color: '#64748B' }]}>{item.professor.nome}</Text>
                            <View style={styles.templateDurationBadge}>
                                <Text style={styles.templateDurationText}>{item.duracao}min</Text>
                            </View>
                            {activeTemplate?.id === item.id && (
                              <Animated.View entering={FadeInUp} style={[styles.selectedIndicator, { backgroundColor: item.cor }]}>
                                <Feather name="mouse-pointer" size={10} color="#FFF" />
                              </Animated.View>
                            )}
                        </AnimatedTouchableOpacity>
                    )) : null}
                    <TouchableOpacity 
                        style={styles.addTemplateBtn} 
                        onPress={() => navigation.navigate('criarTemplate')}
                        activeOpacity={0.6}
                    >
                        <Feather name="plus" size={24} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>

        {/* Modal de Seleção de Turma */}
        <Modal transparent visible={isModalVisible} animationType="fade">
            <Pressable style={styles.modalOverlay} onPress={() => setIsModalVisible(false)}>
                <Pressable style={styles.modalContent} onPress={() => {}}>
                    <View style={styles.modalIndicator} />
                    <Text style={styles.modalTitle}>Selecione a Turma</Text>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {turmas.map((turma) => {
                            const isSelected = selectedTurma?.id === turma.id;
                            return (
                                <TouchableOpacity
                                    key={turma.id}
                                    style={[
                                        styles.modalItem,
                                        isSelected && styles.modalItemSelected,
                                    ]}
                                    onPress={() => {
                                        setSelectedTurma(turma);
                                        setIsModalVisible(false);
                                    }}
                                >
                                    <Text style={[styles.modalItemText, isSelected && styles.modalItemTextSelected]}>
                                        {turma.nomeTurma}
                                    </Text>
                                    {isSelected && <Feather name="check" size={20} color={PRIMARY_COLOR} />}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </Pressable>
            </Pressable>
        </Modal>

        {/* Modal de Definição de Horário */}
        <Modal transparent visible={isTimeModalVisible} animationType="fade">
            <Pressable style={styles.modalOverlay} onPress={() => setIsTimeModalVisible(false)}>
                <Animated.View 
                    entering={FadeInUp.duration(200)}
                    style={styles.modalTimeContent} 
                    onStartShouldSetResponder={() => true}
                >
                    <View style={styles.modalIndicator} />
                    <Text style={styles.modalTitle}>Definir horário da aula</Text>
                    
                    <View style={styles.modalBody}>
                        <Text style={styles.label}>Horário de Início</Text>
                        <View style={styles.inputWrapper}>
                            <Feather name="clock" size={20} color={PRIMARY_COLOR} />
                            <TextInput
                                style={styles.input}
                                value={selectedStartTime}
                                onChangeText={(text) => {
                                    let cleaned = text.replace(/[^0-9]/g, '');
                                    if (cleaned.length > 4) cleaned = cleaned.slice(0, 4);
                                    let formatted = cleaned;
                                    if (cleaned.length >= 3) {
                                        formatted = cleaned.slice(0, 2) + ':' + cleaned.slice(2);
                                    }
                                    setSelectedStartTime(formatted);
                                }}
                                onBlur={() => {
                                    if (!selectedStartTime) {
                                        setSelectedStartTime('07:00');
                                        return;
                                    }
                                    let [h, m] = selectedStartTime.split(':');
                                    h = (h || '07').padStart(2, '0');
                                    m = (m || '00').padEnd(2, '0');
                                    if (parseInt(h) > 23) h = '23';
                                    if (parseInt(m) > 59) m = '59';
                                    setSelectedStartTime(`${h}:${m}`);
                                }}
                                keyboardType="numeric"
                                maxLength={5}
                            />
                        </View>
                        
                        {activeTemplate && (
                            <Text style={styles.modalInfoText}>
                                Disciplina: <Text style={{ fontWeight: '700', color: '#1F2937' }}>{activeTemplate.professor.materia}</Text>
                                {'\n'}Duração: <Text style={{ fontWeight: '700', color: '#1F2937' }}>{activeTemplate.duracao} minutos</Text>
                            </Text>
                        )}
                    </View>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity 
                            style={[styles.modalButton, styles.modalButtonSecondary]} 
                            onPress={() => setIsTimeModalVisible(false)}
                        >
                            <Text style={styles.modalButtonTextSecondary}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.modalButton, styles.modalButtonPrimary]} 
                            onPress={confirmAddTime}
                        >
                            <Text style={styles.modalButtonTextPrimary}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
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
  headerWrapper: {
    zIndex: 10,
  },
  headerGradient: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingBottom: 24,
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
    textAlign: 'center',
  },
  mainScroll: {
    flex: 1,
  },
  horizontalGridScroll: {
    backgroundColor: BACKGROUND_COLOR,
  },
  unifiedGridContainer: {
    paddingBottom: 20,
  },
  topSection: {
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalBody: { marginBottom: 24 },
  fakeSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  
  fakeSelectText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 14,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  daysHeaderWrapper: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  daysHeaderContainer: {
    flexDirection: 'row',
  },
  timeGutterHeader: {
    width: 60,
  },
  dayLabelContainer: {
    width: COLUMN_WIDTH,
    alignItems: 'center',
    paddingVertical: 10,
  },
  dayLabelText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  gridContainer: {
    flexDirection: 'row',
    height: 750,
    backgroundColor: '#FFF',
  },
  timeGutter: {
    width: 60,
  },
  timeLabelContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    height: 20,
    justifyContent: 'center',
  },
  timeLabelText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  columnsContainer: {
    flexDirection: 'row',
  },
  dayColumn: {
    width: COLUMN_WIDTH,
    borderLeftWidth: 1,
    borderColor: '#E5E7EB',
  },
  todayColumn: {
    backgroundColor: '#F1F5F9',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: PRIMARY_COLOR + '20',
  },
  dayColumnActive: {
    backgroundColor: PRIMARY_COLOR + '05',
  },
  hourLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  aulaCard: {
    position: 'absolute',
    left: 4,
    right: 4,
    borderRadius: 12,
    padding: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  aulaCardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  aulaTime: {
    fontSize: 10,
    fontWeight: '800',
    opacity: 0.9,
    marginBottom: 2,
  },
  aulaMateria: {
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 16,
  },
  aulaProfessor: {
    fontSize: 10,
    fontWeight: '600',
    opacity: 0.8,
    marginTop: 2,
  },
  removeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    padding: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
  },
  templatesHeader: {
    marginBottom: 16,
  },
  templatesWrapper: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 10,
    zIndex: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 10,
  },
  helperText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 20,
  },
  helperTextActive: {
    color: PRIMARY_COLOR,
    fontWeight: '700',
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  templateCard: {
    width: '48%',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  templateCardSelected: {
    
  },
  templateMateria: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  templateProf: {
    fontSize: 11,
    marginTop: 2,
  },
  templateDurationBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.86)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  templateDurationText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4B5563',
  },
  addTemplateBtn: {
    width: '48%',
    height: 70,
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    elevation: 4,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
  modalTimeContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    width: '100%',
    marginTop: 'auto',
  },
  modalInfoText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 16,
    lineHeight: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: PRIMARY_COLOR,
  },
  modalButtonSecondary: {
    backgroundColor: '#F1F5F9',
  },
  modalButtonTextPrimary: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  modalButtonTextSecondary: {
    color: '#1F2937',
    fontWeight: 'bold',
    fontSize: 15,
  },
});