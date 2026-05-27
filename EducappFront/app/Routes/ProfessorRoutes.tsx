import ProfessorProvider from '@/context/Context/ProfessorContext';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import 'react-native-reanimated';
import Settings from '../pages/Aluno/Settings';
import AulasManager from '../pages/Professor/AulasManager';
import Home from '../pages/Professor/Routes/HomeRoutes';
import AtividadesRoutes from '../pages/Professor/Routes/atividadesRoutes';


const Tab = createBottomTabNavigator();


export default function ProfessorRoutes() {

  return (
    <ProfessorProvider>
    <Tab.Navigator screenOptions={{
      animation: 'shift',
      tabBarStyle: {
        backgroundColor: '#f4f4f4ff',
        borderTopWidth: 1,
        borderTopColor: '#727272ff',
        padding: 10,
        justifyContent: 'space-between'
      },
      headerShown: false,
      tabBarActiveTintColor: '#275BF5',
      tabBarInactiveTintColor: '#727272ff',
    }}>


      <Tab.Screen name="Home" component={Home}
      options={{
       tabBarLabel: 'Home',
       tabBarIcon: ({focused}) => {
         return <Ionicons name="home" size={20} color={focused ? '#275BF5' : '#727272ff'}/>
       }
      }}/>


      <Tab.Screen name="Atividades" component={AtividadesRoutes}
      options={{
       tabBarLabel: 'Atividades',
       tabBarIcon: ({focused}) => {
         return <Ionicons name="reader-outline" size={20} color={focused ? '#275BF5' : '#727272ff'}/>
       }
      }}/>
      
      <Tab.Screen name="Aulas" component={AulasManager}
      options={{
       tabBarLabel: 'Aulas',
       tabBarIcon: ({focused}) => {
         return <Ionicons name='calendar-outline' size={20} color={focused ? '#275BF5' : '#727272ff'} />
       }
      }}/>


      <Tab.Screen name="Settings" component={Settings}
      options={{
       tabBarLabel: 'Settings',
       tabBarIcon: ({focused}) => {
         return <Ionicons name='settings' size={20} color={focused ? '#275BF5' : '#727272ff'} />
       }
      }}
      />

    </Tab.Navigator>
    </ProfessorProvider>
  );
}
