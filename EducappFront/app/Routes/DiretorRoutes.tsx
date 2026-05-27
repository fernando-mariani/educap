import DiretorProvider from '@/context/Context/DiretorContext';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import 'react-native-reanimated';
import Settings from '../pages/Aluno/Settings';
import PostsRegister from '../pages/Diretor/PostsRegister';
import AulasManager from '../pages/Diretor/Routes/AulasRoutes';
import Home from '../pages/Diretor/Routes/HomeRoutes';
import TurmasRoutes from '../pages/Diretor/Routes/TurmaRoutes';

const Tab = createBottomTabNavigator();


export default function ProfessorRoutes() {

  return (
    <DiretorProvider>
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
      }}
      listeners={({navigation}) => ({
        tabPress: (e) => {
          e.preventDefault();

          navigation.navigate("Home", {screen: "Home"})
        }
      })}
      />


      <Tab.Screen name="Turmas" component={TurmasRoutes}
      options={{
       tabBarLabel: 'Turmas',
       tabBarIcon: ({focused}) => {
         return <Ionicons name="book-outline" size={20} color={focused ? '#275BF5' : '#727272ff'}/>
       }
      }}
      listeners={({navigation}) => ({
        tabPress: (e) => {
          e.preventDefault();

          navigation.navigate("Turmas", {screen: "TurmasManager"})
        }
      })}
      />

      <Tab.Screen name="PostsRegister" component={PostsRegister}
      options={{
        tabBarLabel: '',
       tabBarIcon: () => {
         return <Ionicons name="add" size={20} color={'#fff'}/>
       },
       tabBarIconStyle: {
         backgroundColor: '#275BF5',
         borderRadius: 100,
         width: 40,
         height: 40,
         justifyContent: 'center',
         alignItems: 'center',
       }
      }}/>

      
      <Tab.Screen name="AulasManager" component={AulasManager}
      options={{
       tabBarLabel: 'Aulas',
       tabBarIcon: ({focused}) => {
         return <Ionicons name='calendar-outline' size={20} color={focused ? '#275BF5' : '#727272ff'} />
       }
      }}
      listeners={({navigation}) => ({
        tabPress: (e) => {
          e.preventDefault();

          navigation.navigate("AulasManager", {screen: "AulasManager"})
        }
      })}
      />


      <Tab.Screen name="Settings" component={Settings}
      options={{
       tabBarLabel: 'Settings',
       tabBarIcon: ({focused}) => {
         return <Ionicons name='settings' size={20} color={focused ? '#275BF5' : '#727272ff'} />
       }
      }}
      />


    </Tab.Navigator>
    </DiretorProvider>
  );
}
