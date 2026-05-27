import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../Home";
import FeedScreen from "../Home/Feed";
import ManageKeysScreen from "../Routes/KeysRoutes";



const Stack = createNativeStackNavigator();

export default function HomeRoutes() {
    return (
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home"  component={Home} options={{headerShown: false}}/>
                <Stack.Screen   name="KeysManager" component={ManageKeysScreen} options={{headerShown: false}}/>
                <Stack.Screen   name="Feed" component={FeedScreen} options={{headerShown: false}}/>
            </Stack.Navigator>
    )
}