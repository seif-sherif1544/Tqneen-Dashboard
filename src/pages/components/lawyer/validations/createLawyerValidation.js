import * as Yup from 'yup';

const phoneRegExp = /^[0-9]{10}$/;

export const createAddressFieldsSchema = (addresses) => {
  return addresses.reduce((schema, _, index) => {
    // Only make first address required
    const isRequired = index === 0;

    return {
      ...schema,
      [`address${index}`]: isRequired
        ? Yup.string().required(`Address ${index + 1} is required`)
        : Yup.string(),
      [`city${index}`]: isRequired
        ? Yup.string().required(`City ${index + 1} is required`)
        : Yup.string(),
      [`area_id${index}`]: isRequired
        ? Yup.string().required(`Area ${index + 1} is required`)
        : Yup.string(),
      [`optionalCitites${index}`]: Yup.array()
        .of(Yup.string()),
      [`optionalAreas${index}`]: Yup.array()
        .of(Yup.string())
    };
  }, {});
};

const lawyerValidation = (addresses) => {
  return Yup.object().shape({
    first_name: Yup.string()
      .matches(/^[\p{L}\s]+$/u, 'Special characters are not allowed')
      .required('First name is required'),
    last_name: Yup.string()
      .matches(/^[\p{L}\s]+$/u, 'Special characters are not allowed')
      .required('Last name is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    phone: Yup.string()
      .matches(phoneRegExp, 'Phone number is not valid')
      .required('Phone number is required'),
    walletNumber: Yup.string()
      .matches(phoneRegExp, 'Wallet number is not valid')
      .required('Wallet number is required'),
    topics: Yup.array()
      .of(Yup.number())
      .required('Topics are required'),
    specializations: Yup.array()
      .of(Yup.string().required('Specialization is required'))
      .required('At least one specialization is required'),
    gender: Yup.string()
      .required('Gender is required'),
    numOfExperience: Yup.number()
      .required('Years of experience is required')
      .min(0, 'Experience years cannot be negative'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .max(32, 'Password must be less than 32 characters')
      .required('Password is required'),
    fees: Yup.number()
      .required('Fees are required')
      .min(0, 'Fees cannot be negative'),
    bio: Yup.string()
      .required('Bio is required'),
    is_active: Yup.boolean()
      .required('Active status is required'),
    ...createAddressFieldsSchema(addresses)
  });
};

export default lawyerValidation;
