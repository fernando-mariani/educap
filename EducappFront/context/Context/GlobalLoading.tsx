import { useAppContext } from '@/context/Context/appContext';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const PRIMARY_COLOR = '#275BF5';

export default function GlobalLoading() {
  const { loading } = useAppContext();

  if (!loading) return null;

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text style={styles.text}>Carregando...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    elevation: 10,
  },
  box: {
    width: 140,
    height: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  text: {
    marginTop: 16,
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '600',
  },
});