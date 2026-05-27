import { createNativeStackNavigator } from "@react-navigation/native-stack";
import KeysManager from "../KeysManager";
import VerifyUsers from "../KeysManager/verifyUsers";



const Stack = createNativeStackNavigator();

export default function HomeRoutes() {
    return (
            <Stack.Navigator initialRouteName="KeysManager">
                <Stack.Screen name="KeysManager"  component={KeysManager} options={{headerShown: false}}/>
                <Stack.Screen   name="VerifyUsers" component={VerifyUsers} options={{headerShown: false}}/>
            </Stack.Navigator>
    )
}