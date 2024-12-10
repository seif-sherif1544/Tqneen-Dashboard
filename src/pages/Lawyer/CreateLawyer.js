// ** React Imports
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import baseUrl from 'src/API/apiConfig.js'

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
import { Autocomplete, CircularProgress, TextField } from '@mui/material'
import { boolean } from 'yup'
import FileUploaderMultiple from 'src/views/forms/form-elements/file-uploader/FileUploaderMultiple'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAsync } from 'src/hooks/useAsync';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const lawyerValidation = Yup.object().shape({
  first_name: Yup.string().matches(/^[\p{L}\s]+$/u, "special characters are not allowed").required('first_name is required'),
  last_name: Yup.string().matches(/^[\p{L}\s]+$/u, "special characters are not allowed").required('last_name is required'),
  title: Yup.string().matches(/^[\p{L}\s]+$/u, "special characters are not allowed").required('title is required'),
  email: Yup.string().email().required("email is required"),
  address: Yup.string().matches(/^[\p{L}\s]+$/u, "special characters are not allowed").required('address is required'),
  phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
  walletNumber: Yup.string().matches(phoneRegExp, 'wallet number is required'),
  city: Yup.string().required('city is required'),
  area_id: Yup.string().required("area id is required"),
  topics: Yup.array().of(Yup.number()).required("Topics are required"),
  specializations: Yup.array().of(Yup.string().required('Specialization is required')),
  gender: Yup.string().required("gender is required"),
  numOfExperience: Yup.number().required('number of experience is required'),
  password: Yup.string().min(6, "password length minimum is 6 characters").max(32, "password should be less than 32 characters").required("password is required"),
  fees: Yup.number().required('fess is required'),
  bio: Yup.string().required("bio is required"),
  is_active: Yup.boolean().required("is active is required"),
  avatar: Yup.mixed()
    .required("Avatar is required"), // Validation for avatar
  idImages: Yup.array()
    .of(Yup.string().url('Must be a valid URL')) // Assuming the IDs are URLs
    .required("ID images are required"), // Validation for ID images
  cardImages: Yup.array()
    .of(Yup.string().url('Must be a valid URL')) // Assuming the cards are URLs
    .required("Card images are required")
})

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



