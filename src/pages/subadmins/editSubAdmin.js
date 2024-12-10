// ** React Imports
import { useState, useEffect } from 'react'
import axios from 'axios'
import CircularProgress from '@mui/material/CircularProgress'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import MenuItem from '@mui/material/MenuItem'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Custom Components
import CustomTextField from 'src/@core/components/mui/text-field'
import baseUrl from 'src/API/apiConfig'
import { Box } from '@mui/system'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup'

const updateSubValidation = Yup.object().shape({
  fist_name: Yup.string().optional().required("first name is required"),
  email: Yup.string().optional().email("invalid email format").required("email is required"),
  phone: Yup.number().optional().required("user phone is required"),
  is_active: Yup.boolean().optional().required("is active is required"),
  password: Yup.string().optional().required("password is required"),
})

const EditSubAdmin = ({ open, onClose, userID, fetchData }) => {
  // ** States
  const [userData, setUserData] = useState({})
  const [userFirstName, setUserFirstName] = useState()
  const [userPhone, setUserPhone] = useState()
  const [userMail, setMail] = useState()
  const [userStatus, setUerStatus] = useState()
  const [loading, setLoading] = useState(false)

  const {
    reset,
    control,
    setValue,
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },

  } = useForm({
    // defaultValues: { "city": 2 },
    mode: 'onChange',
    resolver: yupResolver(updateSubValidation)
  })


  const fetchUserData = async () => {

    try {
      if (userID !== "" && userID !== undefined && userID !== null) {
        setLoading(true)

        const response = await axios.get(`${baseUrl}/api/admin/users/${userID}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })


        setUserData(response.data)
        reset({
          fist_name: response?.data?.first_name,
          email: response?.data?.email,
          phone: response?.data?.phone,
          is_active: response?.data?.is_active,
          password: response?.data?.password
        })
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      reset()
      console.error('Error fetching user data:', error)
      toast.error(error?.response?.data?.message)

    }
  }

  useEffect(() => {
    fetchUserData()
  }, [userID])
  console.log(userData);

  const handleEditEdit = async (data) => {
    try {
      if (userID !== "" && userID !== undefined && userID !== null) {

        await axios.put(
          `${baseUrl}/api/admin/users/${userID}`,
          {
            first_name: data?.first_name,
            phone: data?.phone,
            email: data?.email,
            is_active: data?.is_active === 'true' ? 'active' : 'inActive'
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        onClose()
        toast.success("updated successfully");
        fetchData()
      }
    } catch (error) {
      console.error('Error updating city:', error);
      toast.error(error?.response?.data?.message)
    }
  }


  const handleEditClose = () => {

    onClose()
    reset();
  }

  // const { name, areas, is_active } = userData;

  return (
    <>
      {loading === true ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '20vh', width: '100%' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <Dialog
                open={open}
                onClose={onClose}
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
                  Edit user Information
                </DialogTitle>
                <DialogContent
                  sx={{
                    pb: theme => `${theme.spacing(8)} !important`,
                    px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
                  }}
                >
                  <form onSubmit={handleSubmit(handleEditEdit)}>
                    <Grid container spacing={6}>
                      <Grid item xs={12} sm={6}>
                        <CustomTextField
                          name='first_name'
                          defaultValue={userData?.first_name}
                          fullWidth
                          label='first name'
                          {...register('first_name', { required: 'first name is required' })}

                          error={Boolean(errors.first_name)}
                          helperText={errors?.first_name?.message}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <CustomTextField
                          name='phone'
                          defaultValue={userData?.phone}
                          fullWidth
                          label='phone'
                          rules={{
                            required: true,
                            pattern: {
                              value: /^0[0-9]{10}$/,
                              message: "Mobile number must be 11 digits and start with zero"
                            }
                          }}
                          {...register('phone', { required: 'phone is required' })}

                          error={Boolean(errors.phone)}
                          helperText={errors?.phone?.message}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <CustomTextField
                          rules={{ required: 'required' }}
                          defaultValue={userData?.email}
                          name='email'
                          fullWidth
                          label='email'
                          {...register('email', { required: 'email is required' })}

                          error={Boolean(errors.email)}
                          helperText={errors?.email?.message}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <CustomTextField
                          rules={{ required: 'required' }}
                          name='password'
                          fullWidth
                          label='password'
                          placeholder='password'
                          defaultValue={userData?.password}
                          {...register('password', { required: 'password is required' })}

                          error={Boolean(errors.password)}
                          helperText={errors?.password?.message}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <CustomTextField
                          name='is_active'
                          select
                          fullWidth
                          label='City Status'
                          {...register('is_active', { required: 'Activation is required' })}
                          defaultValue={userData?.is_active ? 'active' : 'notActive'}
                          error={Boolean(errors.is_active)}
                          helperText={errors?.is_active?.message}
                          required
                        >
                          <MenuItem value='true'>Active</MenuItem>
                          <MenuItem value='false'>Inactive</MenuItem>
                        </CustomTextField>
                      </Grid>
                    </Grid>
                    <DialogActions
                      sx={{
                        justifyContent: 'center',
                        px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                        pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`],
                        mt: theme => [`${theme.spacing(4)} !important`, `${theme.spacing(6)} !important`],

                      }}
                    >
                      <Button variant='contained' type="submit" sx={{
                        mr: 2, color: 'white', '&:hover': {
                          backgroundColor: '#1174bb',
                          color: '#fff'
                        }
                      }} disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <span>Saving...</span>
                            <span>
                              <CircularProgress size={20} />
                            </span>
                          </>
                        ) : 'Save'}
                      </Button>
                      <Button variant='tonal' type="button" color='secondary' onClick={handleEditClose}>
                        Cancel
                      </Button>
                    </DialogActions>
                  </form>
                </DialogContent>
              </Dialog>
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  )
}

export default EditSubAdmin
