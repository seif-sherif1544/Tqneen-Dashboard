// ** React Imports
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

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
import { use } from 'i18next'
import { headers } from 'next/dist/client/components/headers'
import baseUrl from 'src/API/apiConfig'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { CircularProgress, Typography } from '@mui/material'

const supportValidation = Yup.object().shape({
  contactNumber: Yup.string()
    .matches(/^01\d{9}$/, 'Should be egyption number')
    .required('support number is required'),
  is_active: Yup.boolean().required('number status is required')
})

const EditSupport = ({ open, onClose, editTopicId, fetchData }) => {
  // ** States

  const [supportData, setSupportData] = useState({})

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(supportValidation)
  })

  // const { id } = router.query;

  // fetch area data
  useEffect(() => {
    const fetchTopic = async () => {
      try {
        if (editTopicId !== '' && editTopicId !== null && editTopicId !== undefined) {
          const response = await axios.get(`${baseUrl}/api/support/${editTopicId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })

          const support = response.data
          setSupportData(support)
          reset({
            contactNumber: support?.contactNumber,
            is_active: support.is_active ? true : false
          })
        }
      } catch (error) {
        console.error(error)
        toast.error(error?.message)
      }
    }

    fetchTopic()
  }, [editTopicId, reset])

  // Fetch city data
  // useEffect(() => {
  //   const fetchCities = async () => {
  //     try {
  //       const response = await axios.get(
  //         'https://tqneen-rlyoguxn5a-uc.a.run.app/api/cities',
  //         {
  //           headers: {
  //             Authorization:
  //               'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTY1YTM1NjNhMjE2N2Q3NDUxNTRhZGEiLCJ0eXBlIjoiYWRtaW4iLCJpZCI6MSwiaWF0IjoxNzAyMzY2NDE0fQ.3bOsxc0tjcOThhsmUaUsw6lNIumDWp3H9sC8FjU1bcs',
  //           },
  //         }
  //       );

  //       const citiesData = response.data.data;

  //       console.log("citeies request", response);

  //       const cityNames = citiesData.map((city) => city.name.en);
  //       setCities(cityNames);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchCities();
  // }, []);

  const handleUpdateTopic = async data => {
    try {
      // const data = {
      //   name: {
      //     ar: areaNameAr,
      //     en: areaNameEn
      //   },
      //   is_active:  JSON.parse(areaStatus),
      //   city: cityId,
      // };
      if (editTopicId !== '' && editTopicId !== null && editTopicId !== undefined) {
        const response = await axios.put(
          `${baseUrl}/api/support/${editTopicId}`,
          {
            contactNumber: data?.contactNumber,
            is_active: data?.is_active === true,
            specialization: data?.specializationId
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )

        // Handle the response as needed

        fetchData()
        toast.success('Updated Successfully')

        // Close the edit area dialog
        onClose()
      }
    } catch (error) {
      // Handle error
      console.error(error)
      toast.error(error?.message)
    }
  }

  const handleEditClose = () => {
    // Perform any necessary actions before closing the dialog
    onClose()
    reset()
  }
  if (supportData) {
    const { contactNumber, is_active } = supportData

    return (
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
                edit Support Number
              </DialogTitle>
              <DialogContent
                sx={{
                  pb: theme => `${theme.spacing(8)} !important`,
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
                }}
              >
                <form onSubmit={handleSubmit(handleUpdateTopic)}>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={12}>
                      <CustomTextField
                        name='contactNumber'
                        fullWidth
                        label='Contact Number'
                        placeholder='Enter Contact Number'
                        defaultValue={contactNumber?.en}
                        {...register('contactNumber', { required: 'contact number is required' })}
                        error={Boolean(errors.contactNumber)}
                        helperText={errors?.contactNumber?.message}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <Controller
                        name='is_active'
                        control={control}
                        defaultValue={supportData?.is_active}
                        value={supportData?.is_active}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            select
                            fullWidth
                            label='Support Number Status'
                            defaultValue={false}
                          >
                            <MenuItem value={true}>Active</MenuItem>
                            <MenuItem value={false}>Inactive</MenuItem>
                          </CustomTextField>
                        )}
                      />
                      {errors?.is_active && <Typography color='error'>{errors?.is_active?.message}</Typography>}
                    </Grid>
                  </Grid>
                  <DialogActions
                    sx={{
                      justifyContent: 'center',
                      px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                      pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`],
                      mt: theme => [`${theme.spacing(4)} !important`, `${theme.spacing(6)} !important`]
                    }}
                  >
                    <Button
                      variant='contained'
                      type='submit'
                      sx={{
                        mr: 2,
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#1174bb',
                          color: 'white'
                        }
                      }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span>Editing...</span>
                          <span>
                            <CircularProgress size={20} />
                          </span>
                        </>
                      ) : (
                        'edit Contact Number'
                      )}
                    </Button>
                    <Button variant='tonal' type='button' color='secondary' onClick={handleEditClose}>
                      Cancel
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

export default EditSupport
