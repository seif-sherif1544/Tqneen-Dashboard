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

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomTextField from 'src/@core/components/mui/text-field'


// ** Utils Import

import { CardMedia, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useAsync } from 'src/hooks/useAsync'
import axios from 'axios'
import baseUrl from 'src/API/apiConfig'



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


const LawyerView = () => {
  // ** States
  const router = useRouter()
  console.log("Sda", router.query.lawyerId);
  const [openEdit, setOpenEdit] = useState(false)
  const [areas, setAreas] = useState([]); // Add areas state

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true)
  const handleEditClose = () => setOpenEdit(false)

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTY1YTM1NjNhMjE2N2Q3NDUxNTRhZGEiLCJ0eXBlIjoiYWRtaW4iLCJpZCI6MSwiaWF0IjoxNzAxMTYwNDI1fQ.JruvwV_Xqa1-jTXFk1osKrpzNzMMUVKnAdyC4H5Ei_M'

  const {
    reset,
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },

  } = useForm({
    // defaultValues: { "city": 2 },
    mode: 'onChange',

  })

  const { data, loading, execute } = useAsync((lawyerId) => axios.get(`${baseUrl}/api/customer/lawyers/${lawyerId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }), { immediate: false })

  const { data: cities } = useAsync(() => axios.get(`${baseUrl}/api/cities`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }), { immediate: true })

  const { data: selectedCity, execute: fetchAreas } = useAsync((cityId) => axios.get(`${baseUrl}/api/cities/${cityId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }), { immediate: false })

  const { data: specializations } = useAsync(() => axios.get(`${baseUrl}/api/specializations`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }), { immediate: true })

  const { data: updatedlawyer, loading: isUpdatedLawyerLoading, execute: updateLawyer } = useAsync(({ lawyerId, lawyerData }) => {
    const { email, ...restOfData } = lawyerData;

    return axios.put(`${baseUrl}/api/admin/users/${lawyerId}`,
      {
        // email: email === null || email == "" ? " " : email,
        email: email,
        ...restOfData
      },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
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
    if (router.query.lawyerId) {
      try {
        await updateLawyer({
          lawyerId: router.query.lawyerId,
          lawyerData: data
        });
        handleEditClose();
      } catch (error) {
        if (error?.response.status === 409) {
          const errors = error.response.data.message

          // alert(errors)

          setError(errors)
          if (errors) {
            Object.keys(errors).forEach(key => {

              setError(key, { message: errors[key]?.[0] })
            })
          } else if (errorMessage?.includes("phone")) {
            setError("phone", { message: error.response.data.message })
          }
        }

      };
    }
  };
  useEffect(() => {
    if (router.query.lawyerId) {
      execute(router.query.lawyerId)
    }
  }, [updatedlawyer]);

  useEffect(() => {
    if (data && !loading && cities?.success) {
      setValue("specializations", data?.specializations?.map(specialization => specialization.id))

      setValue("city", data?.city?.id)
      console.log(data?.area?.city?.name?.en);
      setValue("area", data?.area?.id)
      setAreas(data?.area?.name?.en)
      setValue("is_active", data?.is_active)

    }
  }, [data])

  const handleCityChange = async (e) => {
    console.log("handleCityChange", e.target.value)
    const cityId = e.target.value;
    setValue("city", e.target.value);
    if (cityId) {
      const areas = await fetchAreas(cityId);
      console.log("area", areas); // Log the areas variable to check its structure
      setValue("area_id", "");
      setAreas(areas);
    } else {
      setValue("area_id", "");
      setAreas([]);
    }
  };
  console.log(data?.city?.name?.en);
  console.log("error", errors)
  if (data) {
    return (
      <Grid container spacing={12}>
        <Grid item xs={12} lg={6} >
          <Card>
            <CardContent sx={{ pt: 13.5, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              {data.avatar ? (
                <CustomAvatar
                  src={data.avatar}
                  variant='rounded'
                  alt={data.fullName}
                  sx={{ width: 100, height: 100, mb: 4 }}
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
              <Box sx={{ display: 'flex', textAlign: 'center' }}>
                <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary', textAlign: 'center' }}>Status:</Typography>
                <CustomChip
                  rounded
                  skin='light'
                  size='small'
                  label={data.is_active === true ? "active" : "not active"}
                  color={statusColors[data.is_active]}
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
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Email:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{data.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Fees :</Typography>
                  <Typography sx={{ color: 'text.secondary' }}> {data.fees}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Phone:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}> {data.phone}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Addres:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{data.address}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>City / Area  : </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{data?.area.city?.name?.en}  /  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}> {data?.area?.name?.en} </Typography>
                </Box>
              </Box>
            </CardContent>
            <CardContent>
              <Typography sx={{ color: 'text.secondary' }}> Specialization </Typography>
              <Box sx={{ mt: 2.5, mb: 4 }}>
                {data.specializations.map((specializations) => (
                  <Box
                    key={specializations.id}
                    sx={{ display: 'flex', mb: 2, alignItems: 'center', '& svg': { mr: 2, color: 'text.secondary' } }}
                  >
                    <Icon icon='tabler:point' fontSize='1.125rem' />
                    <Typography sx={{ color: 'text.secondary' }}>{specializations.name.en}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant='contained' sx={{ mr: 2 }} onClick={handleEditClickOpen}>
                Edit
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
                    name='phone'
                    defaultValue={data?.phone}
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
                          <MenuItem key={area.id} value={area.id}>
                            {area.name.en}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                    rules={{ required: true }}
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
                        {specializations.data.map((specialization) => (
                          <MenuItem key={specialization.id} value={specialization.id} selected>
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
                    rules={{ required: true }}
                    defaultValue={data?.gender?.toLowerCase()}
                    render={({ field: { value, onChange, ...rest } }) => (
                      <CustomTextField
                        select
                        fullWidth
                        sx={{ mb: 4 }}
                        label='gender'
                        id='validation-gender-select'
                        error={Boolean(errors.gender)}
                        aria-describedby='validation-gender-select'
                        {...(errors.gender && { helperText: errors.gender.message })}
                        defaultValue={data?.gender?.toLowerCase()}
                        SelectProps={{ value: value, onChange: e => onChange(e) }}
                        {...rest}
                      >
                        <MenuItem value=''>Select</MenuItem>
                        <MenuItem value='male'>Male</MenuItem>
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
                        <MenuItem value=''>status (online/offline) </MenuItem>
                        <MenuItem value='active'>online</MenuItem>
                        <MenuItem value='not active'>offline</MenuItem>
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
                        <MenuItem value=''>is active</MenuItem>
                        <MenuItem value='true'>True</MenuItem>
                        <MenuItem value='false'>False</MenuItem>
                      </CustomTextField>
                    )}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button type='submit' variant='contained' sx={{ mr: 3 }}>
                      Submit
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
            <CardContent ssx={{ pt: 13.5, display: 'flex', alignItems: 'center' }}>
              <Typography variant='body2' sx={{ color: 'text.disabled', fontSize: 18, mp: 8, textAlign: 'center', alignItems: 'center', textTransform: 'uppercase' }}>
                Personal Card  information Image
              </Typography>
              <Divider sx={{ my: 5, mx: 6 }} />
              <Card sx={{ width: 200 }}>
                <CardMedia component="img" sx={{ height: '80', pb: 4, textAlign: 'center' }} image={data?.idImages ? data?.idImages : '/images/cards/glass-house.png'} />
              </Card>
              <Divider sx={{ my: 5, mx: 6 }} />
              <Card sx={{ width: 200 }}>
                <CardMedia component="img" sx={{ height: '80', pb: 4, textAlign: 'center' }} image={data?.cardImages ? data.cardImages : ''} />
              </Card>
              <Divider sx={{ my: 5, mx: 6 }} />
              <Card sx={{ width: 200 }}>
                <CardMedia component="img" sx={{ height: '80', pb: 4, textAlign: 'center' }} image={data?.cardImages ? data.cardImages : ''} />
              </Card>
              <Divider sx={{ my: 5, mx: 6 }} />

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default LawyerView
