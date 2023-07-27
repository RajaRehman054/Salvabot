import { useState, useContext } from 'react';
import {
	StyleSheet,
	Image,
	View,
	Text,
	TouchableOpacity,
	ActivityIndicator,
	ScrollView,
	SafeAreaView,
	Linking,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { AuthContext } from '../../auth/AuthContext';
import messaging from '@react-native-firebase/messaging';

const ProfileScreen = ({ navigation }) => {
	const [loading, setLoading] = useState(false);
	const { logOut, userData, user } = useContext(AuthContext);

	const handleDialButtonPress = number => {
		Linking.openURL(`tel:${number}`);
	};

	const handleLogOut = async () => {
		messaging().deleteToken();
		logOut();
	};

	return (
		<LinearGradient
			colors={['#FCDD47', '#F9F8F8', '#F9F8F8', '#FCDD47']}
			locations={[0, 0.3, 0.7, 1]}
			start={{ x: -0.3, y: 0 }}
			end={{ x: 1.5, y: 1 }}
			style={{ flex: 1 }}>
			<ScrollView>
				<SafeAreaView>
					<View style={styles.mainview}>
						<View style={styles.imgview}>
							<Image
								source={require('../../assets/salvabot_logo.png')}
								style={styles.img}></Image>
							<Text style={styles.text}>Mi perfil</Text>
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
									Tipo de sangre:
								</Text>
							</View>
							<View style={{ width: '40%' }}>
								<Text style={styles.text13}>
									{userData.address_list &&
									userData.address_list.length > 0
										? userData.address_list[0].type
										: 'none'}
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

					<TouchableOpacity
						style={[styles.touchsign]}
						onPress={handleLogOut}>
						{loading ? (
							<ActivityIndicator size='small' color='#ffffff' />
						) : (
							<Text style={styles.textsign}>Cerrar sesión</Text>
						)}
					</TouchableOpacity>
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
	mainview: {
		padding: '3%',
	},
	imgview: {
		alignItems: 'center',
	},
	img: {
		height: 120,
		width: 120,
		marginTop: '5%',
		marginBottom: '5%',
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
		fontSize: 13,
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
	shadowbar: {
		elevation: 5,
		width: '90%',
		alignSelf: 'center',
		borderRadius: 12,
		backgroundColor: 'white',
		marginBottom: '5%',
		shadowColor: '#000000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
	},
});

export default ProfileScreen;
