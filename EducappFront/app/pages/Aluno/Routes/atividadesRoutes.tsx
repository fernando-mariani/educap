import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Atividades from "../Atividades";
import DetalhesDaTarefa from "../Atividades/detalhesTarefa";

export type AtividadesStackParamList = {
  Atividades: undefined;
  detalhesTarefa: { id?: string };
};

const Stack = createNativeStackNavigator<AtividadesStackParamList>();

export default function AtividadesRoute() {
    return (
            <Stack.Navigator initialRouteName="Atividades">
                <Stack.Screen name="Atividades"  component={Atividades} options={{headerShown: false}}/>
                <Stack.Screen   name="detalhesTarefa" component={DetalhesDaTarefa} options={{
                    title: 'Detalhes da Tarefa',
                    headerShown: false}}/>
            </Stack.Navigator>
    )
}