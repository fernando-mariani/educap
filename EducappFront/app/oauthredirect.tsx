import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const PRIMARY_COLOR = '#275BF5';

export default function OAuthRedirect() {
    return (
    <View style={styles.container}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text style={styles.text}>Carregando...</Text>
    </View>
        
        );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 16,
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '600',
  },
});