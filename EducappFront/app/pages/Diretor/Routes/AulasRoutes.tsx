import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AulasManager from "../AulasManager";
import criarTemplate from "../AulasManager/criarTemplate";



const Stack = createNativeStackNavigator();

export default function AulasRoutes() {
    return (
            <Stack.Navigator initialRouteName="AulasManager">
                <Stack.Screen name="AulasManager"  component={AulasManager} options={{headerShown: false}}/>
                <Stack.Screen   name="criarTemplate" component={criarTemplate} options={{headerShown: false}}/>
            </Stack.Navigator>
    )
}