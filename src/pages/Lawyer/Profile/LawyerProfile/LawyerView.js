// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import { useRouter } from 'next/router'
import * as Yup from 'yup';

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomTextField from 'src/@core/components/mui/text-field'


// ** Utils Import

import { Autocomplete, CardMedia, CircularProgress, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useAsync } from 'src/hooks/useAsync'
import axios from 'axios'
import baseUrl from 'src/API/apiConfig'
import FileUploaderMultiple from 'src/views/forms/form-elements/file-uploader/FileUploaderMultiple'
import FileUploaderSingle from 'src/views/forms/form-elements/file-uploader/FileUploaderSingle'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'
import DeleteModal from 'src/@core/components/DeleteModal'



const roleColors = {
  admin: 'error',
  editor: 'info',
  author: 'warning',
  maintainer: 'success',
  subscriber: 'primary'
}

const statusColors = {
  active: 'success',
  pending: 'warning',
  notactive: 'secondary'
}

const lawyerValidation = Yup.object().shape({
  first_name: Yup.string().optional().nullable().matches(/^[\p{L}\s]+$/u, "special characters are not allowed"),
  last_name: Yup.string().optional().nullable().matches(/^[\p{L}\s]+$/u, "special characters are not allowed"),
  title: Yup.string().optional().nullable().matches(/^[\p{L}\s]+$/u, "special characters are not allowed"),
  email: Yup.string().optional().nullable().email(),
  address: Yup.string().optional().nullable().matches(/^[\p{L}\s]+$/u, "special characters are not allowed"),
  phone: Yup.string().optional().nullable().matches(/^01\d{9}$/, 'Should be egyption number'),
  walletNumber: Yup.string().optional().nullable().matches(/^01\d{9}$/, 'Should be egyption number'),
  city: Yup.string().optional().nullable(),
  area_id: Yup.string().optional().nullable(),
  specializations: Yup.array().optional().nullable().of(Yup.string()),
  gender: Yup.string().optional().nullable(),
  topics: Yup.array().optional().nullable().of(Yup.number()).required("Topics are required"),
  numOfExperience: Yup.number().optional().nullable(),
  password: Yup.string().optional().nullable().min(6, "password length minimum is 6 characters").max(32, "password should be less than 32 characters"),
  fees: Yup.number().optional().nullable(),
  bio: Yup.string().optional().nullable(),
  is_active: Yup.boolean().optional().nullable(),
  avatar: Yup.mixed().optional().nullable()
  , // Validation for avatar
  idImages: Yup.array().optional().nullable()
    .of(Yup.string().url('Must be a valid URL')) // Assuming the IDs are URLs
  , // Validation for ID images
  cardImages: Yup.array().optional().nullable()
    .of(Yup.string().url('Must be a valid URL')) // Assuming the cards are URLs

})