const SidebarLawyer = props => {
  // ** Props
  const { open, toggle, fetchLawyerData } = props

  // ** State
  // ** Hooks
  const [cities, setCities] = useState([])
  const [areas, setAreas] = useState([]); // Add areas state
  const [specializations, setSpecializations] = useState([]);
  const [files, setFiles] = useState([])
  const [filesAvatar, setFilesAvatar] = useState([])
  const [filesCard, setFilesCard] = useState([])



  const {
    reset,
    control,
    setValue,
    setError,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },

  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(lawyerValidation)
  })

  const router = useRouter()
  const returnUrl = router.query.returnUrl

  const fileUpload = async (file) => {

    const formData = new FormData();

    formData.append('image', file);

    return await axios.post('https://tqneen-prod-rlyoguxn5a-uc.a.run.app/images', formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,

      }
    })
  }

  const handleIdImageUpload = async (fieldName, files) => {
    const filesUrls = []

    for (const file of files) {
      try {
        const response = await fileUpload(file)
        filesUrls.push(response?.data?.url)
      } catch (e) { }
    }
    setValue(fieldName, filesUrls, { shouldValidate: true })

  }


  const handleAvatarImageUpload = async (fieldName, files) => {
    const filesUrls = [];
    try {
      for (const file of files) {
        const response = await fileUpload(file);
        filesUrls.push(String(response?.data?.url));
      }
      setValue(fieldName, filesUrls?.join(''), { shouldValidate: true });
    } catch (error) {
      console.error("Error handling avatar image upload:", error);
    }
  };

  const { data: TopicData, execute: fetchTopicData, status, loading: topicLoading, error: TopicError } = useAsync(() => axios.get(`${baseUrl}/api/topics`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }), { immediate: true })

  // get cities data
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/cities?limit=100000`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        setCities(response?.data?.data);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };


    // fetch specialziation
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/specializations?limit=100000`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });


        setSpecializations(response?.data?.data?.docs);

      } catch (error) {
        console.error('Error fetching Specializations:', error);
      }
    };

    fetchCities();
    fetchSpecializations();
    fetchTopicData();
  }, []);


  const fetchAreas = async (cityId) => {
    try {
      const response = await axios.get(`${baseUrl}/api/cities/` + cityId, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })

      // Assuming the areas API returns an array of areas for the specified cityId
      return response?.data?.data?.areas;

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

      setValue("area_id", "");
      setAreas(areas);
    } else {
      setValue("area_id", "");
      setAreas([]);
    }
  };

  const onSubmit = async (data) => {
    const { numOfExperience, fees, is_active, ...restOfData } = data
    try {
      const response = await axios.post(`${baseUrl}/api/admin/users?type=lawyer`, {
        type: "lawyer",
        numOfExperience: Number(numOfExperience),
        fees: Number(fees),
        is_active: boolean,
        idImages: restOfData.idImages,
        cardImages: restOfData.cardImages,
        ...restOfData
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 200) {
        console.log('Lawyer added successfully');
        toggle()
        reset({
          first_name: '',
          last_name: '',
          title: '',
          email: '',
          address: '',
          phone: '',
          walletNumber: '',
          city: '',
          area_id: '',
          specializations: '',
          gender: '',
          numOfExperience: '',
          password: '',
          fees: '',
          bio: '',
          is_active: '',
          avatar: '',
          idImages: '',
          cardImages: ''
        })
        setFiles([])
        setFilesAvatar([])
        setFilesCard([])
        fetchLawyerData()

      } else {

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
      console.error('An error occurred', error);
    }
  };
  const toggleSidebarLawyer = () => setAddUserOpen(!addUserOpen)

  const handleClose = () => {
    toggle()
    reset({
      first_name: '',
      last_name: '',
      title: '',
      email: '',
      address: '',
      phone: '',
      walletNumber: '',
      city: '',
      area_id: '',
      specializations: '',
      gender: '',
      numOfExperience: '',
      password: '',
      fees: '',
      bio: '',
      is_active: '',
      avatar: '',
      idImages: '',
      cardImages: ''
    })
    setFiles([])
    setFilesAvatar([])
    setFilesCard([])
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
              <TextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='First Name'
                onChange={onChange}
                placeholder=''
                error={Boolean(errors?.first_name)}
                {...(errors?.first_name && { helperText: errors?.first_name?.message })}
              />
            )}
          />
          <Controller
            name='last_name'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='Last Name'
                onChange={onChange}
                placeholder=''
                error={Boolean(errors?.last_name)}
                {...(errors?.last_name && { helperText: errors?.last_name?.message })}
              />
            )}
          />
          <Controller
            name='title'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='Title'
                onChange={onChange}
                placeholder=''
                error={Boolean(errors?.title)}
                {...(errors?.title && { helperText: errors?.title?.message })}
              />
            )}
          />
          <Controller
            name='email'
            control={control}
            rules={{ required: false }}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                type='email'
                label='Email'
                value={value}
                sx={{ mb: 4 }}
                onChange={onChange}
                error={Boolean(errors?.email)}
                helperText={errors?.email?.message}
                {...(errors?.email && { helperText: errors?.email?.message })}
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
                error={Boolean(errors?.address)}
                {...(errors?.address && { helperText: errors?.address?.message })}
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
                  error={Boolean(errors?.phone)}
                  helperText={errors?.phone?.message}
                  {...(errors?.phone && { helperText: errors?.phone?.message })}

                />
              </>
            )}
          />
          <Controller
            name='walletNumber'
            control={control}
            rules={{ required: true, pattern: { value: /^0[0-9]{10}$/, message: "mobile number must be 11 digits and start with zero" } }}
            render={({ field: { value, onChange } }) => (
              <>
                <TextField
                  fullWidth
                  value={value}
                  sx={{ mb: 4 }}
                  label='Wallet Number'
                  onChange={onChange}
                  placeholder=''
                  error={Boolean(errors?.walletNumber)}
                  helperText={errors?.walletNumber?.message}
                  {...(errors?.walletNumber && { helperText: errors?.walletNumber?.message })}

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
                error={Boolean(errors?.city)}
                aria-describedby='validation-area-select'
                {...(errors?.city && { helperText: errors?.city?.message })}
              >
                <MenuItem value="" disabled>
                  Select an cities
                </MenuItem>
                {cities.map((city) => (
                  <MenuItem key={city?.id} value={city?.id}>
                    {city?.name?.en}
                  </MenuItem>
                ))}

              </TextField>
            )}
          />
          <Controller
            name="area_id"
            control={control}
            rules={{ required: "required" }}
            defaultValue=""
            render={({ field }) => (
              <TextField
                select
                sx={{ mb: 4 }}
                fullWidth
                label="area"
                {...field}
                id='validation-area-select'
                error={Boolean(errors?.area_id)}
                aria-describedby='validation-area-select'
                {...(errors?.area_id && { helperText: errors?.area_id?.message })}
              >
                <MenuItem value="" disabled>
                  Select an Area
                </MenuItem>
                {areas.map((area) => (
                  <MenuItem key={area?.id} value={area?.id}>
                    {area?.name?.en}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="specializations"
            control={control}
            rules={{ required: "required" }}
            render={({ field: { value, ...restFieldOptions } }) => (
              <TextField
                select
                value={value || []}
                SelectProps={{ multiple: true }}
                sx={{ mb: 4 }}
                fullWidth
                label="specializations"
                {...(errors?.specializations && { helperText: errors?.specializations?.message })}
                error={Boolean(errors?.specializations)}

                {...restFieldOptions}
              >
                <MenuItem value="" disabled>
                  Select an specializations
                </MenuItem>
                {specializations?.map((specialization) => (
                  <MenuItem key={specialization?.id} value={specialization?.id}>
                    {specialization?.name?.en}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="topics"
            control={control}
            rules={{ required: "Required" }}
            render={({ field: { value, onChange }, fieldState }) => (
              <Autocomplete
                multiple
                options={TopicData?.data?.docs || []}
                getOptionLabel={(option) => option?.name?.ar || ""}
                onChange={(event, newValue) => {
                  // Handle change
                  onChange(newValue?.map((item) => item?.id)); // Store selected IDs
                }}
                value={value ? TopicData?.data?.docs?.filter(topic => value?.includes(topic?.id)) : []} // Set selected topics
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Topics"
                    sx={{ mb: 4 }}
                    fullWidth
                    error={Boolean(fieldState?.error)}
                    helperText={fieldState?.error?.message}
                  />
                )}
                renderOption={(props, option) => (
                  <MenuItem {...props} key={option.id}>
                    {option?.name?.ar}
                  </MenuItem>
                )}
              />
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
                error={Boolean(errors?.gender)}
                aria-describedby='validation-gender-select'
                {...(errors?.gender && { helperText: errors?.gender?.message })}
                SelectProps={{ value: value, onChange: e => onChange(e) }}
              >
                <MenuItem value=''>Select</MenuItem>
                <MenuItem value='male'>Male</MenuItem>
                <MenuItem value='female'>Female</MenuItem>
              </TextField>
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
              <TextField
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='Years Of Experience '
                onChange={onChange}
                placeholder=''
                error={Boolean(errors?.numOfExperience)}
                {...(errors?.numOfExperience && { helperText: errors?.numOfExperience?.message })}
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
                error={Boolean(errors?.password)}
                {...(errors?.password && { helperText: errors?.password?.message })}
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
                error={Boolean(errors?.fees)}
                {...(errors?.fees && { helperText: errors?.fees?.message })}
              />

            )}
          />
          <Controller

            name='bio'
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextField
                multiline
                fullWidth
                value={value}
                sx={{ mb: 4 }}
                label='your job Description '
                onChange={onChange}
                placeholder=''
                error={Boolean(errors?.bio)}
                {...(errors?.bio && { helperText: errors?.bio?.message })}
              />

            )}
          />
          <Controller
            name='is_active'
            control={control}
            rules={{ required: false }}
            render={({ field: { value, onChange } }) => (
              <TextField
                select
                fullWidth
                sx={{ mb: 4 }}
                label='is active'
                id='validation-is_active-select'
                error={Boolean(errors.is_active)}
                aria-describedby='validation-is_active-select'
                {...(errors?.is_active && { helperText: errors?.is_active?.message })}
                SelectProps={{ value: value, onChange: e => onChange(e) }}
              >
                <MenuItem value=''> Select is active</MenuItem>
                <MenuItem value='true'>True</MenuItem>
                <MenuItem value='false'>False</MenuItem>
              </TextField>
            )}
          />
          <Controller
            name='avatar'
            control={control}
            rules={{ required: "should be not empty" }}
            render={({ field: { name } }) =>
              <FileUploaderMultiple onUploadCallback={handleAvatarImageUpload} name={name} label={"avatar"}
                helperText={errors?.avatar?.message && errors?.avatar?.message}
                error={errors?.avatar?.message ? true : false} files={files} setFiles={setFiles} />
            }
          />
          <Controller
            name='idImages'
            control={control}
            rules={{ required: "should be not empty" }}
            render={({ field: { name } }) =>
              <FileUploaderMultiple onUploadCallback={handleIdImageUpload} name={name} label={"Id Images"}
                helperText={errors?.idImages?.message && errors?.idImages?.message}
                error={errors?.idImages?.message ? true : false} files={filesCard} setFiles={setFilesCard} />
            }
          />
          <Controller
            name='cardImages'
            control={control}
            rules={{ required: "should be not empty" }}
            render={({ field: { name } }) =>
              <FileUploaderMultiple onUploadCallback={handleIdImageUpload} name={name} label={"Card Images"}
                helperText={errors?.cardImages?.message && errors?.cardImages?.message}
                error={errors?.cardImages?.message ? true : false} files={filesAvatar} setFiles={setFilesAvatar} />
            }
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button type='submit' variant='contained' sx={{
              mr: 3, color: 'white', '&:hover': {
                backgroundColor: '#1174bb',
                color: 'white'
              }
            }} disabled={isSubmitting}>
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

export default SidebarLawyer
