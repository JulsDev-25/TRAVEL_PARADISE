import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import Login from './screens/Login';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './screens/HomePage.js';
import BottomTabNavigator from './screens/BottomTabNavigator.js';
import Description from './screens/Description.js';
import Presences from './screens/Presences.js';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="homeScreen" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="connexion" component={Login} />
          <Stack.Screen name="homeScreen" component={HomeScreen} />
          <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} />
          <Stack.Screen name="Description" component={Description}/>
          <Stack.Screen name="Presences" component={Presences} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}
