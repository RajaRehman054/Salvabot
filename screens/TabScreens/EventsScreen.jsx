import React, { useState, useContext, useCallback, useEffect } from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	StyleSheet,
	SafeAreaView,
	FlatList,
	TouchableWithoutFeedback,
	Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../../components/Loader';
import url from '../../utils/url';
import { AuthContext } from '../../auth/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

export default function EventScreen({ navigation }) {
	const [modalVisible, setModalVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState(null);
	const [selectedOption, setSelectedOption] = useState(null);
	const { user } = useContext(AuthContext);

	const options = [
		{
			label: 'Filtrar título botón similar',
			value: 'Filtrar título botón similar',
		},
	];

	const sortData = () => {
		if (
			selectedOption &&
			selectedOption.value === 'Filtrar título botón similar'
		) {
			setData(prevData =>
				prevData
					? prevData
							.slice()
							.sort((a, b) =>
								a.button.name.localeCompare(b.button.name)
							)
					: null
			);
		} else {
			getListOfButtons();
		}
	};

	useEffect(() => {
		sortData();
	}, [selectedOption]);

	const handleOptionPress = option => {
		setSelectedOption(option);
		setModalVisible(false);
	};

	const closeModal = () => {
		setModalVisible(false);
	};

	const getListOfButtons = async () => {
		setLoading(true);
		let headersList = {
			Authorization: `Token ${user.auth_token}`,
		};
		let response = await fetch(`${url}activity/api/list/`, {
			method: 'GET',
			headers: headersList,
		});
		const data = await response.json();
		setData(data);
		setLoading(false);
	};

	useFocusEffect(
		useCallback(() => {
			getListOfButtons();
		}, [])
	);

	if (loading) {
		return <Loader />;
	}

	const ListFooterComponent = () => (
		<SafeAreaView>
			<View style={styles.uppertab}>
				<TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
					<View style={styles.innertab}>
						{selectedOption ? (
							<Text style={styles.selectedOptionText}>
								{selectedOption.value}
							</Text>
						) : (
							<Text style={styles.placeholderText}>
								Filtrar por botones
							</Text>
						)}
						<Ionicons
							name='chevron-down-outline'
							size={20}
							color='#788190'
						/>
					</View>
				</TouchableWithoutFeedback>

				<Modal visible={modalVisible} transparent animationType='fade'>
					<TouchableWithoutFeedback onPress={closeModal}>
						<View style={styles.modalContainer}>
							<View style={styles.modal}>
								{options.map(option => (
									<TouchableOpacity
										key={option.value}
										style={styles.optionItem}
										onPress={() =>
											handleOptionPress(option)
										}>
										<Text style={styles.optionText}>
											{option.label}
										</Text>
									</TouchableOpacity>
								))}
							</View>
						</View>
					</TouchableWithoutFeedback>
				</Modal>
			</View>

			<View style={{ width: '90%', alignSelf: 'center' }}>
				<Text style={styles.text3}>Eventos</Text>
			</View>
			<FlatList
				style={styles.list1}
				data={data}
				renderItem={renderItem}
			/>
		</SafeAreaView>
	);

	const renderItem = ({ item }) => (
		<TouchableOpacity
			style={[styles.button11]}
			onPress={() => navigation.navigate('EventInfoScreen', { item })}>
			<View style={{ width: '5%' }}></View>
			<View style={{ width: '75%' }}>
				<View style={{flexDirection:'row'}}>
				<Text style={[{ ...styles.text12, fontSize: 10 }]}>
					{item.when.split('T')[0]}
				</Text>
				<Text style={[{ ...styles.text12, fontSize: 10, marginLeft: 10 }]}>
					{item.when.split('T')[1].split('.')[0]}
				</Text>
				</View>
				<Text
					style={[
						{ ...styles.text12, fontSize: 15, fontWeight: 'bold' },
					]}>
					{item.button.name}
				</Text>
				<Text style={[{ ...styles.text12, fontSize: 12 }]}>
					{item.full_caption}
				</Text>
			</View>
			<View style={{ width: '20%' }}>
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
			end={{ x: 1.5, y: 1 }}
			style={{ flex: 1 }}>
			<FlatList
				data={[]}
				renderItem={() => null}
				ListFooterComponent={ListFooterComponent}
			/>
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	uppertab: {
		height: 140,
		alignItems: 'center',
		justifyContent: 'center',
	},
	innertab: {
		elevation: 5,
		width: '90%',
		height: 60,
		borderRadius: 15,
		backgroundColor: '#F5F9FF',
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
		flexDirection: 'row',
		padding: 15,
	},
	text3: {
		fontWeight: 'bold',
		color: 'black',
		fontSize: 22,
		marginBottom: 20,
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
	button11: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'white',
		height: 100,
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

	selectedOptionText: {
		flex: 1,
		marginRight: 10,
		color: '#788190',
	},
	placeholderText: {
		flex: 1,
		color: '#788190',
	},

	optionItem: {
		paddingHorizontal: 20,
		paddingVertical: 10,
	},
	optionText: {
		fontSize: 16,
		color: '#788190',
	},
	modalContainer: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modal: {
		backgroundColor: '#fff',
		padding: 20,
		borderRadius: 10,
		width: '80%',
	},
});