const LawyerView = () => {
  // ** States
  const router = useRouter()

  const [openEdit, setOpenEdit] = useState(false)
  const [areas, setAreas] = useState([]); // Add areas state
  const [rotation, setRotation] = useState(0);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [lawyerId, setLawyerId] = useState('');
  const [errorDelete, setErrorDelete] = useState("");


  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true)
  const handleEditClose = () => setOpenEdit(false)

  const {
    reset,
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },

  } = useForm({
    // defaultValues: { "city": 2 },
    mode: 'onChange',
    resolver: yupResolver(lawyerValidation)
  })

  const { data, loading, execute } = useAsync((lawyerId) => axios.get(`${baseUrl}/api/customer/lawyers/${lawyerId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }), { immediate: false })



  const { data: TopicData, execute: fetchTopicData, status, loading: topicLoading, error: TopicError } = useAsync(() => axios.get(`${baseUrl}/api/topics?limit=1000000`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }), { immediate: true })


  const { data: cities } = useAsync(() => axios.get(`${baseUrl}/api/cities`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }), { immediate: true })

  const { data: selectedCity, execute: fetchAreas } = useAsync((cityId) => axios.get(`${baseUrl}/api/cities/` + cityId, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }), { immediate: false })

  const { data: specializations } = useAsync(() => axios.get(`${baseUrl}/api/specializations?limit=1000000`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }), { immediate: true })

  const { data: updatedlawyer, loading: isUpdatedLawyerLoading, execute: updateLawyer, error } = useAsync(({ lawyerId, lawyerData }) => {
    const { email, ...restOfData } = lawyerData;


    return axios.put(
      `${baseUrl}/api/admin/users/${lawyerId}`,
      {
        email: email === null || email == "" ? " " : email,
        ...restOfData
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }
    );
  }, { immediate: false });


  useEffect(() => {
    if (router.query.lawyerId) {
      execute(router.query.lawyerId)
    }
  }, [router]);


  useEffect(() => {
    if (data?.city?.id)
      fetchAreas(data.city.id)

  }, [data?.city?.id]);

  const onSubmit = async (data) => {

    if (router?.query?.lawyerId) {
      await updateLawyer({ lawyerId: router?.query?.lawyerId, lawyerData: data })
      toast.success('updated successfully')
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
      } else {
        setError("phone", { message: error?.response?.data?.message })

      }
    }

  }
  useEffect(() => {
    if (router?.query?.lawyerId) {
      execute(router?.query?.lawyerId)
      handleEditClose()

    }
  }, [updatedlawyer]);
  useEffect(() => {
    if (data && !loading) {
      setValue("specializations", data?.specializations?.map(specialization => specialization?.id))

      setValue("city", data?.city?.id)
      setValue("area", data?.area?.id)
      setAreas(data?.area?.name?.en)
      setValue("is_active", data?.is_active)
      setValue('topics', data?.topics?.map(topic => topic?.id));
    }
  }, [data])

  const handleCityChange = async (e) => {
    const cityId = e.target.value;

    // setValue("city", e.target.value);
    if (cityId) {
      const areas = await fetchAreas(cityId);
      setValue("area_id", "");
      setAreas(areas);
    } else {
      setValue("area_id", "");
      setAreas([]);
    }
  };

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
      setValue(fieldName, filesUrls.join(''), { shouldValidate: true });
    } catch (error) {
      console.error("Error handling avatar image upload:", error);
    }
  };


  const handleRotate = (direction, setRotationFunction) => {
    setRotationFunction((prevRotation) => (direction === 'left' ? prevRotation - 90 : prevRotation + 90));
  };



  const handleDelete = () => {
    if (lawyerId !== '' && lawyerId !== undefined && lawyerId !== null) {
      setDeleteLoading(true);
      axios.delete(`${baseUrl}/api/admin/users/${lawyerId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(response => {
          toast.success('User deleted successfully');
          setDeleteLoading(false);
          setOpenDelete(false);
          router.push('/Lawyer');

        })
        .catch(error => {
          // Handle any errors that occur during the request
          console.error('Failed to delete user', error);

          setErrorDelete(error?.response?.data?.message)
          setDeleteLoading(false);
        });
    }
  };

  if (data) {
    return (
      <>
        <Grid container spacing={12}>
          <Grid item xs={12} lg={6} >
            <Card>
              <CardContent sx={{ pt: 13.5, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                {data.avatar ? (
                  <CustomAvatar
                    src={data.avatar}
                    variant='rounded'
                    alt={data.fullName}
                    sx={{ width: 200, height: 300, mb: 2 }}
                  />
                ) : (
                  <CustomAvatar
                    skin='light'
                    variant='rounded'
                    color={data.avatarColor}
                    sx={{ width: 100, height: 100, mb: 4, fontSize: '3rem' }}
                  >
                    {data.fullName}
                  </CustomAvatar>
                )}
                <Typography variant='h4' sx={{ mb: 3 }}>
                  {data.full_name}
                </Typography>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ color: 'text.secondary' }}> {data?.title} </Typography>
                </Box>
                <Box sx={{ display: 'flex', textAlign: 'center' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary', textAlign: 'center' }}>Status:</Typography>
                  <CustomChip
                    rounded
                    skin='light'
                    size='small'
                    label={data?.is_active === true ? "active" : "not active"}
                    color={statusColors[data?.is_active]}
                    sx={{
                      textTransform: 'capitalize'
                    }}
                  />
                </Box>
              </CardContent>
              <Divider sx={{ my: '0 !important', mx: 6 }} />
              <CardContent sx={{ pb: 4 }}>
                <Typography variant='body2' sx={{ color: 'text.disabled', textAlign: 'center', textTransform: 'uppercase' }}>
                  Lawyer information  Details
                </Typography>
                <Box sx={{ pt: 4 }}>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Description :   </Typography>
                    <Typography sx={{ color: 'text.secondary' }}> {data?.bio} </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Email:</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{data?.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Gender:</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{data?.gender}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Fees :</Typography>
                    <Typography sx={{ color: 'text.secondary' }}> {data?.fees}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Phone:</Typography>
                    <Typography sx={{ color: 'text.secondary' }}> {data?.phone}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Wallet Number:</Typography>
                    <Typography sx={{ color: 'text.secondary' }}> {data?.walletNumber}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Addres:</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{data?.address}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Wallet Balance:</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{data?.walletBalance}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>City / Area  : </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{data?.area?.city?.name?.en}  /  </Typography>
                    <Typography sx={{ color: 'text.secondary' }}> {data?.area?.name?.en} </Typography>
                  </Box>
                </Box>

              </CardContent>

              <CardContent>
                <Typography sx={{ color: 'text.secondary' }}> Specialization </Typography>
                <Box sx={{ mt: 2.5, mb: 4 }}>
                  {data?.specializations?.docs?.map((specializations) => (
                    <Box
                      key={specializations?.id}
                      sx={{ display: 'flex', mb: 2, alignItems: 'center', '& svg': { mr: 2, color: 'text.secondary' } }}
                    >
                      <Icon icon='tabler:point' fontSize='1.125rem' />
                      <Typography sx={{ color: 'text.secondary' }}>{specializations?.name?.en}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
              <CardContent>
                <Typography sx={{ color: 'text.secondary' }}> Topics </Typography>
                <Box sx={{ mt: 2.5, mb: 4 }}>
                  {data?.topics?.map((topic) => (
                    <Box
                      key={topic?.id}
                      sx={{ display: 'flex', mb: 2, alignItems: 'center', '& svg': { mr: 2, color: 'text.secondary' } }}
                    >
                      <Icon icon='tabler:point' fontSize='1.125rem' />
                      <Typography sx={{ color: 'text.secondary' }}>{topic?.name?.en}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
              <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant='contained' sx={{
                  mr: 2, color: 'white', '&:hover': {
                    backgroundColor: '#1068A8',
                    color: 'white'
                  }
                }} onClick={handleEditClickOpen}>
                  Edit
                </Button>
                <Button variant='contained' color='error' sx={{ mr: 2 }} onClick={() => {
                  setOpenDelete(true)
                  setLawyerId(data?.id)
                }}>
                  Delete
                </Button>
              </CardActions>
              <Dialog
                open={openEdit}
                onClose={handleEditClose}
                aria-labelledby='user-view-edit'
                aria-describedby='user-view-edit-description'
                sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
              >
                <DialogTitle
                  id='user-view-edit'
                  sx={{
                    textAlign: 'center',
                    fontSize: '1.5rem !important',
                    px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                    pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                  }}
                >
                  Edit Lawyer Information
                </DialogTitle>
                <DialogContent
                  sx={{
                    pb: theme => `${theme.spacing(8)} !important`,
                    px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
                  }}
                >
                  <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
                    Updating Lawyer details will receive a privacy audit.
                  </DialogContentText>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                      name='first_name'
                      control={control}
                      rules={{ required: true }}
                      defaultValue={data?.first_name}
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
                      defaultValue={data?.last_name}
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
                      defaultValue={data?.email}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
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
                      defaultValue={data?.address}
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
                      name='walletBalance'
                      control={control}
                      defaultValue={data?.walletBalance}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          sx={{ mb: 4 }}
                          label='Wallet Balance'
                          onChange={onChange}
                          placeholder=''
                          error={Boolean(errors?.walletBalance)}
                          {...(errors?.walletBalance && { helperText: errors?.walletBalance?.message })}
                        />
                      )}
                    />
                    <Controller
                      name='phone'
                      control={control}
                      defaultValue={data?.phone}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          sx={{ mb: 4 }}
                          label='phone'
                          onChange={onChange}
                          placeholder=''
                          error={Boolean(errors.phone)}
                          {...(errors?.phone && { helperText: errors?.phone?.message })}
                        />
                      )}
                    />
                    <Controller
                      name='walletNumber'
                      control={control}
                      defaultValue={data?.walletNumber}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          sx={{ mb: 4 }}
                          label='walletNumber'
                          onChange={onChange}
                          placeholder=''
                          {...(errors?.walletNumber && { helperText: errors?.walletNumber?.message })}
                        />
                      )}
                    />
                    {/* .. City. */}
                    <Controller
                      name="city"
                      control={control}
                      defaultValue={data?.city?.toLowerCase()}
                      render={({ field: { onChange, ...rest } }) => (
                        <TextField
                          select
                          sx={{ mb: 4 }}
                          fullWidth
                          label={data?.area.city?.name?.en}
                          onChange={handleCityChange}
                          defaultValue={data?.city?.id}

                          {...rest}
                        >
                          <MenuItem value="" disabled>
                            Select an cities
                          </MenuItem>
                          {cities.data.map((city) => (
                            <MenuItem key={city.id} value={city.id}>
                              {city.name.en}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}

                    // rules={{ required: true }}

                    />
                    <Controller
                      name="area"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          select
                          sx={{ mb: 4 }}
                          fullWidth
                          label={data?.area.name?.en}
                          defaultValue={areas}
                          {...field}
                        >
                          <MenuItem value="" disabled>
                            Select an Area
                          </MenuItem>
                          {selectedCity?.data.areas.map((area) => (
                            <MenuItem key={area.id} value={area?.id}>
                              {area?.name?.en}
                            </MenuItem>
                          ))}

                        </TextField>
                      )}

                    />
                    <Controller
                      name="specializations"
                      control={control}
                      render={({ field: { value, ...restFieldOptions } }) => (
                        <TextField
                          select
                          value={value || []}
                          sx={{ mb: 4 }}
                          fullWidth
                          label="specializations"
                          SelectProps={{ multiple: true }}
                          {...restFieldOptions}
                        >
                          <MenuItem value="" disabled>
                            Select an specializations
                          </MenuItem>
                          {specializations?.data?.docs?.map((specialization) => (
                            <MenuItem key={specialization?.id} value={specialization?.id} selected>
                              {specialization?.name?.en}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                      rules={{ required: true }}
                    />
                    <Controller
                      name="topics"
                      control={control}
                      rules={{ required: "Required" }}
                      render={({ field: { value, onChange }, fieldState }) => {
                        console.log(value);

                        return (
                          <Autocomplete
                            multiple
                            options={TopicData?.data?.docs || []} // Assuming TopicData contains an array of topics
                            getOptionLabel={(option) => option?.name?.ar || ""}
                            onChange={(event, newValue) => {
                              // Handle change
                              onChange(newValue.map(topic => topic.id));
                            }}
                            value={value ? TopicData?.data?.docs.filter(topic => value.includes(topic.id)) : []}
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
                        )
                      }}
                    />

                    <Controller
                      name='gender'
                      control={control}
                      rules={{ required: true }}
                      defaultValue={data?.gender === "أنثي" ? "female" : data?.gender === "ذكر" ? "male" : data?.gender}
                      render={({ field: { value, onChange, ...rest } }) => (
                        <CustomTextField
                          select
                          fullWidth
                          sx={{ mb: 4 }}
                          label='gender'
                          id='validation-gender-select'
                          error={Boolean(errors.gender)}
                          aria-describedby='validation-gender-select'
                          {...(errors?.gender && { helperText: errors?.gender?.message })}
                          defaultValue={data?.gender?.toLowerCase()}
                          SelectProps={{ value: value, onChange: e => onChange(e) }}
                          {...rest}
                        >
                          <MenuItem value=''>Select</MenuItem>
                          <MenuItem value={'male'}>Male</MenuItem>
                          <MenuItem value='female'>Fmale</MenuItem>
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
                      defaultValue={data?.numOfExperience}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          sx={{ mb: 4 }}
                          label='numOfExperience'
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
                      rules={{ required: false }}
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
                      defaultValue={data?.fees}
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
                      name='title'
                      control={control}
                      rules={{ required: true }}
                      defaultValue={data?.title}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          fullWidth
                          value={value}
                          sx={{ mb: 4 }}
                          label='title'
                          onChange={onChange}
                          placeholder=''
                          error={Boolean(errors?.title)}
                          {...(errors?.title && { helperText: errors?.title?.message })}
                        />

                      )}
                    />
                    <Controller
                      name='bio'
                      control={control}
                      rules={{ required: true }}
                      defaultValue={data?.bio}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          multiline
                          fullWidth
                          value={value}
                          sx={{ mb: 4 }}
                          label='bio'
                          onChange={onChange}
                          placeholder=''
                          error={Boolean(errors?.bio)}
                          {...(errors?.title && { helperText: errors?.bio?.message })}
                        />

                      )}
                    />
                    <Controller
                      name='is_active'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          select
                          fullWidth
                          sx={{ mb: 4 }}
                          label='is active'
                          id='validation-is_active-select'
                          error={Boolean(errors?.is_active)}
                          aria-describedby='validation-is_active-select'
                          {...(errors?.is_active && { helperText: errors?.is_active?.message })}
                          SelectProps={{ value: value, onChange: e => onChange(e) }}
                        >
                          <MenuItem value=''>is active</MenuItem>
                          <MenuItem value='true'>True</MenuItem>
                          <MenuItem value='false'>False</MenuItem>
                        </CustomTextField>
                      )}
                    />
                    <Controller
                      name='avatar'

                      control={control}
                      render={({ field: { name } }) =>
                        <FileUploaderMultiple
                          defaultValues={[`${data?.avatar}` || '']}
                          onUploadCallback={handleAvatarImageUpload}
                          name={name} label={"Avatar Images"}
                          helperText={errors?.idImages?.message && errors?.idImages?.message}
                          error={errors?.idImages?.message ? true : false}

                        // helperText={errors?.avatar?.message && errors?.avatar?.message}
                        // error={errors?.avatar?.message ? true : false}
                        />
                      }
                    />
                    <Controller
                      name='idImages'
                      control={control}
                      defaultValue={data?.idImages}
                      render={({ field: { name } }) =>
                        <FileUploaderMultiple
                          defaultValues={data?.idImages}
                          onUploadCallback={handleIdImageUpload}
                          name={name} label={"Id Images"}
                          helperText={errors?.idImages?.message && errors?.idImages?.message}
                          error={errors?.idImages?.message ? true : false} />
                      }
                    />
                    <Controller
                      name='cardImages'
                      control={control}
                      defaultValue={data?.cardImages}
                      rules={{ required: "shoule be not empty" }}
                      render={({ field: { name } }) =>
                        <FileUploaderMultiple
                          defaultValues={data?.cardImages}
                          onUploadCallback={handleIdImageUpload}
                          name={name}
                          label={"Card Images"}
                          helperText={errors?.cardImages?.message && errors?.cardImages?.message}
                          error={errors?.cardImages?.message ? true : false} />
                      }
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Button type='submit' variant='contained' sx={{
                        mr: 3, color: 'white', '&:hover': {
                          backgroundColor: '#1174bb',
                          color: 'white'
                        }
                      }} disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                      </Button>
                      <Button variant='tonal' color='secondary' onClick={handleEditClose}>
                        Cancel
                      </Button>
                    </Box>
                  </form>
                </DialogContent>
              </Dialog>
            </Card>
          </Grid>
          {/* i,mage */}
          <Grid item xs={12} lg={6} >
            <Card>
              <CardContent sx={{ pt: 13.5, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <Typography variant='body2' sx={{ color: 'text.disabled', fontSize: 18, mp: 8, textAlign: 'center', alignItems: 'center', textTransform: 'uppercase' }}>
                  Personal Card Information Image
                </Typography>
                {[...(data?.cardImages ?? []), ...(data?.idImages ?? [])].map((cardImage, index) => {
                  return (
                    <>
                      <Divider sx={{ my: 5, mx: 6 }} />
                      <Card sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                        <CardMedia component="img" sx={{ width: '100%', height: '100%', objectFit: 'cover', transform: index === index ? `rotate(${rotation}deg)` : 'none' }} image={cardImage} />
                      </Card>

                    </>
                  );
                })}
                <div sx={{ pt: 13.5, display: 'flex', alignItems: 'center' }}>
                  <button onClick={() => handleRotate('left', setRotation)}>Rotate Left</button>
                  <button onClick={() => handleRotate('right', setRotation)}>Rotate Right</button>
                </div>

              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <DeleteModal isSubmitting={deleteLoading} open={openDelete} onClose={() => setOpenDelete(false)} title={'Delete Lawyer'} text={'Do you want to delete this lawyer'} handleDelete={handleDelete} errorDelete={errorDelete} />
      </>
    )
  } else {
    return (
      <Box sx={{
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: '100vh'
      }}>
        <CircularProgress size={40} />
      </Box>
    )
  }
}

export default LawyerView
