import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from '../screens/TabScreens/TabNavigator';
import MapScreen from '../screens/StackScreens/MapScreen';
import EventInfoScreen from '../screens/StackScreens/EventInfoScreen';
import SecondaryScreen from '../screens/StackScreens/SecondaryScreen';
import ProfileScreen1 from '../screens/StackScreens/ProfileScreen1';

const Stack = createNativeStackNavigator();

const MainStack = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name='TabNavigator' component={TabNavigator} />
			<Stack.Screen name='EventInfoScreen' component={EventInfoScreen} />
			<Stack.Screen name='SecondaryScreen' component={SecondaryScreen} />
			<Stack.Screen name='MapScreen' component={MapScreen} />
			<Stack.Screen name='ProfileScreen1' component={ProfileScreen1} />
		</Stack.Navigator>
	);
};

export default MainStack;
