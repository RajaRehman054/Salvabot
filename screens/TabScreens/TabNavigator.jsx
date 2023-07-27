import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from './HomeScreen';
import EventsScreen from './EventsScreen';
import ProfileScreen from './ProfileScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

import url from '../../utils/url';
import { useEffect, useState, useContext } from 'react';
import Loader from '../../components/Loader';
import { AuthContext } from '../../auth/AuthContext';

const Tab = createBottomTabNavigator();

const CircleTabBarIcon = ({ name, size, color }) => {
	return (
		<View style={[styles.circleContainer, { backgroundColor: color }]}>
			<Ionicons name={name} size={size} color='#FFFFFF' />
		</View>
	);
};

export default function TabNavigator() {
	const { user, userData, setUserData } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);

	const getInformation = async () => {
		setLoading(true);
		let headersList = {
			Authorization: `Token ${user.auth_token}`,
		};
		let response = await fetch(`${url}info/api/${user.panic_button.id}/`, {
			method: 'GET',
			headers: headersList,
		});
		const data = await response.json();
		setUserData(data);
		setLoading(false);
	};
	useEffect(() => {
		getInformation();
	}, []);

	if (loading) {
		return <Loader />;
	}
    
	return (
		<SafeAreaView style={styles.container}>
			<Tab.Navigator
				screenOptions={({ route }) => ({
					tabBarIcon: ({ size, color }) => {
						let iconName;

						if (route.name === 'Home') {
							iconName = 'home-outline';
						} else if (route.name === 'Events') {
							iconName = 'notifications-outline';
						} else if (route.name === 'Profile') {
							iconName = 'person-outline';
						}

						return (
							<CircleTabBarIcon
								name={iconName}
								size={size}
								color={color}
							/>
						);
					},
					tabBarStyle: {
						height: 75,
						backgroundColor: '#FFFFFF',
						borderTopLeftRadius: 20,
						borderTopRightRadius: 20,
						...Platform.select({
							ios: {
								paddingBottom: 0, // Remove bottom padding for iOS
							},
						}),
					},
					headerShown: false,
					tabBarActiveTintColor: '#E45353',
					tabBarInactiveTintColor: '#BBBBBB',
					tabBarShowLabel: false,
				})}>
				<Tab.Screen name='Home' component={HomeScreen} />
				<Tab.Screen name='Events' component={EventsScreen} />
				<Tab.Screen name='Profile' component={ProfileScreen} />
			</Tab.Navigator>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	circleContainer: {
		width: 50,
		height: 50,
		borderRadius: 25,
		justifyContent: 'center',
		alignItems: 'center',
	},
	container: {
		flex: 1,
		position: 'relative',
	},
});
