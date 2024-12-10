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
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { boolean } from 'yup'
import baseUrl from 'src/API/apiConfig'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { CircularProgress, IconButton, InputAdornment, TextareaAutosize, TextField } from '@mui/material'
import Icon from 'src/@core/components/icon'
import Image from 'next/image'
import { Box } from '@mui/system'

// Define the validation schema
const validationSchema = Yup.object().shape({
  title: Yup.string().required('Service name must be a string'),
  fees: Yup.number().required('Service price must be a number').min(1, 'Service price must be greater than 1'),
  duration: Yup.number()
    .required('Service duration must be a number')
    .min(1, 'Service duration must be greater than 1')
    .max(30, 'Service duration must be less than 30'),
  description: Yup.string().required('Service description must be a string')
})

const EditRequestServices = ({ open, onClose, editServiceId, fetchData }) => {
  const [serviceData, setServiceData] = useState({})
  const [imageFile, setImageFile] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState('')
  const [error, setError] = useState('')

  const handleImageUpload = event => {
    const file = event.target.files[0]
    setImageFile(file)
  }

  async function uploadImages() {
    // Upload the image and get the URL
    if (imageFile) {
      const formData = new FormData()
      formData.append('image', imageFile)
      setSelectedFile(imageFile?.name)

      const response = await axios.post(`${baseUrl}/images`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      setImageUrl(response?.data?.signedUrl)
    }
  }
  useEffect(() => {
    uploadImages()
  }, [imageFile])

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      title: '',
      fees: '',
      duration: '',
      description: '',
      image: ''
    },
    mode: 'onChange',
    resolver: yupResolver(validationSchema)
  })
  const fileInputRef = useRef(null)

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        if (editServiceId !== '' && editServiceId !== undefined && editServiceId !== null) {
          const response = await axios.get(`${baseUrl}/api/userServices/${editServiceId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })

          setServiceData(response.data.userService)
          reset({
            title: response?.data?.userService?.service?.title || '',
            fees: response?.data?.userService?.service?.fees || '',
            duration: response?.data?.userService?.service?.duration || '',
            description: response?.data?.userService?.service?.description || '',
            image: response?.data?.userService?.service?.image || selectedFile
          })
        }
      } catch (error) {
        console.error('Error fetching city data:', error)
      }
    }

    fetchCityData()
  }, [editServiceId, reset])

  const handleEditClose = async data => {
    try {
      if (editServiceId !== '' && editServiceId !== undefined && editServiceId !== null) {
        await axios.put(
          `${baseUrl}/api/userServices/${editServiceId}`,
          {
            title: data.title,
            fees: data.fees,
            duration: data.duration,
            description: data.description,
            image: imageUrl === '' ? serviceData?.image : imageUrl
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        toast.success('updated successfully', {
          style: {
            zIndex: 999999999,
            order: 1
          }
        })
        fetchData()
        onClose()
      }
    } catch (error) {
      toast.error(error?.message)
      setError(error?.message)
      console.error('Error updating request service:', error)
    }
  }

  const handleAddClose = () => {
    // Perform any necessary actions before closing the dialog
    onClose()
    reset({
      title: '',
      price: '',
      duration: '',
      description: '',
      image: ''
    })
    setError('')
  }

  const handleChange = setter => event => {
    setter(event.target.value)
  }

  const handleDeleteCity = () => {
    onClose()
    setError('')
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <Dialog
              open={open}
              onClose={onClose}
              aria-labelledby='user-view-edit'
              aria-describedby='user-view-edit-description'
              sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 694 } }}
            >
              <DialogTitle
                id='user-view-edit'
                sx={{
                  // textAlign: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '1.5rem !important',
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(10)} !important`],
                  pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`],
                  pb: theme => [`${theme.spacing(4)} !important`, `${theme.spacing(4)} !important`],
                  borderBottom: '0.5px solid #646569',
                  color: '#000'
                }}
              >
                Edit Service
                <IconButton
                  size='large'
                  sx={{ color: 'text.secondary', padding: '0px' }}
                  onClick={() => handleDeleteCity()}
                >
                  <Icon icon='ic:round-close' fontSize='2.5rem' />
                </IconButton>
              </DialogTitle>
              {serviceData ? (
                <DialogContent
                  sx={{
                    pb: theme => `${theme.spacing(8)} !important`,
                    px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(10)} !important`]
                  }}
                >
                  <form onSubmit={handleSubmit(handleEditClose)}>
                    <Grid container spacing={6}>
                      <Grid item xs={12} sm={6}>
                        <CustomTextField
                          name='title'
                          fullWidth
                          label='Service Name'
                          placeholder='enter service name'
                          value={serviceData?.service?.title}
                          {...register('title', { required: 'service name is required' })}
                          error={Boolean(errors.title)}
                          helperText={errors?.title?.message}

                          // value={cityNameEn}
                          // onChange={handleChange(setCityNameEn)}
                          // error={Boolean(errors.cityNameEn)} // Display error state
                          // helperText={errors.cityNameEn}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} sx={{ position: 'relative', overflow: 'hidden' }}>
                        <CustomTextField
                          name='image'
                          fullWidth
                          label='Image'
                          value={serviceData?.service?.image}
                          placeholder='enter service image'
                          {...register('image', { required: 'service image is required' })}
                          error={!!errors.image}
                          helperText={errors.image?.message}

                          // InputProps={{
                          //   endAdornment: (
                          //     <InputAdornment position="start" sx={{backgroundColor:'red'}}>
                          //       <Icon icon='ic:round-close' />
                          //     </InputAdornment>
                          //   ),
                          // }}

                          // value={cityNameAr}
                          // onChange={handleChange(setCityNameAr)}
                          // error={Boolean(errors.cityNameAr)} // Display error state
                          // helperText={errors.cityNameAr}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            fontSize: '1.8rem',
                            paddingTop: '0.41rem',
                            paddingLeft: '0.5rem',
                            right: 0,
                            bottom: '0.5%',
                            backgroundColor: '#1068A880',
                            borderTopRightRadius: '4px',
                            borderBottomRightRadius: '4px',
                            cursor: 'pointer',
                            width: '48px'
                          }}
                          onClick={triggerFileUpload} // Trigger the file input click
                        >
                          <Icon
                            icon='fluent:image-20-filled'
                            fontSize='1.8rem'
                            style={{ color: 'white' }}
                            fill='white'
                          />
                          <input
                            type='file'
                            ref={fileInputRef}
                            onChange={handleImageUpload} // Handle file selection
                            style={{ display: 'none' }}
                            id='file-upload'
                          />
                          <label htmlFor='file-upload' style={{ display: 'block', height: '100%', width: '100%' }} />
                        </div>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <CustomTextField
                          name='fees'
                          fullWidth
                          label='Price'
                          value={serviceData?.service?.fees}
                          placeholder='enter price'
                          {...register('fees', { required: 'service fees is required' })}
                          error={Boolean(errors.fees)}
                          helperText={errors?.fees?.message}

                          // value={cityNameEn}
                          // onChange={handleChange(setCityNameEn)}
                          // error={Boolean(errors.cityNameEn)} // Display error state
                          // helperText={errors.cityNameEn}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <CustomTextField
                          name='duration'
                          fullWidth
                          label='Duration'
                          value={serviceData?.service?.duration}
                          placeholder='enter duration'
                          {...register('duration', { required: 'service duration is required' })}
                          error={!!errors.duration}
                          helperText={errors.duration?.message}

                          // value={cityNameAr}
                          // onChange={handleChange(setCityNameAr)}
                          // error={Boolean(errors.cityNameAr)} // Display error state
                          // helperText={errors.cityNameAr}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <CustomTextField
                          label='Description'
                          name='description'
                          placeholder='Enter Description'
                          sx={{
                            width: '100% !important'
                          }}
                          multiline
                          fullWidth={true}
                          value={serviceData?.service?.description}
                          rows={5}
                          maxRows={6}
                          {...register('description', { required: 'service description is required' })}
                          error={!!errors.description}
                          helperText={errors.description?.message}
                        />
                      </Grid>

                      {/* <Grid item xs={12} sm={12}>
                      <CustomTextField
                      name="is_active"
                        select
                        fullWidth
                        label='City Status'
                        value={cityStatus}
                        onChange={(event) => setCityStatus(event.target.value)}
                      >
                        <MenuItem value = 'true' >Active</MenuItem>
                        <MenuItem value= 'false' >Inactive</MenuItem>
                      </CustomTextField>
                    </Grid> */}
                    </Grid>
                    {error && <Box sx={{ color: 'red' }}>{error}</Box>}
                    <DialogActions
                      sx={{
                        justifyContent: 'flex-end',

                        // pl: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                        p: 0,

                        // pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`],
                        mt: theme => [`${theme.spacing(4)} !important`, `${theme.spacing(7)} !important`]
                      }}
                    >
                      <Button
                        variant='tonal'
                        sx={{
                          border: '1px solid #C81414',
                          borderRadius: '4px',
                          fontSize: '16px',
                          fontWeight: 400,
                          textAlign: 'center',
                          color: '#C81414',
                          backgroundColor: 'transparent',
                          px: theme => [`${theme.spacing(6)} !important`, `${theme.spacing(12.6)} !important`],
                          py: theme => [`${theme.spacing(2.3)} !important`, `${theme.spacing(3.3)} !important`]
                        }}
                        type='button'
                        onClick={handleAddClose}
                      >
                        Close
                      </Button>
                      <Button
                        variant='contained'
                        sx={{
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '18px',
                          fontWeight: 700,
                          textAlign: 'center',
                          color: '#fff',
                          backgroundColor: '#1068A8',
                          '&:hover': {
                            backgroundColor: '#1174bb'
                          },
                          px: theme => [`${theme.spacing(6)} !important`, `${theme.spacing(12.6)} !important`],
                          py: theme => [`${theme.spacing(2.3)} !important`, `${theme.spacing(3.3)} !important`]
                        }}
                        type='submit'
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span>Saving...</span>
                            <span>
                              <CircularProgress size={20} />
                            </span>
                          </>
                        ) : (
                          'Save'
                        )}
                      </Button>
                    </DialogActions>
                  </form>
                </DialogContent>
              ) : (
                <DialogContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingTop: '5rem',
                      paddingBottom: '5rem'
                    }}
                  >
                    <CircularProgress size={80} />
                  </Box>
                </DialogContent>
              )}
            </Dialog>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default EditRequestServices
