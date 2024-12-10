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

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const customerValidation = Yup.object().shape({
  first_name: Yup.string().optional().nullable().matches(/^[\p{L}\s]+$/u, "special characters are not allowed"),
  last_name: Yup.string().optional().nullable().matches(/^[\p{L}\s]+$/u, "special characters are not allowed"),
  email: Yup.string().optional().nullable().email(),
  address: Yup.string().optional().nullable().matches(/^[\p{L}\s]+$/u, "special characters are not allowed"),
  phone: Yup.string().optional().matches(phoneRegExp, 'Phone number is not valid'),

  city: Yup.string().optional().nullable(),
  area_id: Yup.string().optional().nullable(),
  gender: Yup.string().optional().nullable(),
  password: Yup.string().optional().nullable().min(6, "password length minimum is 6 characters").max(32, "password should be less than 32 characters"),

});

// ** Utils Import

import { CardMedia, CircularProgress, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useAsync } from 'src/hooks/useAsync'
import axios from 'axios'
import baseUrl from 'src/API/apiConfig'
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
  true: 'success',
  pending: 'warning',
  false: 'secondary'
}

const CustomerView = () => {
  // ** States
  const router = useRouter()

  const [openEdit, setOpenEdit] = useState(false)
  const [areas, setAreas] = useState([]); // Add areas state
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [customerId, setCustomerId] = useState('');

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
    resolver: yupResolver(customerValidation)

  })

  const { data, loading, execute } = useAsync((customerId) => axios.get(`${baseUrl}/api/customer/customers/${customerId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }), { immediate: false })

  const { data: cities } = useAsync(() => axios.get(`${baseUrl}/api/cities`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }), { immediate: true })

  const { data: selectedCity, execute: fetchAreas } = useAsync((cityId) => axios.get(`${baseUrl}/api/cities/${cityId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }), { immediate: false })

  const { data: updatedCustomer, loading: isupdatedCustomerLoading, execute: updateCustomer, error } = useAsync(({ customerId, lawyerData }) => {
    const { email, ...restOfData } = lawyerData;


    return axios.put(
      `${baseUrl}/api/admin/users/${customerId}`,
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
    if (router.query.customerId) {
      execute(router.query.customerId)
    }
  }, [router]);

  useEffect(() => {
    if (data?.city?.id)
      fetchAreas(data.city.id)

  }, [data?.city?.id]);

  const onSubmit = async (data) => {

    if (router.query.customerId) {
      await updateCustomer({ customerId: router.query.customerId, lawyerData: data })
      toast.success('updated successfully')
      handleEditClose();

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
      } else {
        setError("phone", { message: error?.response?.data?.message })

      }

    } else {
      handleEditClose()
    }

  }
  useEffect(() => {
    if (router.query.customerId) {
      execute(router.query.customerId)
    }
  }, [updatedCustomer]);

  useEffect(() => {
    if (data && !loading && cities?.success) {
      setValue("specializations", data?.specializations?.map(specialization => specialization.id))

      setValue("city", data?.city?.id)
      setValue("area", data?.area?.id)
      setAreas(data?.area?.name?.en)
      setValue("is_active", data?.is_active)

    }
  }, [data])

  const handleCityChange = async (e) => {
    const cityId = e.target.value;
    setValue("city", e.target.value);
    if (cityId) {
      const areas = await fetchAreas(cityId);
      setValue("area_id", "");
      setAreas(areas);
    } else {
      setValue("area_id", "");
      setAreas([]);
    }
  };

  const handleDeleteCustomer = () => {
    if (customerId !== '' && customerId !== null && customerId !== undefined) {

      setDeleteLoading(true);
      axios.delete(`${baseUrl}/api/admin/users/${customerId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(response => {
          toast.success('deleted successfully')
          console.log('User deleted successfully');
          router.push('/Customer');
          setDeleteLoading(false)
        })
        .catch(error => {
          // Handle any errors that occur during the request
          console.error('Failed to delete user', error);
          setDeleteLoading(false)
        });
    }
  }
  if (data) {
    return (
      <>
        <Grid container spacing={12}>
          <Grid item xs={12} lg={6} >
            <Card>
              <CardContent sx={{ pt: 13.5, display: 'flex', alignItems: 'center', flexDirection: 'column' }} >
                {data.avatar ? (
                  <CustomAvatar
                    src={data.avatar}
                    variant='rounded'
                    alt={data.full_name}
                    sx={{ width: 100, height: 100, mb: 4 }}
                  />
                ) : (
                  <CustomAvatar
                    skin='light'
                    variant='rounded'
                    color={data.avatarColor}
                    sx={{ width: 100, height: 100, mb: 4, fontSize: '3rem' }}
                  >
                    {data.full_name}
                  </CustomAvatar>
                )}
                <Typography variant='h4' sx={{ mb: 3 }}>
                  {data.full_name}
                </Typography>
                <CustomChip
                  rounded
                  skin='light'
                  size='small'
                  label={data.is_active ? "Active" : "Not Active"}
                  color={statusColors[data.is_active ? "active" : "notactive"]}

                  sx={{ textTransform: 'capitalize' }}
                />
              </CardContent>
              <Divider sx={{ my: '0 !important', mx: 6 }} />
              <CardContent sx={{ pb: 4, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }} >
                <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
                  Customer More  information
                </Typography>
                <Box sx={{ pt: 4 }}>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Username:</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{data.first_name}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>gender:</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{data?.gender}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>phone:</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{data?.phone}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>City / Area:</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{data?.area?.name?.en} / {data.area?.city?.name?.en}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 3 }}>
                    <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Customer Address:</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{data.address}</Typography>
                  </Box>
                </Box>
              </CardContent>
              <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant='contained' sx={{
                  mr: 2, color: 'white', '&:hover': {
                    backgroundColor: '#1174bb',
                    color: 'white'
                  }
                }} onClick={handleEditClickOpen}>
                  Edit
                </Button>
                <Button variant='contained' color='error' sx={{ mr: 2 }} onClick={() => {
                  setOpenDelete(true);
                  setCustomerId(data?.id)
                }}>
                  {deleteLoading ? 'Deleting...' : 'Delete'}
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
                  Edit customer Information
                </DialogTitle>
                <DialogContent
                  sx={{
                    pb: theme => `${theme.spacing(8)} !important`,
                    px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
                  }}
                >
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                      name='first_name'
                      control={control}
                      rules={{ required: true }}
                      defaultValue={data?.first_name}
                      render={({ field: { value, onChange } }) => (
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
                      rules={{ required: true }}
                      defaultValue={data?.last_name}
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
                      defaultValue={data?.email}
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
                      defaultValue={data?.address}
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
                      name='gender'
                      control={control}

                      render={({ field: { value, onChange } }) => (
                        <TextField
                          select
                          fullWidth
                          sx={{ mb: 4 }}
                          label='gender'
                          id='validation-gender-select'
                          error={Boolean(errors.gender)}
                          defaultValue={data?.gender}
                          value={data?.gender}
                          aria-describedby='validation-gender-select'
                          {...(errors.gender && { helperText: errors.gender.message })}
                          SelectProps={{ value: value, onChange: e => onChange(e) }}
                        >
                          <MenuItem value="">select gender</MenuItem>
                          <MenuItem value='male'>Male</MenuItem>
                          <MenuItem value='female'>Female</MenuItem>
                        </TextField>
                      )}
                    />
                    <Controller
                      name='phone'
                      control={control}
                      defaultValue={data?.phone || ''}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          fullWidth
                          value={value}
                          sx={{ mb: 4 }}
                          label='phone'
                          onChange={onChange}
                          placeholder=''
                          error={Boolean(errors.phone)}
                          helperText={errors?.phone?.message}
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
                      defaultValue={data?.area ? data.area.id : ''}
                      render={({ field }) => (
                        <TextField
                          select
                          sx={{ mb: 4 }}
                          fullWidth
                          label={data?.area.name?.en}
                          defaultValue={data?.area ? data.area.id : ''}
                          {...field}
                        >
                          <MenuItem value={data?.area.name?.en} disabled selected>
                            {data?.area.name?.en}
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
                      name='password'
                      control={control}
                      rules={{ required: false }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          fullWidth
                          value={value}
                          sx={{ mb: 4 }}
                          label='New password'
                          onChange={onChange}
                          placeholder=''
                          error={Boolean(errors.password)}
                          {...(errors.password && { helperText: errors.password.message })}
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
                          {...(errors.is_active && { helperText: errors.is_active.message })}
                          SelectProps={{ value: value, onChange: e => onChange(e) }}
                        >
                          <MenuItem value=''>is active</MenuItem>
                          <MenuItem value='true'>True</MenuItem>
                          <MenuItem value='false'>False</MenuItem>
                        </TextField>
                      )}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Button type='submit' variant='contained' sx={{
                        mr: 3, color: 'white', '&:hover': {
                          backgroundColor: '#1068A8',
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
                      <Button variant='tonal' color='secondary' onClick={handleEditClose}>
                        Cancel
                      </Button>
                    </Box>
                  </form>
                </DialogContent>
              </Dialog>
            </Card>
          </Grid>


        </Grid>
        <DeleteModal isSubmitting={deleteLoading} open={openDelete} onClose={() => setOpenDelete(false)} title={'Delete customer'} text={'Do you want to delete this customer'} handleDelete={handleDeleteCustomer} />
      </>
    )
  } else {
    return <Box sx={{
      display: "flex",
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      height: '100vh'
    }}>
      <CircularProgress size={40} />
    </Box>
  }
}

export default CustomerView
