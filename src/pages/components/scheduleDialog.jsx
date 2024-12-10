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
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import { boolean } from 'yup'
import baseUrl from 'src/API/apiConfig'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Autocomplete,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextareaAutosize,
  TextField,
  Typography
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import Image from 'next/image'
import { addIcon } from '@iconify/react'
import { useAsync } from 'src/hooks/useAsync'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import CustomCityInput from './CustomCityInput'

// Define the validation schema

export const scheduleValidationSchema = Yup.object().shape({
  lawyerId: Yup.string().required('Lawyer selection is required'),
  type: Yup.string().oneOf(['offline', 'online'], 'Invalid schedule type').required('Schedule type is required'),
  fees: Yup.number().required('Fees are required').positive('Fees must be positive').min(1, 'Minimum fee is 1'),
  day: Yup.date().required('Date is required'),

  startTime: Yup.mixed().required('Start time is required'),
  endTime: Yup.mixed()
    .required('End time is required')
    .test('is-after-start', 'End time must be after start time', function (value) {
      const { startTime } = this.parent
      if (!startTime || !value) {
        return true
      }

      return value > startTime
    })

  // addressId: Yup.string().required('Address selection is required'),
})

addIcon('mdi:upload-box', {
  body: `

<path d="M2 19C2 20.7 3.3 22 5 22H19C20.7 22 22 20.7 22 19V11H2V19ZM19 4H17V3C17 2.4 16.6 2 16 2C15.4 2 15 2.4 15 3V4H9V3C9 2.4 8.6 2 8 2C7.4 2 7 2.4 7 3V4H5C3.3 4 2 5.3 2 7V9H22V7C22 5.3 20.7 4 19 4Z" fill="white"/>

`,
  width: 24,
  height: 24
})

