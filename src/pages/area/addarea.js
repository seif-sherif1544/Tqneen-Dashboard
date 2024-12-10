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
import { useEffect, useState } from 'react';
import axios from 'axios';
import * as Yup from "yup";
import baseUrl from 'src/API/apiConfig'
import toast from 'react-hot-toast'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

const areaValidation = Yup.object().shape({
  areaNameEn: Yup.string().matches(/^[A-Za-z\s]+$/, 'Only English characters are allowed').required('Area name in English is required'),
  areaNameAr: Yup.string().matches(/^[\u0600-\u06FF\s]+$/, 'Only Arabic characters are allowed').required('Area name in Arabic is required'),
  cityId: Yup.string()
    .required('City id required'),

})

const AddArea = ({ open, onClose, fetchData }) => {
  const [areaNameEn, setAreaNameEn] = useState('');
  const [areaNameAr, setAreaNameAr] = useState('');
  const [areaStatus, setAreaStatus] = useState('');
  const [cityId, setCityId] = useState('');
  const [cities, setCities] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      areaNameEn: '',
      areaNameAr: '',
      cityId: ''
    },
    mode: 'onChange',
    resolver: yupResolver(areaValidation)
  });

  // select city api

  useEffect(() => {
    // fetch data

    const fetchCiteis = async () => {
      try {


        const response = await axios.get(`${baseUrl}/api/cities`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setCities(response.data.data);
        setSuccessMessage('Area added successfully!');
        setErrorMessage('');
      } catch (error) {
        setErrorMessage('Failed to add area.');
        setSuccessMessage('');
        console.log(error);
      }
    }
    fetchCiteis()
  }, []);


  const handleAddArea = async (subData) => {

    try {


      const data = {
        name: {
          ar: subData?.areaNameAr,
          en: subData?.areaNameEn
        },
        is_active: Boolean(areaStatus),
        city: subData?.cityId,
      };

      const response = await axios.post(`${baseUrl}/api/areas`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success("Area Added successfully")

      fetchData();
      reset({
        areaNameAr: '',
        areaNameEn: '',
        cityId: ''
      })
      setAreaStatus('');

      // Close the add city dialog

      handleAddClose();
    } catch (error) {
      console.error(error);

      toast.error(error?.message)

    }
  };

  const handleAddClose = () => {
    reset({
      areaNameAr: '',
      areaNameEn: '',
      cityId: ''
    })
    setAreaStatus('');

    onClose();
  };


  if (cities) {
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
                add New Area Information
              </DialogTitle>
              <DialogContent
                sx={{
                  pb: theme => `${theme.spacing(8)} !important`,
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
                }}
              >
                <form onSubmit={handleSubmit(handleAddArea)}>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        name='areaNameEn'
                        fullWidth
                        label='area name in En'
                        placeholder='enter area name in english'
                        {...register('areaNameEn', { required: 'area name in english is required' })}
                        error={!!errors.areaNameEn}
                        helperText={errors?.areaNameEn?.message}
                        required

                      // value={areaNameEn}
                      // onChange={handleChange(setAreaNameEn)}
                      // error={Boolean(errors.areaNameEn)} // Display error state
                      // helperText={errors.areaNameEn}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        name='areaNameAr'
                        fullWidth
                        label='area name in arabic'
                        placeholder='enter area name in arabic'
                        {...register('areaNameAr', { required: 'area name in arabic is required' })}
                        error={!!errors.areaNameAr}
                        helperText={errors.areaNameAr?.message}
                        required

                      // value={areaNameAr}
                      // onChange={handleChange(setAreaNameAr)}
                      // error={Boolean(errors.areaNameAr)} // Display error state
                      // helperText={errors.areaNameAr}
                      />
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <CustomTextField
                        name='cityId'
                        select
                        fullWidth
                        label='Select City'
                        {...register('cityId', { required: 'city id is required' })}
                        error={!!errors.cityId}
                        helperText={errors?.cityId?.message}
                        required

                      // value={cityId}
                      // onChange={handleChange(setCityId)}
                      // error={Boolean(errors.cityId)} // Display error state
                      // helperText={errors.cityId}

                      >
                        {cities && cities.map((city) => (
                          <MenuItem key={city.id} value={city.id}>
                            {city.name.en}
                          </MenuItem>
                        ))}
                      </CustomTextField>
                    </Grid>
                    {/* <Grid item xs={12} sm={12}>
                      <CustomTextField
                        name="is_active"
                        select
                        fullWidth
                        label='area Status'
                        value={areaStatus}
                        onChange={(event) => setAreaStatus(event.target.value)}
                      >
                        <MenuItem value='true' >Active</MenuItem>
                        <MenuItem value='false' >Inactive</MenuItem>
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
                    <Button variant='contained' type="submit" sx={{
                      mr: 2, color: 'white', '&:hover': {
                        backgroundColor: '#1174bb',
                        color: '#fff'
                      }
                    }} disabled={isSubmitting} >
                      {isSubmitting ? 'adding...' : 'add area'}
                    </Button>
                    <Button variant='tonal' type="button" color='secondary' onClick={handleAddClose}>
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

export default AddArea
