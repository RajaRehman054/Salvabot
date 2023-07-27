import React, {
	useState,
	useRef,
	useContext,
	useCallback,
	useEffect,
} from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	StyleSheet,
	SafeAreaView,
	Image,
	FlatList,
	Modal,
	Button,
	Animated,
	Vibration,
	PermissionsAndroid,
	Platform,
	RefreshControl,
	Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import url from '../../utils/url';
import { AuthContext } from '../../auth/AuthContext';
import Loader from '../../components/Loader';
import { useFocusEffect } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';

export default function HomeScreen({ navigation }) {
	const img1 = require('../../assets/salvabot_logo.png');
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState(null);
	const { user, userData, setUserData } = useContext(AuthContext);
	const [showPopup, setShowPopup] = useState(false);
	const [latitude, setLatitude] = useState(null);
	const [longitude, setLongitude] = useState(null);
	const timeoutRef = useRef(null);
	const scaleValue = useRef(new Animated.Value(1)).current;
	const [refreshing, setRefreshing] = useState(false); 

	const handleAlreadyPressed = () => {
		Animated.spring(scaleValue, {
			toValue: 1.1,
			useNativeDriver: true,
		}).start();

		Vibration.vibrate(100);
		setShowPopup(true);
	};

	const handlePressIn = () => {
		Animated.spring(scaleValue, {
			toValue: 1.1,
			useNativeDriver: true,
		}).start();
		timeoutRef.current = setTimeout(async () => {
			let headersList = {
				Authorization: `Token ${user.auth_token}`,
				'Content-Type': 'application/json',
			};
			let bodyContent = JSON.stringify({
				button: `${user.panic_button.id}`,
				geo_location: {
					accuracy: 2,
					altitude: 22,
					longitude: longitude,
					latitude: latitude,
					speed: 2,
				},
			});
			setLoading(true);
			let response = await fetch(`${url}activity/api/press/`, {
				method: 'POST',
				body: bodyContent,
				headers: headersList,
			});
			if (!response.ok) {
				Alert.alert('No estas permitido');
			} else {
				getInformation();
				setLoading(false);
				Vibration.vibrate();
				setShowPopup(true);
			}
		}, 1000);
	};

	const handlePressOut = async () => {
		scaleValue.setValue(1);
		clearTimeout(timeoutRef.current);
	};

	const handlePopupDismiss = () => {
		setShowPopup(false);
		scaleValue.setValue(1);
	};

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

	const getListOfButtons = async () => {
		setLoading(true);
		let headersList = {
			Authorization: `Token ${user.auth_token}`,
		};
		let response = await fetch(`${url}button/api/in-custody/`, {
			method: 'GET',
			headers: headersList,
		});
		const data = await response.json();
		setData(data);
		setLoading(false);
	};

	const handleNavigation = item => {
		navigation.navigate('SecondaryScreen', { item });
	};

	const requestLocationPermission = async () => {
		try {
			if (Platform.OS === 'android') {
				const granted = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
					{
						title: 'Location Permission',
						message:
							'We need your permission to access your location.',
						buttonPositive: 'OK',
					}
				);
				if (granted === PermissionsAndroid.RESULTS.GRANTED) {
					Geolocation.getCurrentPosition(
						position => {
							setLongitude(position.coords.longitude);
							setLatitude(position.coords.latitude);
						},
						error => {
							console.warn(
								'Error getting current location:',
								error
							);
						},
						{
							enableHighAccuracy: true,
							timeout: 20000,
							maximumAge: 1000,
						}
					);
				} else {
				}
			} else {
				Geolocation.getCurrentPosition(
					position => {
						setLongitude(position.coords.longitude);
						setLatitude(position.coords.latitude);
					},
					error => {
						console.warn('Error getting current location:', error);
					},
					{
						enableHighAccuracy: true,
						timeout: 20000,
						maximumAge: 1000,
					}
				);
			}
		} catch (error) {
			console.warn('Error requesting location permission:', error);
		}
	};

	const onRefresh = useCallback(() => {
		
		setRefreshing(true);

		getInformation()
		getListOfButtons()
		  .then(() => {
			setRefreshing(false); 
		  })
		  .catch(error => {
			console.warn('Error refreshing data:', error);
			setRefreshing(false); 
		  });
	  }, []);

	useFocusEffect(
		useCallback(() => {
			getInformation();
			getListOfButtons();
		}, [])
	);

	useEffect(() => {
		requestLocationPermission();
	}, []);

	if (loading) {
		return <Loader />;
	}

	const ListFooterComponent = () => (
		<SafeAreaView>
			<View style={styles.uppertab}>
				<View style={styles.innertab}>
					<View>
						<Text style={styles.text2}>Botón de Pánico de</Text>
						<Text style={styles.text1}>{user.caption}</Text>
					</View>
					<TouchableOpacity
						onPress={() => navigation.navigate('ProfileScreen1')}>
						<Image source={img1} style={styles.img}></Image>
					</TouchableOpacity>
				</View>
			</View>
			<TouchableOpacity
				style={[
					styles.buttontab,
					{ transform: [{ scale: scaleValue }] },
				]}
				onPressIn={
					user.panic_button.is_pressed
						? handleAlreadyPressed
						: handlePressIn
				}
				onPressOut={handlePressOut}>
				<Text style={styles.buttontext}>
					{user.panic_button.is_pressed
						? 'ya presionado'
						: 'Prensa 2 segundos'}
				</Text>
			</TouchableOpacity>
			<Modal visible={showPopup} transparent={true}>
				<View style={styles.modalContainer}>
					<View style={styles.popupContainer}>
						<Text style={styles.popupText}>
							{user.panic_button.is_pressed
								? 'botón ya activado'
								: 'Botón activado'}
						</Text>
						<Button
							title='Ok'
							onPress={handlePopupDismiss}
							color={'#D52C2C'}
						/>
					</View>
				</View>
			</Modal>

			<Text style={styles.text3}>En custodia</Text>

			<FlatList
				style={styles.list1}
				data={data}
				renderItem={renderItem}
				keyExtractor={item => item.id}
			/>
		</SafeAreaView>
	);

	const renderItem = ({ item }) => (
		<TouchableOpacity
			style={[styles.button11]}
			onPress={() => handleNavigation(item)}>
			<View style={{ width: '20%' }}>
				<View
					style={[
						{
							...styles.buttonround,
							backgroundColor: item.is_pressed
								? '#D52C2C'
								: 'gray',
						},
					]}></View>
			</View>
			<View style={{ width: '55%' }}>
				<Text style={styles.text12}>{item.name}</Text>
			</View>
			<View style={{ width: '10%' }}>
				<Text
					style={[
						styles.text13,
						{
							color: item.is_pressed ? '#D52C2C' : 'gray',
						},
					]}>
					{item.is_pressed ? 'EN' : 'DE'}
				</Text>
			</View>
			<View style={{ width: '15%' }}>
				<Ionicons
					name='chevron-forward'
					color={'#677294'}
					size={25}
					style={{ alignSelf: 'center' }}
				/>
			</View>
		</TouchableOpacity>
	);

	return (
		<LinearGradient
			colors={['#FCDD47', '#F9F8F8', '#F9F8F8', '#FCDD47']}
			locations={[0, 0.3, 0.7, 1]}
			start={{ x: -0.3, y: 0 }}
			end={{ x: 1.3, y: 1 }}
			style={{ flex: 1 }}>
			<FlatList
				data={[]}
				renderItem={() => null}
				ListFooterComponent={ListFooterComponent}
				refreshControl={ 
					<RefreshControl
					  refreshing={refreshing} 
					  onRefresh={onRefresh} 
					  colors={['#D52C2C']} 
					  tintColor={'#D52C2C'}
					/>
				  }
			/>
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	uppertab: {
		height: 125,
		backgroundColor: '#D52C2C',
		alignItems: 'center',
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
	},
	innertab: {
		width: '95%',
		height: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 5,
	},
	img: {
		height: 60,
		width: 60,
	},
	text1: {
		fontWeight: 'bold',
		color: 'white',
		fontSize: 25,
	},
	text2: {
		fontWeight: 'light',
		color: 'white',
		fontSize: 20,
	},
	text3: {
		fontWeight: 'medium',
		color: 'black',
		fontSize: 25,
		alignSelf: 'center',
		marginBottom: 20,
	},
	buttontext: {
		fontWeight: 'medium',
		color: 'white',
		fontSize: 20,
		padding: 5,
	},
	buttontab: {
		height: 180,
		width: 180,
		backgroundColor: '#D52C2C',
		marginTop: 50,
		marginBottom: 50,
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
		borderRadius: 100,
		elevation: 10,
		shadowColor: '#000000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
	},
	buttonround: {
		height: 30,
		width: 30,
		backgroundColor: '#D52C2C',
		alignSelf: 'center',
		borderRadius: 100,
	},
	text12: {
		color: 'black',
		fontWeight: 'regular',
		fontSize: 20,
	},
	text13: {
		fontWeight: 'regular',
		fontSize: 18,
	},
	button11: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'white',
		height: 60,
		borderBottomColor: '#E2E2E2',
		borderBottomWidth: 1,
		borderRadius: 15,
	},
	list1: {
		alignSelf: 'center',
		width: '90%',
		elevation: 5,
		marginBottom: 50,
		backgroundColor: 'white',
		borderRadius: 15,
		shadowColor: '#000000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
	},
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	popupContainer: {
		backgroundColor: 'white',
		padding: 20,
		borderRadius: 8,
		elevation: 5,
	},
	popupText: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 10,
		color: 'black',
	},
});
