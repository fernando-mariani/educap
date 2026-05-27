import { DiretorContext } from '@/context/Context/DiretorContext';
import { Publicacao } from '@/types';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRIMARY_BLUE = '#275BF5';
const DEEP_INDIGO = '#4F46E5';
const BG_SOFT = '#F8FAFC';
const TEXT_MAIN = '#1E293B';
const TEXT_SUB = '#64748B';
const WHITE = '#FFFFFF';
const BORDER_COLOR = '#E2E8F0';

const formartarTimestamp = (timestamp: number) => {
  const data = new Date(timestamp);
  const today = new Date();
  const dia = data.getDate().toString().padStart(2, '0');
  const mes = (data.getMonth() + 1).toString().padStart(2, '0');
  const ano = data.getFullYear();
  const horas = data.getHours().toString().padStart(2, '0');
  const minutos = data.getMinutes().toString().padStart(2, '0');

  //verifica se é hoje o timestamp
  if(data.getDate() === today.getDate() && data.getMonth() === today.getMonth() && data.getFullYear() === today.getFullYear()) {
    //verifica se faz menos de uma hora o timestamp, retornando os minutos passados se sim, se nao, retorna as horas passadas
    if(((today.getMinutes() + 60 * today.getHours()) - (data.getMinutes() + 60 * data.getHours())) < 60)  return `${(today.getMinutes() + 60 * today.getHours()) - (data.getMinutes() + 60 * data.getHours())} minutos atrás`;
    return `${today.getHours() - data.getHours()} horas atrás`;
  }

  //verifica se foi ontem o timestamp
  if(data.getDate() === today.getDate() - 1) {
    //verifica se faz menos de uma hora o timestamp, retornando as horas passadas se sim
    if((24 - data.getHours()) + today.getHours() < 24){
      return `${(24 - data.getHours()) + today.getHours()} horas atrás`;
    }
    return 'Ontem';
  }

  //verifica se foi nesse mes o timestamp, se sim ele retorna os dias passados
  if(data.getMonth() == today.getMonth()) {
    return `${today.getDate() - data.getDate()} dias atrás`;
  }

  //retorna a data completa se nao for desse ano
  return `${dia}/${mes}/${ano}`;
};

//Componente da Publicacao
const PostCard = ({ item, index }: { item: Publicacao; index: number }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.98, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 120 });
  };

  return (
    <Animated.View 
      entering={FadeInUp.duration(300).delay(index * 50)}
      style={animatedStyle}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.feedContainer}>
                      <View key={item.id} style={[styles.feedCard, styles.cardShadow]}>
                        <View style={styles.postHeader}>
                          <View style={styles.postAvatar}>
                            <Feather name='user' size={18} color={PRIMARY_BLUE} />
                          </View>
                          <View style={styles.postMeta}>
                            <Text style={styles.postAuthor} numberOfLines={1}>
                              {item.diretor.nome} <Text style={styles.postRole}>• {formartarTimestamp(item.dataRegistro)}</Text>
                            </Text>
                          </View>
                        </View>
                        <View style={styles.postBody}>
                          <Text style={styles.postTitleText}>{item.titulo}</Text>
                          <Text style={styles.postContent}>{item.descricao}</Text>
                        </View>
                      </View>
                  </View>
      </Pressable>
    </Animated.View>
  );
};


const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <View style={styles.emptyIconWrapper}>
      <Feather name="message-square" size={40} color={TEXT_SUB} />
    </View>
    <Text style={styles.emptyTitle}>Nenhuma publicação disponível</Text>
    <Text style={styles.emptySubtitle}>Novos avisos aparecerão aqui</Text>
  </View>
);

export default function FeedScreen() {
  const navigation = useNavigation();
  const backScale = useSharedValue(1);

  const {getPublicacoes} = useContext(DiretorContext);

  const [publicacoes, setPublicacoes] = useState<Publicacao[]>([]);

  useEffect(() => {
    async function initData() {
      const dataPublicacoes = await getPublicacoes();
      if (dataPublicacoes) setPublicacoes(dataPublicacoes);
    }
    initData();
  }, []);


  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backScale.value }]
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Header */}
      <View style={styles.headerWrapper}>
        <LinearGradient
          colors={[PRIMARY_BLUE, DEEP_INDIGO]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <SafeAreaView edges={['top']} style={styles.headerContent}>
            <View style={styles.topBar}>
              <Pressable 
                onPress={() => navigation.goBack()}
                onPressIn={() => backScale.value = withTiming(0.92)}
                onPressOut={() => backScale.value = withTiming(1)}
              >
                <Animated.View style={[styles.backButton, backAnimatedStyle]}>
                  <Feather name="arrow-left" size={22} color="#fff" />
                </Animated.View>
              </Pressable>
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle}>Feed</Text>
              <Text style={styles.headerSubtitle}>Acompanhe atualizações e avisos</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>

      {/* Lista de Publicações */}
      <FlatList
        data={publicacoes.sort((a, b) => new Date(b.dataRegistro).getTime() - new Date(a.dataRegistro).getTime())}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <PostCard item={item} index={index} />}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_SOFT,
  },
  headerWrapper: {
    zIndex: 10,
  },
  headerGradient: {
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 8,
    shadowColor: PRIMARY_BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  headerContent: {
    paddingHorizontal: 24,
  },
  topBar: {
    marginTop: 12,
    flexDirection: 'row',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    marginTop: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: WHITE,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  listPadding: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_MAIN,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  roleText: {
    fontSize: 12,
    color: TEXT_SUB,
  },
  dotSeparator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: TEXT_SUB,
    marginHorizontal: 8,
    opacity: 0.5,
  },
  timestampText: {
    fontSize: 12,
    color: TEXT_SUB,
  },
  categoryTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  contentContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  contentBody: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_MAIN,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: TEXT_SUB,
  },
  feedContainer: { paddingHorizontal: 0 },
  feedCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  postHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  postAvatar: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    backgroundColor: '#EFF6FF', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  postMeta: { marginLeft: 10, flex: 1 },
  postAuthor: { fontSize: 13, fontWeight: '700', color: TEXT_MAIN },
  postRole: { fontSize: 12, color: TEXT_SUB, fontWeight: '400' },
  postBody: { marginTop: 2 },
  postTitleText: { fontSize: 18, fontWeight: '800', color: TEXT_MAIN, marginBottom: 6, letterSpacing: -0.4 },
  postContent: { fontSize: 14, color: TEXT_SUB, lineHeight: 20 },
});
