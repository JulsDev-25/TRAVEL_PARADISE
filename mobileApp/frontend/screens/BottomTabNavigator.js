import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './HomePage';
import Notifications from './Notifications';
import { Ionicons } from '@expo/vector-icons';
import ToolScreen from './ToolsScreen';
import Presences from './Presences.js';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
            else if (route.name === 'Presences') iconName = focused ? 'calendar' : 'calendar-outline';
            else if (route.name === 'Notifications') iconName = focused ? 'notifications' : 'notifications-outline';

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
        <Tab.Screen name="Presences" component={Presences} />
        <Tab.Screen name="Notifications" component={Notifications} />
      </Tab.Navigator>
  );
}
