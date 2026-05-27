import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CadastroRoutes from "./CadastroRoutes";
import Login from "./Login";

export type LoginStackParamList = {
    Login: undefined;
    CadastroRoutes: undefined;
}

const Stack = createNativeStackNavigator<LoginStackParamList>();

export default function LoginRoutes() {
    return (
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login"  component={Login} options={{headerShown: false}}/>
                <Stack.Screen name="CadastroRoutes" component={CadastroRoutes} options={{headerShown: false}}/>
            </Stack.Navigator>
    )
}