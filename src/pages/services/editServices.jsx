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
import { addIcon } from '@iconify/react'

// Define the validation schema
const validationSchema = Yup.object().shape({
  title: Yup.string().optional().required('Service name must be a string'),
  fees: Yup.number()
    .optional()
    .required('Service fess must be a number')
    .min(1, 'Service price must be greater than 1'),
  duration: Yup.number()
    .optional()
    .required('Service duration must be a number')
    .min(1, 'Service duration must be greater than 1')
    .max(30, 'Service duration must be less than 30'),
  description: Yup.string().optional().required('Service name must be a string')
})

addIcon('mdi:upload-box', {
  body: `

<path d="M2 19C2 20.7 3.3 22 5 22H19C20.7 22 22 20.7 22 19V11H2V19ZM19 4H17V3C17 2.4 16.6 2 16 2C15.4 2 15 2.4 15 3V4H9V3C9 2.4 8.6 2 8 2C7.4 2 7 2.4 7 3V4H5C3.3 4 2 5.3 2 7V9H22V7C22 5.3 20.7 4 19 4Z" fill="white"/>

`,
  width: 24,
  height: 24
})

const EditServices = ({ open, setOpenEdit, editServiceId, fetchData }) => {
  const [serviceData, setServiceData] = useState({})
  const [imageFile, setImageFile] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [imageLoading, setImageLoading] = useState(false)

  const handleImageUpload = event => {
    const file = event.target.files[0]
    setImageFile(file)
  }

  const onClose = (event, reason) => {
    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
      // Set 'open' to false, however you would do that with your particular code.
      setOpenEdit(false)
    }
    setImageUrl('')
  }

  async function uploadImages() {
    // Upload the image and get the URL
    try {
      if (imageFile) {
        setImageLoading(true)
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
        setImageLoading(false)
      }
    } catch (error) {
      console.log(error?.message)
      toast.error(error?.message)
      setImageLoading(false)
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
      image: selectedFile
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
        setLoading(true)
        if (editServiceId !== '' && editServiceId !== undefined && editServiceId !== null) {
          const response = await axios.get(`${baseUrl}/api/services/${editServiceId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })

          setServiceData(response.data.data)
          reset({
            title: response?.data?.data?.title || '',
            fees: response?.data?.data?.fees || '',
            duration: response?.data?.data?.duration || '',
            description: response?.data?.data?.description || '',
            image: response?.data?.data?.image || ''
          })
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching city data:', error)
        toast.error(error?.message)
        setLoading(false)
      }
    }

    fetchCityData()
  }, [editServiceId, reset, selectedFile])

  const handleEditClose = async data => {
    try {
      if (editServiceId !== '' && editServiceId !== undefined && editServiceId !== null) {
        await axios.put(
          `${baseUrl}/api/services/${editServiceId}`,
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
        fetchData()
        toast.success('Service Updated Successfully')
        onClose()
      }
    } catch (error) {
      console.error('Error updating city:', error)
      toast.error(error?.message)
      setError(error?.message)
    }
  }

  const handleAddClose = () => {
    // Perform any necessary actions before closing the dialog
    onClose()
    reset({
      title: serviceData?.title,
      fees: serviceData?.fees,
      duration: serviceData?.duration,
      description: serviceData?.description,
      image: serviceData?.image
    })
    setSelectedFile('')
    setError('')
  }

  const handleChange = setter => event => {
    setter(event.target.value)
  }

  const handleDeleteService = () => {
    onClose()
    reset({
      title: serviceData?.title,
      fees: serviceData?.fees,
      duration: serviceData?.duration,
      description: serviceData?.description,
      image: serviceData?.image
    })
    setSelectedFile('')
    setError('')
  }
  if (serviceData) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <Dialog
              open={open}
              onClose={onClose}
              aria-labelledby='user-view-edit'
              aria-describedby='user-view-edit-description'
              sx={{
                '& .MuiPaper-root': {
                  width: '100%',
                  maxWidth: 694,
                  px: theme => [`${theme.spacing(4)} !important`, `${theme.spacing(6)} !important`],
                  py: theme => [`${theme.spacing(4)} !important`, `${theme.spacing(8)} !important`]
                }
              }}
            >
              <DialogTitle
                id='user-view-edit'
                sx={{
                  // textAlign: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '1.5rem !important',
                  paddingLeft: '0px',
                  color: '#000',
                  paddingBottom: '0.8rem',
                  borderBottom: '0.5px solid #646569',
                  paddingTop: '0rem'
                }}
              >
                Edit Service
                <IconButton
                  size='large'
                  sx={{ color: 'text.secondary', padding: '0px' }}
                  onClick={() => handleDeleteService()}
                >
                  <Icon icon='ic:round-close' fontSize='2.5rem' color='#BA1F1F' />
                </IconButton>
              </DialogTitle>
              {loading === false && serviceData?._id ? (
                <DialogContent
                  sx={{
                    paddingX: '1rem !important',
                    paddingTop: '1rem',
                    '& .MuiDialogContent-root': {
                      padding: '0rem !important',
                      paddingBottom: '0rem !important'
                    },
                    paddingBottom: '0rem !important'
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
                          defaultValue={serviceData?.title}
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
                          placeholder='enter service image'
                          defaultValue={selectedFile !== '' ? selectedFile : serviceData?.image}
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
                            paddingLeft: '0.7rem',
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
                          <Icon icon='mdi:upload-box' fontSize='1.5rem' style={{ color: 'white' }} fill='white' />
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
                          label='fees'
                          placeholder='enter fees'
                          defaultValue={serviceData?.fees}
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
                          placeholder='enter duration'
                          defaultValue={serviceData?.duration}
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
                          defaultValue={serviceData?.description}
                          sx={{
                            width: '100% !important'
                          }}
                          multiline
                          fullWidth={true}
                          rows={5}
                          maxRows={6}
                          {...register('description', { required: 'service description is required' })}
                          error={!!errors.description}
                          helperText={errors.description?.message}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{
                            width: '5rem',
                            height: '5rem'
                          }}
                        >
                          {imageLoading ? (
                            <span>
                              <CircularProgress size={25} />
                            </span>
                          ) : (
                            <>
                              {(imageUrl || serviceData?.image) && (
                                <Image
                                  width={100}
                                  height={100}
                                  objectFit='cover'
                                  src={imageUrl || serviceData?.image}
                                  alt='services iamge'
                                  style={{}}
                                />
                              )}
                            </>
                          )}
                        </Box>
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

                        mt: theme => [`${theme.spacing(4)} !important`, `${theme.spacing(7.5)} !important`],
                        '& .MuiDialogActions-root': {
                          paddingBottom: '0rem !important',
                          paddingRight: '0rem'
                        },
                        paddingBottom: '0rem !important',
                        paddingRight: '0rem'
                      }}
                    >
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
                        onClick={handleAddClose}
                      >
                        Cancel
                      </Button>
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
                          'OK'
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
    )
  } else {
    return null
  }
}

export default EditServices
