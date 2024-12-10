// ** React Imports
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import * as Yup from 'yup';

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
// ** Actions Imports
import axios from 'axios';
import { CircularProgress, TextField } from '@mui/material'
import { boolean } from 'yup'
import baseUrl from 'src/API/apiConfig'
import { yupResolver } from '@hookform/resolvers/yup'

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const customerValidation = Yup.object().shape({
  first_name: Yup.string().matches(/^[\p{L}\s]+$/u, "special characters are not allowed").required('first_name is required'),
  last_name: Yup.string().matches(/^[\p{L}\s]+$/u, "special characters are not allowed").required('last_name is required'),
  email: Yup.string().email().required("email is required"),
  address: Yup.string().matches(/^[\p{L}\s]+$/u, "special characters are not allowed").required('address is required'),
  phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
  city: Yup.string().required('city is required'),
  area_id: Yup.string().required("area id is required"),
  gender: Yup.string().required("gender is required"),

  password: Yup.string().min(6, "password length minimum is 6 characters").max(32, "password should be less than 32 characters").required("password is required"),

});

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const AddCustomer = props => {
  // ** Props
  const { open, toggle, fetchLawyerData, GetCustomerData } = props

  // ** State
  // ** Hooks
  const [cities, setCities] = useState([])
  const [areas, setAreas] = useState([]); // Add areas state

  const {
    reset,
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(customerValidation)
  })


  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/cities`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCities(response.data.data);
      } catch (error) {

        setError(error);
      }
    };
    fetchCities();
  }, []);

  const fetchAreas = async (cityId) => {
    try {
      const response = await axios.get(`${baseUrl}/api/cities/` + cityId, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })

      // Assuming the areas API returns an array of areas for the specified cityId
      return response.data.data.areas;
    } catch (error) {

      setError(error);

      return [];

    }

  };

  const handleCityChange = async (e) => {
    const cityId = e.target.value;
    setValue("city", cityId);
    if (cityId) {
      const areas = await fetchAreas(cityId);
      console.log(areas); // Log the areas variable to check its structure
      setValue("area_id", "");
      setAreas(areas);
    } else {
      setValue("area_id", "");
      setAreas([]);
    }
  };

  const onSubmit = async (data) => {
    const { numOfExperience, is_active, fees, ...restOfData } = data
    try {
      const response = await axios.post(`${baseUrl}/api/admin/users`, {
        type: "customer",
        ...restOfData,
        is_active: boolean
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });

      // GetCustomerData()


      // Handle the response based on your requirements
      if (response.status === 200) {
        // Handle success, show a notification, or redirect the user
        console.log('customer added successfully');
        reset({
          first_name: "",
          last_name: "",
          email: "",
          gender: "",
          phone: "",
          password: "",
          address: "",
          area_id: "",
          city: ""
        })
        toggle()
        GetCustomerData()

      } else {
        // Handle the error or show a notification
        console.error('Failed to add lawyer');
      }
    } catch (error) {
      if (error?.response?.status === 422) {
        const errors = error?.response?.data?.data?.errors
        if (errors) {
          Object.keys(errors).forEach(key => {

            setError(key, { message: errors[key]?.[0] })
          })
        }
      } else if (error?.response.status === 409) {
        const errorMessage = error?.response?.data?.message
        if (errorMessage?.includes("email")) {
          setError("email", { message: error?.response?.data?.message })

        } else if (errorMessage?.includes("phone")) {
          setError("phone", { message: error?.response?.data?.message })
        }
      }

      // Handle the error or show a notification

    }
  };



  const handleClose = () => {
    toggle()
    reset({
      first_name: "",
      last_name: "",
      email: "",
      gender: "",
      phone: "",
      password: "",
      address: "",
      area_id: "",
      city: ""
    })
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h5'>Add Customer</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{
            p: '0.438rem',
            borderRadius: 1,
            color: 'text.primary',
            backgroundColor: 'action.selected',
            '&:hover': {
              backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
            }
          }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name='first_name'
            control={control}
            rules={{ required: "required" }} render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='First Name'
                onChange={onChange}
                placeholder=''
                error={Boolean(errors.first_name)}
                {...(errors.first_name && { helperText: errors.first_name.message })}
              />
            )}
          />
          <Controller
            name='last_name'
            control={control}
            rules={{ required: "required" }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='Last Name'
                onChange={onChange}
                placeholder=''
                error={Boolean(errors.last_name)}
                {...(errors.last_name && { helperText: errors.last_name.message })}
              />
            )}
          />
          <Controller
            name='email'
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                type='email'
                label='Email'
                value={value}
                sx={{ mb: 4 }}
                onChange={onChange}
                error={Boolean(errors.email)}
                placeholder=''
                {...(errors.email && { helperText: errors.email.message })}
              />
            )}
          />
          <Controller
            name='address'
            control={control}
            rules={{ required: false }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='address'
                onChange={onChange}
                placeholder=''
                error={Boolean(errors.address)}
                {...(errors.address && { helperText: errors.address.message })}
              />
            )}
          />
          <Controller
            name='phone'
            control={control}
            rules={{ required: true, pattern: { value: /^0[0-9]{10}$/, message: "mobile number must be 11 digits and start with zero" } }}
            render={({ field: { value, onChange } }) => (
              <>
                <TextField
                  fullWidth
                  value={value}
                  sx={{ mb: 4 }}
                  label='phone'
                  onChange={onChange}
                  placeholder=''
                  error={Boolean(errors.phone)}
                  helperText={errors.phone?.message}
                  {...(errors.phone && { helperText: errors.phone.message })}

                />
              </>
            )}
          />
          {/* .. City. */}
          <Controller
            name="city"
            control={control}
            rules={{ required: "required" }}
            defaultValue=""

            render={({ field: { onChange, ...rest } }) => (
              <TextField
                select
                sx={{ mb: 4 }}
                fullWidth
                label="city"
                onChange={handleCityChange}
                {...rest}
                helperText={errors?.city}
                error={Boolean(errors?.city?.message)}
                {...(errors.city && { helperText: errors?.city?.message })}
              >
                <MenuItem value="" disabled>
                  Select an cities
                </MenuItem>
                {cities.map((city) => (
                  <MenuItem key={city.id} value={city.id}>
                    {city.name.en}
                  </MenuItem>
                ))}
              </TextField>
            )}

          />

          <Controller
            name="area_id"
            rules={{ required: "required" }}
            control={control}
            defaultValue=""

            render={({ field }) => (
              <TextField
                select
                sx={{ mb: 4 }}
                fullWidth
                label="area"
                {...field}
                error={Boolean(errors.area_id)}
                helperText={errors.area_id && errors.area_id.message}
                {...field}
              >
                <MenuItem value="" disabled>
                  Select an Area
                </MenuItem>
                {areas.map((area) => (
                  <MenuItem key={area.id} value={area.id}>
                    {area.name.en}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name='gender'
            control={control}
            rules={{ required: "required" }}
            render={({ field: { value, onChange } }) => (
              <TextField
                select
                fullWidth
                sx={{ mb: 4 }}
                label='gender'
                id='validation-gender-select'
                error={Boolean(errors.gender)}
                aria-describedby='validation-gender-select'
                {...(errors.gender && { helperText: errors.gender.message })}
                SelectProps={{ value: value, onChange: e => onChange(e) }}
              >
                <MenuItem value=''>Select</MenuItem>
                <MenuItem value='male'>Male</MenuItem>
                <MenuItem value='female'>Female</MenuItem>
              </TextField>
            )}
          />

          <Controller
            name='password'
            control={control}
            rules={{ required: "required" }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='password'
                onChange={onChange}
                placeholder=''
                error={Boolean(errors.password)}
                {...(errors.password && { helperText: errors.password.message })}
              />

            )}
          />
          {/* <Controller
            name='is_active'
            control={control}
            rules={{ required: false }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                select
                fullWidth
                sx={{ mb: 4 }}
                label='is active'
                id='validation-is_active-select'
                error={Boolean(errors.is_active)}
                aria-describedby='validation-is_active-select'
                {...(errors.is_active && { helperText: errors.is_active.message })}
                SelectProps={{ value: value, onChange: e => onChange(e) }}
              >
                <MenuItem value=''>is active</MenuItem>
                <MenuItem value='true'>active</MenuItem>
                <MenuItem value='false'>not active</MenuItem>
              </CustomTextField>
            )}
          /> */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button type='submit' variant='contained' sx={{
              mr: 3, color: 'white', '&:hover': {
                backgroundColor: '#1174bb',
                color: 'white'
              }
            }} disabled={isSubmitting} >
              {isSubmitting ? (
                <>
                  <span>Submitting...</span>
                  <span>
                    <CircularProgress size={20} />
                  </span>
                </>
              ) : 'Submit'}
            </Button>
            <Button variant='tonal' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default AddCustomer
