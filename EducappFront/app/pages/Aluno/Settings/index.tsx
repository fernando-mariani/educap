import { useAppContext } from '@/context/Context/appContext';
import { Feather } from '@expo/vector-icons';
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

//Tela ainda em desenvolvimento
export default function Settings() {

    const {logout} = useAppContext();

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={logout}>
              <Feather name='user-x' size={24} color="#FFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    alignContent: 'center',
  },
  button: {
    backgroundColor: "#f53527",
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    margin: 10
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
