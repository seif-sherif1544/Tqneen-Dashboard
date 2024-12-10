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

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
// ** Actions Imports
import axios from 'axios';
import { TextField } from '@mui/material'
import { boolean } from 'yup'
import baseUrl from 'src/API/apiConfig'

// const showErrors = (field, valueLen, min) => {
//   if (valueLen === 0) {
//     return `${field} field is required`
//   } else if (valueLen > 0 && valueLen < min) {
//     return `${field} must be at least ${min} characters`
//   } else {
//     return ''
//   }
// }

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))



const SidebarLawyer = props => {
  // ** Props
  const { open, toggle, fetchLawyerData } = props

  // ** State
  // ** Hooks
  const [cities, setCities] = useState([])
  const [areas, setAreas] = useState([]); // Add areas state
  const [specializations, setSpecializations] = useState([]);

  const {
    reset,
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },

  } = useForm({

    mode: 'onChange',

  })

  // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTY1YTM1NjNhMjE2N2Q3NDUxNTRhZGEiLCJ0eXBlIjoiYWRtaW4iLCJpZCI6MSwiaWF0IjoxNzAxNTk1OTc4fQ.m_FHMEoXEAhn6WE3TkroNyZIClCZLz-vuJaA2JMoHqs';
  const router = useRouter()




  // get cities data
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/cities`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
        });
        setCities(response.data.data);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    const fetchSpecializations = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/specializations`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        console.log(response)
        setSpecializations(response.data.data);

      } catch (error) {
        console.error('Error fetching Specializations:', error);
      }
    };

    fetchCities();
    fetchSpecializations();

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
      console.error('Error fetching areas:', error);

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
    const { numOfExperience, fees, is_active,...restOfData } = data

    try {
      const response = await axios.post(`${baseUrl}/api/admin/users?type=lawyer`, {
        type: "lawyer",
        numOfExperience: Number(numOfExperience),
        fees: Number(fees),
        is_active: boolean,
        cardImages: ["https://tqneen-rlyoguxn5a-uc.a.run.app/images/1698842921075.webp", "https://tqneen-rlyoguxn5a-uc.a.run.app/images/1698842921075.webp"],
        idImages: ["https://tqneen-rlyoguxn5a-uc.a.run.app/images/1698842921075.webp"],
        ...restOfData
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Handle the response based on your requirements
      if (response.status === 200) {
        // Handle success, show a notification, or redirect the user
        console.log('Lawyer added successfully');
        toggle()
        reset()
        fetchLawyerData()

      } else {
        // Handle the error or show a notification
        console.error('Failed to add lawyer');
      }
    } catch (error) {
      if (error?.response.status === 422) {
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
      console.error('An error occurred', error);
    }
  };
  const toggleSidebarLawyer = () => setAddUserOpen(!addUserOpen)


  console.log({ errors })

  const handleClose = () => {
    toggle()
    reset()
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
        <Typography variant='h5'>Add Lawyer</Typography>
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
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
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
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
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
            rules={{ required: false }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                type='email'
                label='Email'
                value={value}
                sx={{ mb: 4 }}
                onChange={onChange
                }

              />
            )}
          />
          <Controller
            name='address'
            control={control}
            rules={{ required: false }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
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
                <CustomTextField
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
              <CustomTextField
                select
                sx={{ mb: 4 }}
                fullWidth
                label="city"
                onChange={handleCityChange}
                {...rest}
                error={Boolean(errors.city)}
                aria-describedby='validation-area-select'
                {...(errors.city && { helperText: errors.city.message })}
              >
                <MenuItem value="" disabled>
                  Select an cities
                </MenuItem>
                {cities.map((city) => (
                  <MenuItem key={city.id} value={city.id}>
                    {city.name.en}
                  </MenuItem>
                ))}

              </CustomTextField>
            )}


          />

          <Controller
            name="area_id"
            control={control}
            rules={{ required: "required" }}
            defaultValue=""
            render={({ field }) => (
              <CustomTextField
                select
                sx={{ mb: 4 }}
                fullWidth
                label="area"
                {...field}
                id='validation-area-select'
                error={Boolean(errors.area_id)}
                aria-describedby='validation-area-select'
                {...(errors.area_id && { helperText: errors.area_id.message })}
              >
                <MenuItem value="" disabled>
                  Select an Area
                </MenuItem>
                {areas.map((area) => (
                  <MenuItem key={area.id} value={area.id}>
                    {area.name.en}
                  </MenuItem>
                ))}
              </CustomTextField>
            )}
          />


          <Controller
            name="specializations"
            control={control}
            render={({ field: { value, ...restFieldOptions } }) => (
              <TextField
                select
                value={value || []}
                SelectProps={{ multiple: true }}
                sx={{ mb: 4 }}
                fullWidth
                label="specializations"
                {...restFieldOptions}
              >
                <MenuItem value="" disabled>
                  Select an specializations
                </MenuItem>
                {specializations.map((specialization) => (
                  <MenuItem key={specialization.id} value={specialization.id}>
                    {specialization.name.en}
                  </MenuItem>
                ))}
              </TextField>
            )}
            rules={{ required: true }}
          />

          <Controller
            name='gender'
            control={control}
            rules={{ required: "required" }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
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
                <MenuItem value='Male'>Male</MenuItem>
                <MenuItem value='Female'>Female</MenuItem>
              </CustomTextField>
            )}
          />

          <Controller
            name='numOfExperience'
            control={control}
            rules={{
              required: true, pattern: {
                value: /^[0-9]+$/,
                message: 'Please enter a number',
              },
            }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='Years Of Experience '
                onChange={onChange}
                placeholder=''
                error={Boolean(errors.numOfExperience)}
                {...(errors.numOfExperience && { helperText: errors.numOfExperience.message })}
              />
            )}
          />
          <Controller
            name='password'
            control={control}
            rules={{ required: true }}
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
          <Controller
            name='fees'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='fees'
                onChange={onChange}
                placeholder=''
                error={Boolean(errors.fees)}
                {...(errors.fees && { helperText: errors.fees.message })}
              />

            )}
          />
          {/* <Controller
            name='status'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                select
                fullWidth
                sx={{ mb: 4 }}
                label='status'
                id='validation-status-select'
                error={Boolean(errors.status)}
                aria-describedby='validation-status-select'
                {...(errors.status && { helperText: errors.status.message })}
                SelectProps={{ value: value, onChange: e => onChange(e) }}
              >
                <MenuItem value=''>status</MenuItem>
                <MenuItem value='active'>active</MenuItem>
                <MenuItem value='not active'>not active</MenuItem>
              </CustomTextField>
            )}
          /> */}
          <Controller
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
                <MenuItem value=''> Select is active</MenuItem>
                <MenuItem value='true'>True</MenuItem>
                <MenuItem value='false'>False</MenuItem>
              </CustomTextField>
            )}
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button type='submit' variant='contained' sx={{ mr: 3 }} >
              Submit
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

export default SidebarLawyer
