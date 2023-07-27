import { useState, useContext, useEffect } from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	SafeAreaView,
	Linking,
	Alert,
	PermissionsAndroid,
	Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Switch } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import url from '../../utils/url';
import { AuthContext } from '../../auth/AuthContext';
import Loader from '../../components/Loader';
import Geolocation from 'react-native-geolocation-service';

const SecondaryScreen = ({ navigation, route }) => {
	const item = route.params.item;
	const [loading, setLoading] = useState(false);
	const { user, userData } = useContext(AuthContext);
	const [isEnabled, setIsEnabled] = useState(item.is_pressed);
	const [latitude, setLatitude] = useState(null);
	const [longitude, setLongitude] = useState(null);

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

	const handleDialButtonPress = number => {
		Linking.openURL(`tel:${number}`);
	};

	const buttonHandler = async () => {
		setLoading(true);
		let headersList = {
			Authorization: `Token ${user.auth_token}`,
			'Content-Type': 'application/json',
		};

		let bodyContent = JSON.stringify({
			button: `${item.id}`,
			geo_location: {
				accuracy: 2,
				altitude: 22,
				longitude: longitude,
				latitude: latitude,
				speed: 2,
			},
		});
		if (!isEnabled) {
			setLoading(true);
			let response = await fetch(`${url}activity/api/press/`, {
				method: 'POST',
				body: bodyContent,
				headers: headersList,
			});
			if (!response.ok) {
				setLoading(false);
				Alert.alert(
					'El actor o el Botón de Pánico no cuenta con una subscripción vigente'
				);
			} else {
				setLoading(false);
				setIsEnabled(true);
				Alert.alert('Botón activado con éxito.');
			}
		} else {
			const response = await fetch(`${url}activity/api/release/`, {
				method: 'POST',
				body: JSON.stringify({
					button: `${item.id}`,
				}),
				headers: {
					Authorization: `Token ${user.auth_token}`,
					'Content-Type': 'application/json',
				},
			});
			if (!response.ok) {
				setLoading(false);
				Alert.alert('Algo salió mal.');
			} else {
				setLoading(false);
				Alert.alert('Botón sin presionar con éxito.');
				setIsEnabled(false);
			}
		}
	};

	useEffect(() => {
		setLoading(true);
		requestLocationPermission();
		setLoading(false);
	}, []);

	if (loading) return <Loader />;

	return (
		<LinearGradient
			colors={['#FCDD47', '#F9F8F8', '#F9F8F8', '#FCDD47']}
			locations={[0, 0.3, 0.7, 1]}
			start={{ x: -0.3, y: 0 }}
			end={{ x: 1.5, y: 1 }}
			style={{ flex: 1 }}>
			<ScrollView>
				<SafeAreaView>
					<View style={styles.uppertab}>
						<View style={styles.innertab}>
							<TouchableOpacity
								onPress={() => navigation.goBack()}>
								<Ionicons
									name='chevron-back'
									color={'black'}
									size={30}
								/>
							</TouchableOpacity>
							<View>
								<View style={styles.imgview}>
									<Text style={styles.text}>{item.name}</Text>
								</View>
							</View>
							<View>
								<Ionicons
									name='chevron-back'
									color={'transparent'}
									size={30}
								/>
							</View>
						</View>
					</View>

					<View
						style={[
							styles.button12,
							{
								height: 50,
								width: '90%',
								alignSelf: 'center',
							},
						]}>
						<View style={{ width: '40%' }}>
							<Text
								style={{
									color: 'black',
									fontWeight: 'medium',
									fontSize: 24,
								}}>
								Activar
							</Text>
						</View>

						<View style={styles.togglebutton}>
							<Switch
								style={{
									marginLeft: 'auto',
									transform: [
										{ scaleX: 1.2 },
										{ scaleY: 1.2 },
									],
								}}
								trackColor={{
									false: 'lightgray',
									true: '#D52C2C',
								}}
								thumbColor={isEnabled ? 'white' : '#D52C2C'}
								onValueChange={buttonHandler}
								value={isEnabled}
							/>
						</View>
					</View>

					<View style={styles.shadowbar}>
						<View style={[styles.button11, { height: 30 }]}>
							<View style={{ width: '40%' }}>
								<Text style={styles.text12}>Suscripción</Text>
							</View>
							<View style={{ width: '40%' }}></View>
						</View>
						<View style={[styles.button11, { height: 30 }]}>
							<View style={{ width: '40%' }}>
								<Text style={styles.text12}>
									Fecha de caducidad:
								</Text>
							</View>
							<View style={{ width: '40%' }}>
								<Text style={styles.text13}>
									{userData.subscription.end_date}
								</Text>
							</View>
						</View>
					</View>

					<View style={styles.shadowbar}>
						<View style={[styles.button11]}>
							<View style={{ width: '40%' }}>
								<Text style={styles.text12}>
									Nombre completo:
								</Text>
							</View>
							<View style={{ width: '40%' }}>
								<Text style={styles.text13}>
									{user.caption}
								</Text>
							</View>
						</View>
						<View style={[styles.button11]}>
							<View style={{ width: '40%' }}>
								<Text style={styles.text12}>Nacionalidad:</Text>
							</View>
							<View style={{ width: '40%' }}>
								<Text style={styles.text13}>
									{userData.nationality
										? userData.nationality
										: 'none'}
								</Text>
							</View>
						</View>
						<View style={[styles.button11]}>
							<View style={{ width: '40%' }}>
								<Text style={styles.text12}>
									Identificación del documento:
								</Text>
							</View>
							<View style={{ width: '40%' }}>
								<Text style={styles.text13}>
									{userData.subscription.user}
								</Text>
							</View>
						</View>
						<View style={[styles.button11]}>
							<View style={{ width: '40%' }}>
								<Text style={styles.text12}>
									Tipo de sangre:{' '}
								</Text>
							</View>
							<View style={{ width: '40%' }}>
								<Text style={styles.text13}>
									{userData.address_list[0].type}
								</Text>
							</View>
						</View>
					</View>

					<View style={styles.shadowbar}>
						<View style={[styles.button11, { height: 30 }]}>
							<View style={{ width: '40%' }}>
								<Text style={styles.text12}>
									Número de teléfono
								</Text>
							</View>
							<View style={{ width: '40%' }}></View>
						</View>
						{userData.phonenumber_list &&
						userData.phonenumber_list.length > 0 ? (
							userData.phonenumber_list.map(elem => {
								return (
									<TouchableOpacity
										style={[
											styles.button11,
											{ height: 30 },
										]}
										onPress={() =>
											handleDialButtonPress(
												elem.phone_number
											)
										}
										key={elem.id}>
										<View
											style={{
												width: '60%',
												flexDirection: 'row',
											}}>
											<Ionicons
												name='call'
												color={'#677294'}
												size={20}
												style={{ alignSelf: 'center' }}
											/>
											<Text
												style={[
													styles.text14,
													{ marginLeft: 10 },
												]}>
												{elem.phone_number}
											</Text>
										</View>
										<View style={{ width: '20%' }}>
											<Text style={styles.text13}>
												{elem.type === 'M'
													? '(Principal)'
													: elem.type === 'E'
													? '(Emergencia)'
													: '(Trabajo)'}
											</Text>
										</View>
									</TouchableOpacity>
								);
							})
						) : (
							<Text
								style={[
									{
										...styles.text13,
										fontSize: 15,
										marginLeft: 0,
										textAlign: 'center',
									},
								]}>
								Sin datos
							</Text>
						)}
					</View>

					<View style={styles.shadowbar}>
						<View style={[styles.button11, { height: 30 }]}>
							<View style={{ width: '40%' }}>
								<Text style={styles.text12}>Dirección</Text>
							</View>
							<View style={{ width: '40%' }}></View>
						</View>
						{userData.address_list &&
						userData.address_list.length > 0 ? (
							userData.address_list.map(elem => {
								return (
									<TouchableOpacity
										style={[
											styles.button11,
											{ height: 50 },
										]}
										onPress={() =>
											navigation.navigate('MapScreen', {
												itemId: elem.location,
											})
										}
										key={elem.id}>
										<View
											style={{
												width: '85%',
												height: '100%',
												alignItems: 'center',
												flexDirection: 'row',
											}}>
											<Text
												style={[
													styles.text14,
													{ width: '80%' },
												]}>
												{elem.address}
											</Text>
											<Text
												style={[
													{
														...styles.text14,
														color: '#E45353',
														width: '20%',
													},
												]}>
												{elem.type === 'H'
													? '(Casa)'
													: elem.type === 'E'
													? '(Escolar)'
													: '(Trabajo)'}
											</Text>
										</View>
										<View style={{ width: '5%' }}>
											<Ionicons
												name='chevron-forward'
												color={'#677294'}
												size={20}
												style={{ alignSelf: 'center' }}
											/>
										</View>
									</TouchableOpacity>
								);
							})
						) : (
							<Text
								style={[
									{
										...styles.text13,
										fontSize: 15,
										marginLeft: 0,
										textAlign: 'center',
									},
								]}>
								Sin datos
							</Text>
						)}
					</View>
				</SafeAreaView>
			</ScrollView>
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	scrollview: {
		flex: 1,
		backgroundColor: 'white',
	},
	uppertab: {
		height: 120,
		alignItems: 'center',
	},
	innertab: {
		width: '90%',
		height: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	imgview: {
		alignItems: 'center',
	},
	text: {
		fontFamily: 'Poppins',
		color: 'black',
		fontWeight: '900',
		fontSize: 24,
		marginBottom: '5%',
	},

	touchsign: {
		borderRadius: 12,
		height: 55,
		width: '90%',
		marginTop: '5%',
		marginBottom: '10%',
		backgroundColor: '#E45353',
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
	},
	textsign: {
		color: 'mintcream',
		fontFamily: 'Poppins',
		fontWeight: 'bold',
		fontSize: 16,
	},
	text12: {
		color: '#E45353',
		fontWeight: 'medium',
		fontSize: 13,
	},
	text13: {
		color: '#677294',
		fontWeight: 'regular',
		fontSize: 12,
		marginLeft: 'auto',
	},
	text14: {
		color: '#677294',
		fontWeight: 'regular',
		fontSize: 13,
	},
	button11: {
		flexDirection: 'row',
		backgroundColor: 'white',
		height: 40,
		justifyContent: 'space-evenly',
		alignItems: 'center',
		borderRadius: 12,
	},
	button12: {
		flexDirection: 'row',
		height: 40,
		justifyContent: 'space-between',
		alignItems: 'center',
		borderRadius: 12,
		marginBottom: '5%',
	},
	togglebutton: { width: '40%' },
	shadowbar: {
		elevation: 5,
		width: '90%',
		alignSelf: 'center',
		borderRadius: 12,
		backgroundColor: 'white',
		marginBottom: '8%',
		shadowColor: '#000000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
		padding: 5,
	},
});

export default SecondaryScreen;
