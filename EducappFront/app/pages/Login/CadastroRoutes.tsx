import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import CadastroUser from "./Cadastro";
import CadastroAluno from "./CadastroAluno";
import CadastroProfessor from "./CadastroProfessor";
import { LoginStackParamList } from "./LoginRoutes";

export type CadastroStackParamList = {
    CadastroUser: undefined;
    CadastroAluno: {key: string};
    CadastroProfessor: {key: string};
}

type NavigationProps = NativeStackNavigationProp<LoginStackParamList, 'CadastroRoutes'>;

const Stack = createNativeStackNavigator();

export default function Cadastro() {
    return (
            <Stack.Navigator initialRouteName="Cadastro">
                <Stack.Screen name="Cadastro"  component={CadastroUser} options={{headerShown: false}}/>
                <Stack.Screen name="CadastroAluno" component={CadastroAluno} options={{headerShown: false}}/>
                <Stack.Screen name="CadastroProfessor" component={CadastroProfessor} options={{headerShown: false}}/>
            </Stack.Navigator>
    )
}