const ScheduleDialog = ({ open, setOpenAdd, fetchData }) => {
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchQueryAddress, setSearchQueryAddress] = useState('')

  // const [searchCity, setSearchCity] = useState('')
  // const [searchArea, setSearchArea] = useState('')
  // const [cityId, setCityId] = useState('')
  const [inputFields, setInputFields] = useState([{ id: Date.now() }]) // State to hold input field data
  const [formValues, setFormValues] = useState({ cityIds: [], areaIds: [] }) // Combined state for cities and areas

  const handleAddField = () => {
    setInputFields([...inputFields, { id: Date.now() }]) // Add a new input field
  }

  const handleRemoveField = id => {
    setInputFields(inputFields?.filter(field => field?.id !== id))
    setFormValues(prev => {
      const indexToRemove = inputFields.findIndex(field => field?.id === id)
      const newCityIds = prev?.cityIds?.filter((_, index) => index !== indexToRemove)
      const newAreaIds = prev?.areaIds?.filter((_, index) => index !== indexToRemove)

      return { cityIds: newCityIds, areaIds: newAreaIds }
    })
  }

  const handleFieldChange = useCallback(
    (fieldId, newValue) => {
      setFormValues(prev => {
        const index = inputFields?.findIndex(field => field?.id === fieldId)
        const newCityIds = [...prev?.cityIds]
        const newAreaIds = [...prev?.areaIds]

        if (newValue.cityId !== undefined) {
          newCityIds[index] = newValue?.cityId
        }
        if (newValue.areaId !== undefined) {
          newAreaIds[index] = newValue?.areaId
        }

        return { cityIds: newCityIds, areaIds: newAreaIds }
      })
    },
    [inputFields]
  )

  const onClose = (event, reason) => {
    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
      // Set 'open' to false, however you would do that with your particular code.
      setOpenAdd(false)
    }
  }

  // const handleFieldChange = useCallback(
  //   newValue => {
  //     setFormValues(prev => ({
  //       ...prev,
  //       ...newValue // Merge new values into the existing object
  //     }))
  //   },
  //   [formValues]
  // )
  console.log('after ', formValues)

  const {
    data: lawyers,
    execute: fetchLawyerData,
    status,
    loading
  } = useAsync(
    () =>
      axios.get(`${baseUrl}/api/admin/users?type=lawyer&limit=10000`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
    { immediate: true }
  )

  const {
    data: cities,
    execute: fetchCitiesData,
    status: statusCity,
    loading: cityLoading
  } = useAsync(
    () =>
      axios.get(`${baseUrl}/api/cities?limit=10000`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
    { immediate: true }
  )

  useEffect(() => {
    fetchLawyerData()
    fetchCitiesData()
  }, [])

  const addresses = [
    {
      id: crypto?.randomUUID(),
      full_name: 'first'
    },
    {
      id: crypto?.randomUUID(),
      full_name: 'first'
    },
    {
      id: crypto?.randomUUID(),
      full_name: 'first'
    }
  ]

  const filteredLawyers = useMemo(() => {
    if (!lawyers) return []

    return lawyers.docs?.filter(lawyer => lawyer?.full_name?.toLowerCase()?.includes(searchQuery?.toLowerCase())) || []
  }, [lawyers, searchQuery])

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    mode: 'onChange'

    // resolver: yupResolver(scheduleValidationSchema)
  })

  const handleAddService = async subData => {
    try {
      const response = await axios.post(`${baseUrl}/api/consultation/schedule`, subData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      // Handle the response as needed
      if (response?.status === 201) {
        // Close the add city dialog
        toast.success('Schedule created successfully')
        handleAddClose()
        reset({
          lawyerId: '',
          fees: '',
          type: '',
          startTime: '',
          endTime: '',
          day: ''
        })
        fetchData()
        onClose()
      }
    } catch (error) {
      // Handle error
      console.error(error)
      setError(error?.message)

      toast.error(error?.response?.data?.message)
    }
  }

  const handleAddClose = () => {
    // Perform any necessary actions before closing the dialog
    onClose()
    reset({
      lawyerId: '',
      fees: '',
      type: '',
      startTime: '',
      endTime: '',
      day: ''
    })

    setError('')
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
      lawyerId: '',
      fees: '',
      type: '',
      startTime: '',
      endTime: '',
      day: ''
    })
  }

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
                maxWidth: 794,
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
                borderBottom: '0.5px solid #DEDEDE',
                paddingTop: '0rem'
              }}
            >
              Create Schedule
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
              <form onSubmit={handleSubmit(handleAddService)}>
                <Grid
                  container
                  spacing={2}
                  sx={{
                    border: '1px solid #D1D1D1',
                    borderRadius: '1rem',
                    padding: '1.5rem'
                  }}
                >
                  <Grid item xs={12}>
                    <Box>
                      <Typography
                        sx={{
                          color: '#A0A0A0',
                          fontSize: '1.125rem',
                          paddingBottom: '1.5rem'
                        }}
                      >
                        General Info
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name='lawyerId'
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          options={filteredLawyers?.map(lawyer => lawyer)}
                          getOptionLabel={option => option?.full_name}
                          onChange={(event, newValue) => {
                            if (newValue) {
                              field.onChange(newValue?.id)
                            }
                          }}
                          renderInput={params => (
                            <CustomTextField
                              {...params}
                              label='Lawyer'
                              placeholder='Search lawyer...'
                              error={!!errors?.lawyerId}
                              helperText={errors?.lawyerId?.message}
                              required
                              sx={{
                                backgroundColor: '#fff !important',
                                '& .Mui-selected': {
                                  backgroundColor: '#fff !important',
                                  paddingY: '1rem !important'
                                },
                                '&:hover .Mui-selected': {
                                  backgroundColor: '#fff !important'
                                },
                                '& .MuiAutocomplete-inputRoot.MuiInputBase-sizeSmall': {
                                  padding: '10px 0 !important' // Add padding to the input itself
                                }
                              }}
                            />
                          )}
                          renderOption={(props, option) => (
                            <li {...props} key={option.id}>
                              {option.full_name}
                            </li>
                          )}
                          inputValue={searchQuery}
                          onInputChange={(event, newInputValue) => {
                            setSearchQuery(newInputValue)
                          }}
                          noOptionsText='No lawyers found'
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <CustomTextField
                      name='type'
                      select
                      fullWidth
                      label='Schedule type'
                      {...register('type', { required: 'schedule type is required' })}
                      error={!!errors?.type}
                      helperText={errors?.type?.message}
                      required
                    >
                      <MenuItem value={'offline'}>offline</MenuItem>
                      <MenuItem value={'online'}>online</MenuItem>
                    </CustomTextField>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <CustomTextField
                      name='fees'
                      fullWidth
                      label='Price'
                      placeholder='Enter the price'
                      {...register('fees', { required: 'schedule fees is required' })}
                      error={Boolean(errors?.fees)}
                      helperText={errors?.fees?.message}
                      required

                      // value={cityNameEn}
                      // onChange={handleChange(setCityNameEn)}
                      // error={Boolean(errors.cityNameEn)} // Display error state
                      // helperText={errors.cityNameEn}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        borderBottom: '1px solid #D2D2D2',
                        paddingTop: '1rem'
                      }}
                    ></Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <Typography
                        sx={{
                          color: '#A0A0A0',
                          fontSize: '1.125rem',
                          paddingY: '1.5rem'
                        }}
                      >
                        Date& Time
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name='lawyerId'
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          options={filteredLawyers?.map(lawyer => lawyer)}
                          getOptionLabel={option => option?.full_name}
                          onChange={(event, newValue) => {
                            if (newValue) {
                              field.onChange(newValue?.id)
                            }
                          }}
                          renderInput={params => (
                            <CustomTextField
                              {...params}
                              label='Lawyer'
                              placeholder='Search lawyer...'
                              error={!!errors?.lawyerId}
                              helperText={errors?.lawyerId?.message}
                              required
                              sx={{
                                backgroundColor: '#fff !important',
                                '& .Mui-selected': {
                                  backgroundColor: '#fff !important',
                                  paddingY: '1rem !important'
                                },
                                '&:hover .Mui-selected': {
                                  backgroundColor: '#fff !important'
                                },
                                '& .MuiAutocomplete-inputRoot.MuiInputBase-sizeSmall': {
                                  padding: '10px 0 !important' // Add padding to the input itself
                                }
                              }}
                            />
                          )}
                          renderOption={(props, option) => (
                            <li {...props} key={option.id}>
                              {option?.full_name}
                            </li>
                          )}
                          inputValue={searchQuery}
                          onInputChange={(event, newInputValue) => {
                            setSearchQuery(newInputValue)
                          }}
                          noOptionsText='No lawyers found'
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  {/* <Grid item xs={12} sm={4}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <Typography
                        variant='subtitle1'
                        gutterBottom
                        sx={{
                          marginBottom: '0rem !important'
                        }}
                      >
                        Day
                      </Typography>
                      <Controller
                        name='day'
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <DatePicker
                            {...field}
                            renderInput={params => (
                              <TextField
                                {...params}
                                fullWidth
                                label='Day'
                                error={!!errors.day}
                                helperText={errors.day?.message}
                                required
                              />
                            )}
                            onChange={date => field.onChange(date)}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid> */}
                  <Grid item xs={12} sm={4}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Controller
                        name='startTime'
                        control={control}
                        defaultValue={''} // Default value
                        render={({ field }) => (
                          <TimePicker
                            label='Start Time'
                            {...field}
                            onChange={newValue => {
                              // Format the date using dayjs
                              // Handle both valid TimePicker selections and keyboard inputs
                              if (newValue) {
                                // Try to format as ISO string
                                try {
                                  const formattedTime = dayjs(newValue)?.toISOString()
                                  field.onChange(newValue?.format('YYYY-MM-DDTHH:mm:ss'))
                                } catch (error) {
                                  // If formatting fails, just set the raw value
                                  field.onChange(newValue)
                                }
                              } else {
                                field.onChange(null) // Handle case when no time is selected
                              }
                            }} // Update value on change
                            renderInput={params => (
                              <CustomTextField
                                {...params}
                                error={Boolean(errors?.startTime)}
                                helperText={errors?.startTime?.message}
                                required
                              />
                            )}
                          />
                        )}
                        rules={{ required: 'service time is required' }} // Validation rule
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Controller
                        name='endTime'
                        control={control}
                        defaultValue={''} // Default value
                        render={({ field }) => (
                          <TimePicker
                            label='End Time'
                            {...field}
                            onChange={newValue => {
                              // Handle both valid TimePicker selections and keyboard inputs
                              if (newValue) {
                                // Try to format as ISO string
                                try {
                                  const formattedTime = dayjs(newValue)?.toISOString()
                                  field.onChange(newValue?.format('YYYY-MM-DDTHH:mm:ss'))
                                } catch (error) {
                                  // If formatting fails, just set the raw value
                                  field.onChange(newValue)
                                }
                              } else {
                                field.onChange(null) // Handle case when no time is selected
                              }
                            }}
                            renderInput={params => (
                              <CustomTextField
                                {...params}
                                error={Boolean(errors?.endTime)}
                                helperText={errors?.endTime?.message}
                                required
                              />
                            )}
                          />
                        )}
                        rules={{ required: 'service time is required' }} // Validation rule
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        borderBottom: '1px solid #D2D2D2',
                        paddingTop: '1rem'
                      }}
                    ></Box>
                  </Grid>
                  {/* <Grid item xs={12}>
                    <Box>
                      <Typography
                        sx={{
                          color: '#A0A0A0',
                          fontSize: '1.125rem',
                          paddingBottom: '1.5rem'
                        }}
                      >
                        Location
                      </Typography>
                    </Box>
                  </Grid> */}

                  {/* {inputFields?.map((field, index) => {
                    const isFirst = index === 0

                    return (
                      <React.Fragment key={index}>
                        {isFirst ? (
                          <>
                            <Grid
                              item
                              xs={12}
                              sm={4}
                              sx={{
                                marginTop: '0.5rem'
                              }}
                            >
                              <Controller
                                name='addressId'
                                control={control}
                                render={({ field }) => (
                                  <Autocomplete
                                    options={addresses?.map(address => address)}
                                    getOptionLabel={option => option?.full_name}
                                    onChange={(event, newValue) => {
                                      if (newValue) {
                                        // handleFieldChange(field?.id, 'addressId', newValue?.id)
                                        field.onChange(newValue?.id)
                                      }
                                    }}
                                    renderInput={params => (
                                      <CustomTextField
                                        {...params}
                                        label='Select address'
                                        placeholder='Search address...'
                                        error={!!errors?.addressId}
                                        helperText={errors?.addressId?.message}
                                        required
                                        sx={{
                                          backgroundColor: '#fff !important',
                                          '& .Mui-selected': {
                                            backgroundColor: '#fff !important',
                                            paddingY: '1rem !important'
                                          },
                                          '&:hover .Mui-selected': {
                                            backgroundColor: '#fff !important'
                                          },
                                          '& .MuiAutocomplete-inputRoot.MuiInputBase-sizeSmall': {
                                            padding: '10px 0 !important' // Add padding to the input itself
                                          }
                                        }}
                                      />
                                    )}
                                    renderOption={(props, option) => (
                                      <li {...props} key={option?.id}>
                                        {option?.full_name}
                                      </li>
                                    )}
                                    inputValue={searchQueryAddress}
                                    onInputChange={(event, newInputValue) => {
                                      setSearchQueryAddress(newInputValue)
                                    }}
                                    noOptionsText='No addresses found'
                                    fullWidth
                                  />
                                )}
                              />
                            </Grid>

                            <CustomCityInput
                              cities={cities}
                              errors={errors}
                              control={control}
                              smArea={3}
                              smCity={4}
                              handleFieldChange={handleFieldChange}
                              formValues={formValues}
                              fieldId={field?.id}
                            />
                          </>
                        ) : (
                          <>
                            <Grid
                              item
                              xs={12}
                              sm={4}
                              sx={{
                                marginTop: '0.5rem'
                              }}
                            ></Grid>

                            <CustomCityInput
                              cities={cities}
                              errors={errors}
                              control={control}
                              smArea={3}
                              smCity={4}
                              handleFieldChange={handleFieldChange}
                              fieldId={field?.id}
                              formValues={formValues}
                            />
                          </>
                        )}

                        <Grid
                          item
                          xs={12}
                          sm={1}
                          sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'flex-end',
                            marginTop: '0.5rem'
                          }}
                        >
                          {index === inputFields.length - 1 ? (
                            <Button
                              onClick={handleAddField}
                              variant='outlined'
                              sx={{
                                padding: '1rem !important',
                                borderColor: '#D3D3D3',
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'flex-end'
                              }}
                            >
                              <Icon icon='ic:sharp-plus' fontSize='1rem' color='#1068A8' />
                            </Button>
                          ) : (
                            <Button
                              variant='outlined'
                              onClick={() => handleRemoveField(field?.id)}
                              sx={{
                                padding: '1rem !important',
                                borderColor: '#D3D3D3',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                              }}
                            >
                              <Icon icon='ic:sharp-delete' fontSize='1rem' color='#D32F2F' />
                            </Button>
                          )}
                        </Grid>
                      </React.Fragment>
                    )
                  })} */}
                </Grid>
                {/* {error && <Box sx={{ color: 'red' }}>{error}</Box>} */}

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
}

export default ScheduleDialog
