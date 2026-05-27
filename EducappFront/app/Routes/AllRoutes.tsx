import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAppContext } from "../../context/Context/appContext";
import LoginRoutes from "../pages/Login/LoginRoutes";
import AlunoRoutes from "./AlunoRoutes";
import DiretorRoutes from "./DiretorRoutes";
import ProfessorRoutes from "./ProfessorRoutes";


const Stack = createNativeStackNavigator();

export default function AllRoutes() {

    const { isAluno, isProfessor, isDiretor, isSigned, loading } = useAppContext();

    return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isSigned ? (
        <Stack.Screen name="Login" component={LoginRoutes} />
      ) : isAluno ? (
        <Stack.Screen name="Aluno" component={AlunoRoutes} />
      ) : isProfessor ? (
        <Stack.Screen name="Professor" component={ProfessorRoutes} />
      ) : isDiretor ? (
        <Stack.Screen name="Diretor" component={DiretorRoutes} />
      ) :
      (
        <Stack.Screen name="LoginFallback" component={LoginRoutes} />
      )}
    </Stack.Navigator>
    </GestureHandlerRootView>
  );
}