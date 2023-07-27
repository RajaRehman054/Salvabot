import React, { useEffect } from 'react';
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	PermissionsAndroid,
	Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

const MapScreen = ({ navigation, route }) => {
	const { itemId } = route.params;
	const regex = /-?\d+(\.\d+)?/g;
	const numbers = itemId.match(regex).map(Number);

	const region = {
		latitude: parseFloat(numbers[1]),
		longitude: parseFloat(numbers[0]),
		latitudeDelta: 0.02,
		longitudeDelta: 0.02,
	};

	useEffect(() => {
		requestLocationPermission();
	}, []);

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
							const { latitude, longitude } = position.coords;
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
						const { latitude, longitude } = position.coords;
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

	return (
		<View style={styles.container}>
			<View style={styles.uppertab}>
				<View style={styles.innertab}>
					<TouchableOpacity onPress={() => navigation.goBack()}>
						<Ionicons
							name='chevron-back'
							color={'black'}
							size={30}
						/>
					</TouchableOpacity>
					<View>
						<View style={styles.imgview}>
							<Text style={styles.text}>Geolocalización</Text>
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
			<View style={styles.map}>
				<MapView
					style={styles.mapView}
					initialRegion={region}
					showsUserLocation={true}
					userLocationAnnotationTitle='Mi Ubicación'
					zoomControlEnabled={true}>
					<Marker
						coordinate={{
							latitude: region.latitude,
							longitude: region.longitude,
						}}
					/>
				</MapView>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	map: {
		flex: 1,
	},
	mapView: {
		flex: 1,
	},
	uppertab: {
		height: 80,
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
});

export default MapScreen;
