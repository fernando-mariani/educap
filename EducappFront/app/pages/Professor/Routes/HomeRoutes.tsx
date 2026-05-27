import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../Home";
import Dashboard from "../Home/Dashboard";
import DetalhesTurma from "../Home/DetalhesTurma";
import FeedScreen from "../Home/Feed";
import Turmas from "../Home/Turmas";


const Stack = createNativeStackNavigator();

export default function HomeRoutes() {

    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
            <Stack.Screen name="Turmas" component={Turmas} options={{ headerShown: false }} />
            <Stack.Screen name="DetalhesTurma" component={DetalhesTurma} options={{ headerShown: false }} />
            <Stack.Screen name="Feed" component={FeedScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    )

}