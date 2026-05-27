import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TurmasManager from "../TurmasManager";
import TurmaDetails from "../TurmasManager/TurmaDetails";
import TurmaRegister from "../TurmasManager/TurmaRegister";


export type TurmasStackParamList = {
  TurmasManager: undefined;
  TurmaRegister: undefined;
  TurmaDetails: { id: string };
};


const Stack = createNativeStackNavigator<TurmasStackParamList>();

export default function TurmaRoutes() {
    return (
            <Stack.Navigator initialRouteName="TurmasManager">
                <Stack.Screen name="TurmasManager"  component={TurmasManager} options={{headerShown: false}}/>
                <Stack.Screen   name="TurmaRegister" component={TurmaRegister} options={{headerShown: false}}/>
                <Stack.Screen   name="TurmaDetails" component={TurmaDetails} options={{
                    headerShown: false}}/>
            </Stack.Navigator>
    )
}