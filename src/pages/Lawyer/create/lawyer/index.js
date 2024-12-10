// ** React Imports
// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import MenuItem from '@mui/material/MenuItem'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import CustomTextField from 'src/@core/components/mui/text-field'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { boolean } from 'yup'
import baseUrl from 'src/API/apiConfig'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import FileUploaderMultiple from 'src/views/forms/form-elements/file-uploader/FileUploaderMultiple'
import {
  Autocomplete,
  Box,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  TextareaAutosize,
  TextField,
  Typography
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import Image from 'next/image'
import { addIcon } from '@iconify/react'
import { useRouter } from 'next/router'
import { useAsync } from 'src/hooks/useAsync'
import Link from 'next/link'
import CreateLocations from 'src/pages/components/lawyer/createLawyers'


const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

// Define the validation schema




const lawyerValidation = Yup.object().shape({
  first_name: Yup.string()
    .matches(/^[\p{L}\s]+$/u, 'special characters are not allowed')
    .required('first_name is required'),
  last_name: Yup.string()
    .matches(/^[\p{L}\s]+$/u, 'special characters are not allowed')
    .required('last_name is required'),

  // title: Yup.string()
  //   .matches(/^[\p{L}\s]+$/u, 'special characters are not allowed')
  //   .required('title is required'),
  email: Yup.string().email().required('email is required'),
  address0: Yup.string()
    .matches(/^[\p{L}\s]+$/u, 'special characters are not allowed')
    .required('address is required'),
  phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
  walletNumber: Yup.string().matches(phoneRegExp, 'wallet number is required'),

  // city: Yup.string().required('city is required'),
  // area_id: Yup.string().required('area id is required'),
  topics: Yup.array().of(Yup.number()).required('Topics are required'),
  specializations: Yup.array().of(Yup.string().required('Specialization is required')),
  gender: Yup.string().required('gender is required'),
  numOfExperience: Yup.number().required('number of experience is required'),
  password: Yup.string()
    .min(6, 'password length minimum is 6 characters')
    .max(32, 'password should be less than 32 characters')
    .required('password is required'),
  fees: Yup.number().required('fess is required'),
  bio: Yup.string().required('bio is required'),
  is_active: Yup.boolean().required('is active is required'),

  // address0: Yup.string().required('address is required'),
  cities0: Yup.array()
    .of(Yup.number().required('City ID is required'))
    .min(1, 'At least one city must be selected')
    .required('Cities are required'),
  areas0: Yup.array()
    .of(Yup.number().required('Area ID is required'))
    .min(1, 'At least one area must be selected')
    .required('Areas are required'),

  // avatar: Yup.mixed().required('Avatar is required'), // Validation for avatar
  // idImages: Yup.array()
  //   .of(Yup.string().url('Must be a valid URL')) // Assuming the IDs are URLs
  //   .required('ID images are required'), // Validation for ID images
  // cardImages: Yup.array()
  //   .of(Yup.string().url('Must be a valid URL')) // Assuming the cards are URLs
  //   .required('Card images are required')
})


addIcon('mdi:upload-box', {
  body: `

<path d="M2 19C2 20.7 3.3 22 5 22H19C20.7 22 22 20.7 22 19V11H2V19ZM19 4H17V3C17 2.4 16.6 2 16 2C15.4 2 15 2.4 15 3V4H9V3C9 2.4 8.6 2 8 2C7.4 2 7 2.4 7 3V4H5C3.3 4 2 5.3 2 7V9H22V7C22 5.3 20.7 4 19 4Z" fill="white"/>

`,
  width: 24,
  height: 24
})

const CreateLawyersPage = () => {
  const [cities, setCities] = useState([])

  // const [areas, setAreas] = useState([])

  const [specializations, setSpecializations] = useState([])
  const [files, setFiles] = useState([])
  const [filesAvatar, setFilesAvatar] = useState([])
  const [filesCard, setFilesCard] = useState([])
  const [inputFields, setInputFields] = useState([{ id: Date.now() }])

  // const [selectedCityId, setSelectedCityId] = useState('')
  // const [areas, setAreas] = useState([]);
  // const [selectedAreas, setSelectedAreas] = useState([]);

  const [addresses, setAddresses] = useState([
    {
      address: '',
      city: '',
      area: '',
      optionalCities: [],
      optionalAreas: []
    }
  ]);



  const addNewAddress = () => {
    if (addresses.length < 2) {
      setAddresses(prevAddresses => [
        ...prevAddresses,
        {
          address: '',
          city: '',
          area: '',
          optionalCities: [],
          optionalAreas: []
        }
      ]);
    }
  };



  const removeAddress = (index) => {
    setAddresses((prevAddresses) => {
      const updatedAddresses = prevAddresses.filter((_, i) => i !== index);

      // Reset form values for removed index
      reset({
        ...getValues(), // Keep existing values
        [`address${index}`]: '',
        [`cities${index}`]: [],
        [`cities${index}`]: []
      });

      return updatedAddresses;
    });
  };

  const router = useRouter()

  const {
    reset,
    control,
    setValue,
    setError,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting }
  } = useForm({
    mode: 'onChange',

    resolver: yupResolver(lawyerValidation)
  })

  const returnUrl = router.query.returnUrl

  const onClose = (event, reason) => {
    router.push("/Lawyer");

  }



  const fileUpload = async file => {
    const formData = new FormData()

    formData.append('image', file)

    return await axios.post('https://tqneen-prod-rlyoguxn5a-uc.a.run.app/images', formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
  }

  const handleIdImageUpload = async (fieldName, files) => {
    const filesUrls = []

    for (const file of files) {
      try {
        const response = await fileUpload(file)
        filesUrls.push(response?.data?.signedUrl)
      } catch (e) { }
    }
    setValue(fieldName, filesUrls, { shouldValidate: true })
  }

  const handleAvatarImageUpload = async (fieldName, files) => {
    const filesUrls = []
    try {
      for (const file of files) {
        const response = await fileUpload(file)
        filesUrls.push(String(response?.data?.url))
      }
      setValue(fieldName, filesUrls?.join(''), { shouldValidate: true })
    } catch (error) {
      console.error('Error handling avatar image upload:', error)
    }
  }


  const {
    data: TopicData,
    execute: fetchTopicData,
    status,
    loading: topicLoading,
    error: TopicError
  } = useAsync(
    () =>
      axios.get(`${baseUrl}/api/topics`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
    { immediate: true }
  )


  // get cities data
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/cities?limit=100000`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

        setCities(response?.data?.data)
      } catch (error) {
        console.error('Error fetching cities:', error)
      }
    }

    // fetch specialziation
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/specializations?limit=100000`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

        setSpecializations(response?.data?.data?.docs)
      } catch (error) {
        console.error('Error fetching Specializations:', error)
      }
    }

    fetchCities()
    fetchSpecializations()
    fetchTopicData()
  }, [])



  // const handleCityChange = async (e, index) => {
  //   const cityId = e.target.value
  //   setValue(`city-${index}`, cityId)
  //   if (cityId) {
  //     const areas = await fetchAreas(cityId)

  //     setValue(`area_id${index}`, '')
  //     setAreas(areas)
  //   } else {
  //     setValue('area_id', '')
  //     setAreas([])
  //   }
  // }

  const onSubmit = async data => {
    const formattedAddresses = addresses?.map((_, index) => ({
      address: data[`address${index}`],
      cities: data[`cities${index}`] || [],
      areas: data[`areas${index}`] || []
    })).filter(addr => addr?.address || addr?.city || addr?.area_id);

    const sanitizedData = Object.keys(data)
      .filter(key => !key.startsWith('address') && !key.startsWith('area') && !key.startsWith('cities'))
      .reduce((acc, key) => {
        acc[key] = data[key];
        return acc;
      }, {});
    console.log("location ", formattedAddresses)
    console.log("all  ", sanitizedData)

    // const { numOfExperience, fees, is_active, ...restOfData } = data
    // try {
    //   const response = await axios.post(
    //     `${baseUrl}/api/admin/users?type=lawyer`,
    //     {
    //       type: 'lawyer',
    //       numOfExperience: Number(data?.numOfExperience),
    //       fees: Number(data?.fees),
    //       is_active: data?.is_active,
    //       idImages: data?.restOfData?.idImages,
    //       cardImages: data?.restOfData?.cardImages,
    //       locations: formattedAddresses,
    //       ...sanitizedData
    //     },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem('token')}`
    //       }
    //     }
    //   )

    //   if (response.status === 200) {

    //     reset({
    //       first_name: '',
    //       last_name: '',
    //       title: '',
    //       email: '',
    //       address: '',
    //       phone: '',
    //       walletNumber: '',

    //       // city: '',
    //       // area_id: '',
    //       specializations: '',
    //       gender: '',
    //       numOfExperience: '',
    //       password: '',
    //       fees: '',
    //       bio: '',
    //       is_active: '',
    //       avatar: '',
    //       idImages: '',
    //       cardImages: ''
    //     })
    //     setFiles([])
    //     setFilesAvatar([])
    //     setFilesCard([])
    //     fetchData()
    //   } else {
    //     console.error('Failed to add lawyer')
    //   }
    // } catch (error) {
    //   if (error?.response.status === 422) {
    //     const errors = error?.response?.data?.data?.errors
    //     if (errors) {
    //       Object.keys(errors).forEach(key => {
    //         setError(key, { message: errors[key]?.[0] })
    //       })
    //     }
    //   } else if (error?.response.status === 409) {
    //     const errorMessage = error?.response?.data?.message
    //     if (errorMessage?.includes('email')) {
    //       setError('email', { message: error?.response?.data?.message })
    //     } else if (errorMessage?.includes('phone')) {
    //       setError('phone', { message: error?.response?.data?.message })
    //     }
    //   }
    //   console.error('An error occurred', error)
    // }
  }
  const toggleSidebarLawyer = () => setAddUserOpen(!addUserOpen)

  const handleClose = () => {

    reset({
      first_name: '',
      last_name: '',
      title: '',
      email: '',
      address: '',
      phone: '',
      walletNumber: '',

      // city: '',
      // area_id: '',
      [`address${index}`]: '',
      [`cities${index}`]: [],
      [`cities${index}`]: [],

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
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card sx={{
          padding: "2rem"
        }}>
          <Typography sx={{
            color: "#000",
            py: "1rem",
            fontSize: '1.5rem',
            textAlign: 'center'
          }}>
            Create Lawyer
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Typography
                  sx={{
                    color: '#0D0E10'
                  }}
                >
                  FirstName
                </Typography>
                <Controller
                  name='first_name'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      value={value}
                      sx={{ mb: 1 }}

                      // label='First Name'
                      onChange={onChange}
                      placeholder=''
                      error={Boolean(errors?.first_name)}
                      {...(errors?.first_name && { helperText: errors?.first_name?.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Typography
                  sx={{
                    color: '#0D0E10'
                  }}
                >
                  LastName
                </Typography>
                <Controller
                  name='last_name'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      value={value}
                      sx={{ mb: 1 }}

                      // label='Last Name'
                      onChange={onChange}
                      placeholder=''
                      error={Boolean(errors?.last_name)}
                      {...(errors?.last_name && { helperText: errors?.last_name?.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Typography
                  sx={{
                    color: '#0D0E10'
                  }}
                >
                  Phone
                </Typography>
                <Controller
                  name='phone'
                  control={control}
                  rules={{
                    required: true,
                    pattern: {
                      value: /^0[0-9]{10}$/,
                      message: 'mobile number must be 11 digits and start with zero'
                    }
                  }}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <TextField
                        fullWidth
                        value={value}
                        sx={{ mb: 1 }}

                        // label='phone'
                        onChange={onChange}
                        placeholder=''
                        error={Boolean(errors?.phone)}
                        helperText={errors?.phone?.message}
                        {...(errors?.phone && { helperText: errors?.phone?.message })}
                      />
                    </>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Typography
                  sx={{
                    color: '#0D0E10'
                  }}
                >
                  Gender
                </Typography>
                <Controller
                  name='gender'
                  control={control}
                  rules={{ required: 'required' }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      select
                      fullWidth
                      sx={{ mb: 1 }}

                      // label='gender'
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
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Typography
                  sx={{
                    color: '#0D0E10'
                  }}
                >
                  Status
                </Typography>
                <Controller
                  name='is_active'
                  control={control}
                  rules={{ required: false }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      select
                      fullWidth
                      sx={{ mb: 1 }}

                      // label='status'
                      id='validation-is_active-select'
                      error={Boolean(errors.is_active)}
                      aria-describedby='validation-is_active-select'
                      {...(errors?.is_active && { helperText: errors?.is_active?.message })}
                      SelectProps={{ value: value, onChange: e => onChange(e) }}
                    >
                      <MenuItem value='true'>True</MenuItem>
                      <MenuItem value='false'>False</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Typography
                  sx={{
                    color: '#0D0E10'
                  }}
                >
                  Years Of Experience
                </Typography>
                <Controller
                  name='numOfExperience'
                  control={control}
                  rules={{
                    required: true,
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'Please enter a number'
                    }
                  }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      value={value}
                      sx={{ mb: 1 }}

                      // label='Years Of Experience '
                      onChange={onChange}
                      placeholder=''
                      error={Boolean(errors?.numOfExperience)}
                      {...(errors?.numOfExperience && { helperText: errors?.numOfExperience?.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Typography
                  sx={{
                    color: '#0D0E10'
                  }}
                >
                  Email
                </Typography>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: false }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      type='email'

                      // label='Email'
                      value={value}
                      sx={{ mb: 1 }}
                      onChange={onChange}
                      error={Boolean(errors?.email)}
                      helperText={errors?.email?.message}
                      {...(errors?.email && { helperText: errors?.email?.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Typography
                  sx={{
                    color: '#0D0E10'
                  }}
                >
                  Password
                </Typography>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      value={value}
                      sx={{ mb: 4 }}

                      // label='password'
                      onChange={onChange}
                      placeholder=''
                      error={Boolean(errors?.password)}
                      {...(errors?.password && { helperText: errors?.password?.message })}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Typography
                  sx={{
                    color: '#0D0E10'
                  }}
                >
                  Wallet Number
                </Typography>
                <Controller
                  name='walletNumber'
                  control={control}
                  rules={{
                    required: true,
                    pattern: {
                      value: /^0[0-9]{10}$/,
                      message: 'mobile number must be 11 digits and start with zero'
                    }
                  }}
                  render={({ field: { value, onChange } }) => (
                    <>
                      <TextField
                        fullWidth
                        value={value}
                        sx={{ mb: 1 }}

                        // label='Wallet Number'
                        onChange={onChange}
                        placeholder=''
                        error={Boolean(errors?.walletNumber)}
                        helperText={errors?.walletNumber?.message}
                        {...(errors?.walletNumber && { helperText: errors?.walletNumber?.message })}
                      />
                    </>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Typography
                  sx={{
                    color: '#0D0E10'
                  }}
                >
                  Fees
                </Typography>
                <Controller
                  name='fees'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      value={value}
                      sx={{ mb: 1 }}

                      // label='fees'
                      onChange={onChange}
                      placeholder=''
                      error={Boolean(errors?.fees)}
                      {...(errors?.fees && { helperText: errors?.fees?.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} >
                <Typography
                  sx={{
                    color: '#0D0E10'
                  }}
                >
                  Specializations
                </Typography>
                <Controller
                  name='specializations'
                  control={control}
                  rules={{ required: 'required' }}
                  render={({ field: { value, ...restFieldOptions } }) => (
                    <TextField
                      select
                      value={value || []}
                      SelectProps={{ multiple: true }}
                      sx={{ mb: 1 }}
                      fullWidth

                      // label='specializations'
                      {...(errors?.specializations && { helperText: errors?.specializations?.message })}
                      error={Boolean(errors?.specializations)}
                      {...restFieldOptions}
                    >
                      <MenuItem value='' disabled>
                        Select an specializations
                      </MenuItem>
                      {specializations?.map(specialization => (
                        <MenuItem key={specialization?.id} value={specialization?.id}>
                          {specialization?.name?.en}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Typography
                  sx={{
                    color: '#0D0E10'
                  }}
                >
                  Topics
                </Typography>
                <Controller
                  name='topics'
                  control={control}
                  rules={{ required: 'Required' }}
                  render={({ field: { value, onChange }, fieldState }) => (
                    <Autocomplete
                      multiple
                      options={TopicData?.data?.docs || []}
                      getOptionLabel={option => option?.name?.ar || ''}
                      onChange={(event, newValue) => {
                        // Handle change
                        onChange(newValue?.map(item => item?.id)) // Store selected IDs
                      }}
                      value={value ? TopicData?.data?.docs?.filter(topic => value?.includes(topic?.id)) : []} // Set selected topics
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Topics'
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
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Typography
                  sx={{
                    color: '#0D0E10'
                  }}
                >
                  Details
                </Typography>
                <Controller
                  name='bio'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      multiline
                      fullWidth
                      rows={4}
                      value={value}
                      sx={{ mb: 4 }}

                      // label='Details'
                      onChange={onChange}
                      placeholder=''
                      error={Boolean(errors?.bio)}
                      {...(errors?.bio && { helperText: errors?.bio?.message })}
                    />

                  )}
                />
              </Grid>

              {/* use here */}

              {addresses?.map((item, index) => {
                return (
                  <CreateLocations
                    index={index}
                    key={index}

                    cities={cities}
                    addNewAddress={addNewAddress}
                    removeAddress={removeAddress}
                    control={control}
                    errors={errors}
                    addresses={addresses}
                  />
                )
              })}

              <Grid item xs={12} sm={6} md={4} lg={4} sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '1rem'
              }}>
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
              </Grid>
              <Grid xs={12} sm={6} md={4} lg={4} sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '1rem'
              }}>
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

              </Grid>
              <Grid xs={12} sm={6} md={4} lg={4} sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '1rem'
              }}>
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
              </Grid>
            </Grid>

            <DialogActions
              sx={{
                justifyContent: 'flex-end',
                mt: theme => [`${theme.spacing(4)} !important`, `${theme.spacing(7.5)} !important`],
                '& .MuiDialogActions-root': {
                  paddingBottom: '0rem !important',
                  paddingRight: '0rem'
                },
                paddingBottom: '0rem !important',
                paddingRight: '0rem',
                gap: '1rem'
              }}

            >
              <Link href="/Lawyer">
                <Button
                  variant='outlined'
                  sx={{
                    color: '#0D0E10',
                    borderColor: '#DCDCDC',
                    py: theme => [`${theme.spacing(2)} !important`, `${theme.spacing(3)} !important`],
                    px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(7.5)} !important`],
                    '&:hover': {
                      color: '#0D0E10',
                      borderColor: '#DCDCDC'
                    }
                  }}
                  type='button'
                  onClick={handleClose}
                >
                  Cancel
                </Button></Link>
              <Button
                variant='contained'
                sx={{
                  border: '1px solid #1068A8',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: 400,
                  textAlign: 'center',
                  color: '#fff',
                  backgroundColor: '#1068A8',
                  py: theme => [`${theme.spacing(2)} !important`, `${theme.spacing(2.6)} !important`],
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(9)} !important`],
                  '&:hover': {
                    backgroundColor: '#1068A8',
                    color: '#fff'
                  }
                }}
                type='submit'

              // disabled={isSubmitting || !imageUrl}
              >
                {isSubmitting ? (
                  <>
                    <span>Applying...</span>
                    <span>
                      <CircularProgress size={20} />
                    </span>
                  </>
                ) : (
                  'Apply'
                )}
              </Button>
            </DialogActions>
          </form>

        </Card>
      </Grid>
    </Grid>
  )
}

export default CreateLawyersPage
