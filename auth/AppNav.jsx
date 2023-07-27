import { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import Toast from 'react-native-toast-message';
import MainStack from './MainStack';
import { AuthContext } from './AuthContext';
import Loader from '../components/Loader';

const AppNav = () => {
	const { loading, user } = useContext(AuthContext);

	if (loading) {
		return <Loader />;
	}
	return (
		<>
			<NavigationContainer>
				{user !== null ? <MainStack /> : <AuthStack />}
			</NavigationContainer>
			<Toast />
			<Toast />
		</>
	);
};

export default AppNav;
