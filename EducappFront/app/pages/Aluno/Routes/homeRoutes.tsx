import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../Home";
import Dashboard from "../Home/Dashboard";
import FeedScreen from "../Home/Feed";
import Turma from "../Home/Turma";


const Stack = createNativeStackNavigator();

export default function AtividadesRoute() {
    return (
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home"  component={Home} options={{headerShown: false}}/>
                <Stack.Screen   name="Dashboard" component={Dashboard} options={{headerShown: false}}/>
                <Stack.Screen   name="Turma" component={Turma} options={{headerShown: false}}/>
                <Stack.Screen   name="Feed" component={FeedScreen} options={{headerShown: false}}/>

            </Stack.Navigator>
    )
}