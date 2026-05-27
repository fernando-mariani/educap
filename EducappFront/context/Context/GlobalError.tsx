import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from './appContext';

const ERROR_COLOR = '#EF4444';
const ERROR_BG_COLOR = '#FEF2F2';

export default function GlobalError() {
  const { errorHandler, setErrorHandler } = useAppContext();

  if (errorHandler === null || !errorHandler.erro) return null;

  return (
    <View style={styles.container}>
      <View style={styles.modalBox}>
        <View style={styles.iconContainer}>
          <Feather name="alert-circle" size={32} color={ERROR_COLOR} />
        </View>
        <Text style={styles.title}>{errorHandler.title}</Text>
        <Text style={styles.message}>{errorHandler.message}</Text>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => setErrorHandler(null)}
        >
          <Text style={styles.buttonText}>Entendi</Text>
        </TouchableOpacity>
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
    zIndex: 10000, // Make sure it's on top of everything
  },
  modalBox: {
    width: '90%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: ERROR_BG_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    backgroundColor: ERROR_COLOR,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch', // Takes the full width of the modalBox
    shadowColor: ERROR_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});