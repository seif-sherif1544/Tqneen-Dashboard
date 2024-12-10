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
import {
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
  TextField
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import Image from 'next/image'
import { addIcon } from '@iconify/react'

// Define the validation schema
const validationSchema = Yup.object().shape({
  title: Yup.string().required('Service name must be a string'),
  duration: Yup.number()
    .typeError('Service duration is required')
    .min(1, 'Service duration must be greater than 0')
    .max(30, 'Service duration must be less than 30'),
  description: Yup.string().required('Service description is required'),
  image: Yup.mixed().required('Image is required'),

  // fees: Yup.number()
  //   .nullable()
  //   .transform(value => (value === '' ? null : value))
  //   .when('$type', {
  //     is: ['fixed'],
  //     then: schema => schema.required('Fees are required for a fixed service'),
  //     otherwise: schema => schema.nullable()
  //   })

  min: Yup.number().typeError('price is required')
})

addIcon('mdi:upload-box', {
  body: `

<path d="M2 19C2 20.7 3.3 22 5 22H19C20.7 22 22 20.7 22 19V11H2V19ZM19 4H17V3C17 2.4 16.6 2 16 2C15.4 2 15 2.4 15 3V4H9V3C9 2.4 8.6 2 8 2C7.4 2 7 2.4 7 3V4H5C3.3 4 2 5.3 2 7V9H22V7C22 5.3 20.7 4 19 4Z" fill="white"/>

`,
  width: 24,
  height: 24
})

const AddServices = ({ open, setOpenAdd, fetchData }) => {
  const fileInputRef = useRef(null)

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  const [imageFile, setImageFile] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState('')
  const [imageLoading, setImageLoading] = useState(false)
  const [value, setValue] = useState('fixed')

  const handleImageUpload = event => {
    const file = event.target.files[0]
    setImageFile(file)
  }

  const onClose = (event, reason) => {
    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
      // Set 'open' to false, however you would do that with your particular code.
      setOpenAdd(false)
    }
  }

  const handleChangeRatio = e => {
    setValue(e.target.value)
  }

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      title: '',

      // fees: '',
      min: '',
      max: '',
      duration: '',
      description: '',
      image: selectedFile
    },
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    context: { type: value }
  })
  useEffect(() => {
    reset({
      title: '',

      // fees: '',
      min: '',
      max: '',
      duration: '',
      description: '',
      image: ''
    })
  }, [value])

  async function uploadimage() {
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
      toast.error(error?.response?.data?.message)
      setImageLoading(false)
    }
  }
  useEffect(() => {
    uploadimage()
  }, [imageFile])

  const handleAddService = async subData => {
    try {
      const data = {
        title: subData.title,

        duration: subData.duration,
        description: subData.description,
        image: imageUrl,
        min: subData?.min
      }

      if (value === 'flexible') {
        if (subData?.max < subData?.min) {
          toast.error('max should be greather than min')

          return
        }
      }
      if (value === 'flexible') {
        data.max = subData?.max
      }

      const response = await axios.post(`${baseUrl}/api/services`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      // Handle the response as needed
      if (response?.status === 201) {
        // Close the add city dialog
        toast.success('Service Added successfully')
        handleAddClose()
        reset({
          title: '',

          // fees: '',
          min: '',
          max: '',
          duration: '',
          description: '',
          image: ''
        })
        fetchData()
        onClose()
        setImageUrl('')
      }
    } catch (error) {
      // Handle error
      console.error(error)

      toast.error(error?.response?.data?.message)
    }
  }

  const handleAddClose = () => {
    // Perform any necessary actions before closing the dialog
    onClose()
    reset({
      title: '',

      // fees: '',
      min: '',
      max: '',
      duration: '',
      description: '',
      image: ''
    })
    setSelectedFile('')
    setImageUrl('')
  }

  const handleChange = setter => event => {
    setter(event.target.value)
  }

  const data = [
    {
      name: 'ahmed'
    }
  ]

  const handleDeleteService = () => {
    onClose()
    reset({
      title: '',
      price: '',

      // fees: '',
      min: '',
      max: '',
      duration: '',
      description: '',
      image: ''
    })
    setSelectedFile('')
    setImageUrl('')
  }
  if (data) {
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
                Add Service
                <IconButton
                  size='large'
                  sx={{ color: 'text.secondary', padding: '0px' }}
                  onClick={() => handleDeleteService()}
                >
                  <Icon icon='ic:round-close' fontSize='2.5rem' color='#BA1F1F' />
                </IconButton>
              </DialogTitle>
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
                <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby='demo-form-control-label-placement'
                    name='position'
                    value={value}
                    sx={{
                      mb: '1rem',
                      gap: {
                        xs: '1rem',
                        sm: '2rem',
                        md: '4rem',
                        lg: '8rem'
                      }
                    }}
                    onChange={handleChangeRatio}
                  >
                    <FormControlLabel
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          color: value === 'fixed' ? '#1275BD' : '#000',
                          fontWeight: value === 'fixed' ? '700' : '400',
                          fontSize: '1.2rem'
                        }
                      }}
                      value='fixed'
                      control={<Radio />}
                      label='Fixed Service'
                    />
                    <FormControlLabel
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          color: value === 'flexible' ? '#1275BD' : '#000',
                          fontWeight: value === 'flexible' ? '700' : '400',
                          fontSize: '1.2rem'
                        }
                      }}
                      value='flexible'
                      control={<Radio />}
                      label='Flexible Service'
                    />
                  </RadioGroup>
                </FormControl>
                <form onSubmit={handleSubmit(handleAddService)}>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        name='title'
                        fullWidth
                        label='Service Name'
                        placeholder='enter service name'
                        {...register('title', { required: 'city name in english is required' })}
                        error={Boolean(errors.title)}
                        helperText={errors?.title?.message}
                        required

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
                        value={selectedFile}
                        placeholder='enter service image'
                        {...register('image', { required: 'service image is required' })}
                        error={!!errors.image}
                        helperText={errors?.image?.message}
                        required
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
                    {value === 'fixed' ? (
                      <Grid item xs={12} sm={6}>
                        <CustomTextField
                          name='min'
                          fullWidth
                          label='Price'
                          placeholder='enter price'
                          {...register('min', { required: 'service fees is required' })}
                          error={Boolean(errors.min)}
                          helperText={errors?.min?.message}

                          // value={cityNameEn}
                          // onChange={handleChange(setCityNameEn)}
                          // error={Boolean(errors.cityNameEn)} // Display error state
                          // helperText={errors.cityNameEn}
                        />
                      </Grid>
                    ) : (
                      <>
                        <Grid item xs={12} sm={3}>
                          <CustomTextField
                            name='min'
                            fullWidth
                            label='Price From'
                            placeholder='From'
                            {...register('min', { required: 'service fees is required' })}
                            error={Boolean(errors?.min)}
                            helperText={errors?.min?.message}

                            // value={cityNameEn}
                            // onChange={handleChange(setCityNameEn)}
                            // error={Boolean(errors.cityNameEn)} // Display error state
                            // helperText={errors.cityNameEn}
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <CustomTextField
                            name='max'
                            fullWidth
                            placeholder='To'
                            label='Price To'
                            type='number'
                            {...register('max', { required: 'service fees is required' })}
                            error={Boolean(errors?.max)}
                            helperText={errors?.max?.message}

                            // value={cityNameEn}
                            // onChange={handleChange(setCityNameEn)}
                            // error={Boolean(errors.cityNameEn)} // Display error state
                            // helperText={errors.cityNameEn}
                          />
                        </Grid>
                      </>
                    )}
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        name='duration'
                        fullWidth
                        label='Duration'
                        placeholder='enter duration'
                        {...register('duration', { required: 'service price is required' })}
                        error={!!errors.duration}
                        helperText={errors.duration?.message}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <CustomTextField
                        name='description'
                        label='Description'
                        placeholder='Enter Description'
                        {...register('description', { required: 'service description is required' })}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        sx={{
                          width: '100% !important'
                        }}
                        multiline
                        fullWidth={true}
                        rows={5}
                        maxRows={6}
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
                            {imageUrl && (
                              <Image
                                width={100}
                                height={100}
                                objectFit='cover'
                                src={imageUrl}
                                alt='specialization iamge'
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
              </DialogContent>
            </Dialog>
          </Card>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default AddServices
