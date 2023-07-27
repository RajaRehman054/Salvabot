import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, createContext, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [userData, setUserData] = useState(null);
	const [loading, setLoading] = useState(true);

	const logIn = async data => {
		setLoading(true);
		await AsyncStorage.setItem('user', data);
		setUser(JSON.parse(data));
		setLoading(false);
	};

	const logOut = async () => {
		setLoading(true);
		await AsyncStorage.removeItem('user');
		setUser(null);
		setUserData(null);
		setLoading(false);
	};

	const isLoggedIn = async () => {
		try {
			const data = await AsyncStorage.getItem('user');
			const finalData = JSON.parse(data);
			setUser(finalData);
			setLoading(false);
		} catch (error) {
			console.log(`Error is ${error}.`);
		}
	};

	useEffect(() => {
		isLoggedIn();
	}, []);

	return (
		<AuthContext.Provider
			value={{ user, loading, logIn, logOut, userData, setUserData }}>
			{children}
		</AuthContext.Provider>
	);
};
