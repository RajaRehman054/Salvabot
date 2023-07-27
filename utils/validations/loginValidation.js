import * as yup from 'yup';

const loginValidationSchema = yup.object().shape({
	username: yup
		.string()
		.required('Username is Required'),
	password: yup
		.string()
		.required('Password is required'),
});

export default loginValidationSchema;
