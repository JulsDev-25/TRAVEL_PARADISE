import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './HomePage';
import Notifications from './Notifications';
import { Ionicons } from '@expo/vector-icons';
import Visites from './Visites.js';
import ProfileScreen from './ProfileScreen.js';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Visites') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Profile') { // Ajouter la condition pour l'onglet Profile
            iconName = focused ? 'person' : 'person-outline'; // Icônes pour le profil
          }

          // Vous pouvez ajouter d'autres conditions ici pour d'autres onglets si nécessaire

          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: '#041562',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 90,
          paddingBottom: 6,
          paddingTop: 6,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Visites" component={Visites} />
      <Tab.Screen name="Notifications" component={Notifications} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}