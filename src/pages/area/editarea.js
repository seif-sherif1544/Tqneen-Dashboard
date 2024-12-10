// ** React Imports
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

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
import { use } from 'i18next';
import { headers } from 'next/dist/client/components/headers';
import baseUrl from 'src/API/apiConfig';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import toast from 'react-hot-toast';

const areaValidation = Yup.object().shape({
  areaNameEn: Yup.string().optional().matches(/^[A-Za-z\s]+$/, 'Only English characters are allowed').required('Area name in English is required'),
  areaNameAr: Yup.string().optional().matches(/^[\u0600-\u06FF\s]+$/, 'Only Arabic characters are allowed').required('Area name in Arabic is required'),
  cityId: Yup.string().optional().required('City id required'),
  is_active: Yup.string().optional().required("activation is required")
})

const EditArea = ({ open, onClose, areaId, fetchData }) => {
  // ** States
  const [areaNameEn, setAreaNameEn] = useState('');
  const [areaNameAr, setAreaNameAr] = useState('');
  const [areaStatus, setAreaStatus] = useState('');
  const [cityId, setCityId] = useState();
  const [cities, setCities] = useState([]);
  const [areaData, setAreaData] = useState({})

  const router = useRouter();

  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm({
    mode: 'onChange',
    resolver: yupResolver(areaValidation)
  });
  console.log("err ", errors)

  // const { id } = router.query;

  // fetch area data
  useEffect(() => {
    const fetchArea = async () => {

      try {
        if (areaId !== "" && areaId !== undefined && areaId !== null) {

          const response = await axios.get(`${baseUrl}/api/areas/${areaId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });

          setAreaData(response.data.data);

          reset({
            areaNameEn: response.data.data.name?.en || '',
            areaNameAr: response.data.data.name?.ar || '',
            is_active: response.data.data.is_active ? 'active' : 'inactive',
            cityId: response.data.data.city.id
          });

          // setAreaNameEn(area.name.en);
          // setAreaNameAr(area.name.ar);
          // setAreaStatus(area.is_active ? 'true' : 'false');
          // setCityId(area.city.id);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchArea();
  }, [areaId, reset])

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
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/cities`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })

        const citiesData = response.data.data;
        setCities(citiesData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCities();
  }, []);

  const handleUpdateArea = async (data) => {

    try {
      // const data = {
      //   name: {
      //     ar: areaNameAr,
      //     en: areaNameEn
      //   },
      //   is_active:  JSON.parse(areaStatus),
      //   city: cityId,
      // };
      console.log(data)

      const response = await axios.put(`${baseUrl}/api/areas/${areaId}`, {
        name: {
          en: data?.areaNameEn,
          ar: data?.areaNameAr,
        },
        is_active: data?.is_active === 'true',
        city: data?.cityId,
      },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

      // Handle the response as needed

      toast.success("Updated successfully")
      fetchData();

      // Close the edit area dialog
      onClose();
    } catch (error) {
      // Handle error
      console.error(error);
      toast.error(error?.message)
    }
  };

  const handleEditClose = () => {
    // Perform any necessary actions before closing the dialog
    onClose();
    reset();
  };
  if (areaData) {
    const { name, city, is_active } = areaData;

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
                edit New area Information
              </DialogTitle>
              <DialogContent
                sx={{
                  pb: theme => `${theme.spacing(8)} !important`,
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
                }}
              >
                <form onSubmit={handleSubmit(handleUpdateArea)}>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        name='areaNameEn'
                        fullWidth
                        label='Area name in English'
                        placeholder='Enter area name in English'
                        defaultValue={name?.en}
                        {...register('areaNameEn', { required: 'area name in english is required' })}

                        error={Boolean(errors.areaNameEn)}
                        helperText={errors?.areaNameEn?.message}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        name='areaNameAr'
                        fullWidth
                        label='Area name in arabic'
                        placeholder='Enter area name in arabic'
                        defaultValue={name?.ar}
                        {...register('areaNameAr', { required: 'area name in arabic is required' })}

                        error={Boolean(errors.areaNameAr)}
                        helperText={errors?.areaNameAr?.message}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <CustomTextField
                        name="cityId"
                        select
                        fullWidth
                        label="Select City"
                        defaultValue={city?.id}
                        {...register('cityId', { required: 'city id is required' })}

                        error={Boolean(errors.cityId)}
                        helperText={errors?.cityId?.message}
                        required
                      >
                        {cities.map((city) => (
                          <MenuItem key={city.id} value={city.id}>
                            {city.name.en} {/* or {city.name.ar} for Arabic name */}
                          </MenuItem>
                        ))}
                      </CustomTextField>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <CustomTextField
                        name="is_active"
                        select
                        fullWidth
                        label="Area Status"
                        defaultValue={is_active ? 'true' : 'false'}
                        {...register('is_active', { required: 'activation is required' })}

                        error={Boolean(errors.is_active)}
                        helperText={errors?.is_active?.message}
                        required
                      >
                        <MenuItem value="true">Active</MenuItem>
                        <MenuItem value="false">Not active</MenuItem>
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
                      {isSubmitting ? 'Saving...' : 'Save'}
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
    return null;
  }

}

export default EditArea
