import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Atividades from "../AtividadesCadastradas";
import CriarAtividade from "../AtividadesManager";
import EditarAtividades from "../EditarAtividades";


export type AtividadesStackParamList = {
  Atividades: undefined;
  EditarAtividades: { id: string };
  CriarAtividade: undefined;
};


const Stack = createNativeStackNavigator<AtividadesStackParamList>();

export default function AtividadesRoute() {
    return (
            <Stack.Navigator initialRouteName="Atividades">
                <Stack.Screen name="Atividades"  component={Atividades} options={{headerShown: false}}/>
                <Stack.Screen   name="EditarAtividades" component={EditarAtividades} options={{
                    headerShown: false}}/>
                <Stack.Screen name="CriarAtividade" component={CriarAtividade} options={{headerShown: false}}/>
            </Stack.Navigator>
    )
}