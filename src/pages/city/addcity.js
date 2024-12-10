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

import { useState } from 'react';
import axios from 'axios';
import { boolean } from 'yup'
import baseUrl from 'src/API/apiConfig'
import * as Yup from 'yup';
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { CircularProgress } from '@mui/material'

// Define the validation schema
const validationSchema = Yup.object().shape({
  cityNameEn: Yup.string().matches(/^[A-Za-z\s]+$/, 'Only English characters are allowed').required('City name in English is required'),
  cityNameAr: Yup.string().matches(/^[\u0600-\u06FF\s]+$/, 'Only Arabic characters are allowed').required('City name in Arabic is required'),
});




const AddCity = ({ open, onClose, fetchData }) => {


  const [cityStatus, setCityStatus] = useState('');

  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      cityNameEn: '',
      cityNameAr: ''
    },
    mode: 'onChange',
    resolver: yupResolver(validationSchema)
  });


  const handleAddCity = async (subData) => {

    try {
      const data = {
        name: {
          ar: subData.cityNameAr,
          en: subData.cityNameEn
        },
        is_active: Boolean(cityStatus)
      };

      const response = await axios.post(`${baseUrl}/api/cities`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Handle the response as needed
      if (response?.status === 200) {

        // Close the add city dialog
        toast.success("City Added successfully")
        handleAddClose();
        reset({
          cityNameAr: '',
          cityNameEn: ''
        })
        fetchData();
      }

    } catch (error) {
      // Handle error
      console.error(error);

      toast.error(error?.message)
    }
  };

  const handleAddClose = () => {
    // Perform any necessary actions before closing the dialog
    onClose();
    reset({
      cityNameAr: '',
      cityNameEn: ''
    })
  };

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const data = [
    {
      name: 'ahmed',
    }
  ]

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
                Add New City Information
              </DialogTitle>
              <DialogContent
                sx={{
                  pb: theme => `${theme.spacing(8)} !important`,
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
                }}
              >
                <form onSubmit={handleSubmit(handleAddCity)}>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        name='cityNameEn'
                        fullWidth
                        label='city name in En'
                        placeholder='enter city name in english'
                        {...register('cityNameEn', { required: 'city name in english is required' })}
                        error={Boolean(errors.cityNameEn)}
                        helperText={errors?.cityNameEn?.message}
                        required

                      // value={cityNameEn}
                      // onChange={handleChange(setCityNameEn)}
                      // error={Boolean(errors.cityNameEn)} // Display error state
                      // helperText={errors.cityNameEn}

                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        name='cityNameAr'
                        fullWidth
                        label='city name in arabic'
                        placeholder='enter city name in arabic'
                        {...register('cityNameAr', { required: 'city name in arabic is required' })}
                        error={!!errors.cityNameAr}
                        helperText={errors.cityNameAr?.message}

                        // value={cityNameAr}
                        // onChange={handleChange(setCityNameAr)}
                        // error={Boolean(errors.cityNameAr)} // Display error state
                        // helperText={errors.cityNameAr}
                        required
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
                  <DialogActions
                    sx={{
                      justifyContent: 'center',
                      px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                      pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`],
                      mt: theme => [`${theme.spacing(4)} !important`, `${theme.spacing(6)} !important`],
                    }}
                  >
                    <Button variant='contained' sx={{
                      mr: 2, color: 'white', '&:hover': {
                        backgroundColor: '#1174bb',
                        color: '#fff'
                      }
                    }} type='submit' disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <span>Adding...</span>
                          <span>
                            <CircularProgress size={20} />
                          </span>
                        </>
                      ) : 'add city'
                      }
                    </Button>
                    <Button variant='tonal' color='secondary' type='button' onClick={handleAddClose}>
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

export default AddCity
