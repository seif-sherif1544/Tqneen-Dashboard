// ** React Imports
import { useState, useEffect } from 'react';
import axios from 'axios';

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
import baseUrl from 'src/API/apiConfig';
import { useForm } from 'react-hook-form';
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { CircularProgress } from '@mui/material';

// Define the validation schema
const validationSchema = Yup.object().shape({
  cityNameEn: Yup.string().optional().matches(/^[A-Za-z\s]+$/, 'Only English characters are allowed').required('City name in English is required'),
  cityNameAr: Yup.string().optional().matches(/^[\u0600-\u06FF\s]+$/, 'Only Arabic characters are allowed').required('City name in Arabic is required'),
  is_active: Yup.string().optional().required("activation is required")
});


const EditCity = ({ open, onClose, cityId, fetchData }) => {
  // ** States
  const [cityData, setCityData] = useState(null);

  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema)
  });
  useEffect(() => {
    const fetchCityData = async () => {
      try {
        if (cityId !== "" && cityId !== undefined && cityId !== null) {
          const response = await axios.get(`${baseUrl}/api/cities/${cityId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          })

          setCityData(response.data.data);
          reset({
            cityNameEn: response.data.data.name?.en || '',
            cityNameAr: response.data.data.name?.ar || '',
            is_active: response.data.data.is_active ? 'active' : 'inactive'
          });
        }
      } catch (error) {
        console.error('Error fetching city data:', error);
      }
    };

    fetchCityData();
  }, [cityId, reset]);



  const closeEdit = () => {
    onClose();
    reset()
  }

  const handleEditClose = async (data) => {
    try {
      if (cityId !== "" && cityId !== undefined && cityId !== null) {
        await axios.put(`${baseUrl}/api/cities/${cityId}`, {
          name: {
            ar: data?.cityNameAr,
            en: data?.cityNameEn
          },
          is_active: data?.is_active === "active" ? true : false
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        fetchData()
        onClose();
      }
    } catch (error) {
      console.error('Error updating city:', error);
    }
  };



  if (cityData) {
    const { name, areas, is_active } = cityData;

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
                Edit City Information
              </DialogTitle>
              <DialogContent
                sx={{
                  pb: theme => `${theme.spacing(8)} !important`,
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
                }}
              >
                <form onSubmit={handleSubmit(handleEditClose)}>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        fullWidth
                        name="cityNameEn"
                        label='City Name (English)'
                        defaultValue={name?.en}
                        {...register('cityNameEn', { required: 'city name in english is required' })}

                        error={Boolean(errors.cityNameEn)}
                        helperText={errors?.cityNameEn?.message}
                        required

                      // value={name?.en}
                      // onChange={(e) => setCityData({  name: { ...name, en: e.target.value } })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        name="cityNameAr"
                        fullWidth
                        label='City Name (Arabic)'
                        {...register('cityNameAr', { required: 'city name in english is required' })}
                        defaultValue={name?.ar}
                        error={Boolean(errors.cityNameAr)}
                        helperText={errors?.cityNameAr?.message}
                        required

                      // value={name?.ar}
                      // onChange={(e) => setCityData({ name: { ...name, ar: e.target.value } })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <CustomTextField
                        select
                        fullWidth
                        name="is_active"
                        label='City Status'
                        defaultValue={is_active ? 'active' : 'inactive'}
                        {...register('is_active', { required: 'activation is required' })}
                        error={Boolean(errors.is_active)}
                        helperText={errors?.is_active?.message}
                      >
                        <MenuItem value='active'>Active</MenuItem>
                        <MenuItem value='inactive'>Not active</MenuItem>
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
                    <Button variant='contained' type='submit' sx={{
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
                    <Button variant='tonal' color='secondary' type='button' onClick={closeEdit}>
                      Cancel
                    </Button>
                  </DialogActions>
                </form>
              </DialogContent>
            </Dialog>
          </Card>
        </Grid>
      </Grid>
    );
  } else {
    return null;
  }
};

export default EditCity
