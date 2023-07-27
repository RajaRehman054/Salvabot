import { useState } from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const EventInfoScreen = ({ navigation, route }) => {
	const [userInfo, setUserInfo] = useState(route.params.item);
	console.log(userInfo);
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
									<Text style={styles.text}>
										{userInfo.button.name}
									</Text>
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

					<View style={styles.shadowbar}>
						<View style={[styles.button11]}>
							<View style={{ width: '40%' }}>
								<Text style={styles.text12}>
									Botón de pánico:
								</Text>
							</View>
							<View style={{ width: '40%' }}>
								<Text style={styles.text13}>
									{userInfo.button.name}
								</Text>
							</View>
						</View>
						<View style={[styles.button11]}>
							<View style={{ width: '40%' }}>
								<Text style={styles.text12}>
									Fecha de ocurrencia:
								</Text>
							</View>
							<View style={{ width: '40%' }}>
								<Text style={styles.text13}>
									{userInfo.when.split('T')[0]}
								</Text>
							</View>
						</View>
						<View style={[styles.button11]}>
							<View style={{ width: '40%' }}>
								<Text style={styles.text12}>Acción:</Text>
							</View>
							<View style={{ width: '40%' }}>
								<Text style={styles.text13}>
									{userInfo.action}
								</Text>
							</View>
						</View>
						<View style={[styles.button11]}>
							<View style={{ width: '40%' }}>
								<Text style={styles.text12}>Actor:</Text>
							</View>
							<View style={{ width: '40%' }}>
								<Text style={styles.text13}>
									{userInfo.by.caption}
								</Text>
							</View>
						</View>
					</View>

					<View style={styles.shadowbar}>
						<View style={[styles.button11, { height: 30 }]}>
							<View style={{ width: '40%' }}>
								<Text style={styles.text12}>
									Geolocalización
								</Text>
							</View>
							<View style={{ width: '40%' }}></View>
						</View>
						<TouchableOpacity
							style={[styles.button11, { height: 30 }]}
							onPress={() =>
								navigation.navigate('MapScreen', {
									itemId: `(${userInfo.geo_location.longitude}, ${userInfo.geo_location.latitude})`,
								})
							}
							disabled={
								userInfo.geo_location === null ? true : false
							}>
							<View style={{ width: '70%' }}>
								<Text style={styles.text14}>
									{userInfo.geo_location === null
										? 'Sin Dato'
										: 'Abrir mapa'}
								</Text>
							</View>
							<View style={{ width: '10%' }}>
								<Ionicons
									name='chevron-forward'
									color={
										userInfo.geo_location === null
											? 'transparent'
											: '#677294'
									}
									size={20}
									style={{ alignSelf: 'center' }}
								/>
							</View>
						</TouchableOpacity>
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

export default EventInfoScreen;
