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
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomTextField from 'src/@core/components/mui/text-field'
import { use } from 'i18next';
import { headers } from 'next/dist/client/components/headers';
import baseUrl from 'src/API/apiConfig'
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from "yup";
import toast from 'react-hot-toast';
import { Box, CircularProgress, IconButton } from '@mui/material';

const topicValidation = Yup.object().shape({
  topicNameEn: Yup.string().optional().matches(/^[A-Za-z\s]+$/, 'Only English characters are allowed').required("Topic name in english is required"),
  topicNameAr: Yup.string().optional().matches(/^[\u0600-\u06FF\s]+$/, 'Only Arabic characters are allowed').required("Topic name in arabic is required"),
  is_active: Yup.string().optional().required("Specialization id  is required"),
  specialization: Yup.number().optional().required("Specialization id  is required"),
})


const EditTopic = ({ open, setOpenEdit, editTopicId, fetchData }) => {
  // ** States
  const [topicNameEn, setTopicNameEn] = useState('');
  const [topicNameAr, setTopicNameAr] = useState('');
  const [topicStatus, setTopicStatus] = useState('');
  const [specializationId, setSpecializationId] = useState('');
  const [specializationes, setSpecializationsData] = useState([]);
  const [topicData, setTopicData] = useState({});
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm({
    mode: 'onChange',
    resolver: yupResolver(topicValidation)
  });

  // const { id } = router.query;

  // fetch area data
  useEffect(() => {
    const fetchTopic = async () => {
      setLoading(true);
      try {
        if (editTopicId !== "" && editTopicId !== null && editTopicId !== undefined) {

          const response = await axios.get(`${baseUrl}/api/topics/${editTopicId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          });

          const topic = response?.data?.data;
          setTopicData(topic);
          setLoading(false);
          reset({
            topicNameEn: topic.name.en,
            topicNameAr: topic.name.ar,
            is_active: topic.is_active ? 'true' : 'false',
            specialization: topic?.specialization?.id
          })
          setSpecializationId(topic?.specialization?.id);
        }
      } catch (error) {
        console.error(error);
        toast.error(error?.message);
        setLoading(false);
      }
    };

    fetchTopic();
  }, [editTopicId, reset])

  const onClose = (event, reason) => {
    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
      // Set 'open' to false, however you would do that with your particular code.
      setOpenEdit(false);
    }
  }

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
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/specializations?limit=100000`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
          }
        );

        setSpecializationsData(response?.data?.data?.docs);


      } catch (error) {
        console.error(error);
      }
    };

    fetchSpecializations();
  }, []);

  const handleUpdateTopic = async (data) => {
    try {
      // const data = {
      //   name: {
      //     ar: areaNameAr,
      //     en: areaNameEn
      //   },
      //   is_active:  JSON.parse(areaStatus),
      //   city: cityId,
      // };
      if (editTopicId !== "" && editTopicId !== null && editTopicId !== undefined) {
        const response = await axios.put(`${baseUrl}/api/topics/${editTopicId}`, {
          name: {
            en: data?.topicNameEn,
            ar: data?.topicNameAr,
          },
          is_active: data?.is_active === 'true',
          specialization: data?.specialization,
        },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });

        // Handle the response as needed

        fetchData();
        toast.success("Updated Successfully");

        // Close the edit area dialog
        onClose();
      }
    } catch (error) {
      // Handle error
      console.error(error);
      toast.error(error?.message)
    }
  };

  const handleEditClose = () => {
    // Perform any necessary actions before closing the dialog
    onClose();

  };
  if (topicData) {
    const { name, is_active, specialization } = topicData;

    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <Dialog
              open={open}
              onClose={onClose}
              aria-labelledby='user-view-edit'
              aria-describedby='user-view-edit-description'
              disableBackdropClick // Prevents closing on backdrop clicks
              disableEscapeKeyDown // Prevents closing on pressing the Escape key
              sx={{
                '& .MuiPaper-root': {
                  width: '100%', maxWidth: 694, px: theme => [`${theme.spacing(4)} !important`, `${theme.spacing(6)} !important`],
                  py: theme => [`${theme.spacing(4)} !important`, `${theme.spacing(8)} !important`],
                }
              }}
            >
              <DialogTitle
                id='user-view-edit'
                sx={{
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
                Edit topic
                <IconButton
                  size='large'
                  sx={{ color: 'text.secondary', padding: '0px' }}
                  onClick={() => handleEditClose()}
                >
                  <Icon icon='ic:round-close' fontSize='2.5rem' color="#BA1F1F" />
                </IconButton>
              </DialogTitle>
              {loading === false ? <DialogContent
                sx={{
                  paddingX: '1rem !important',
                  paddingTop: '1rem',
                  '& .MuiDialogContent-root': {
                    padding: '0rem !important',
                    paddingBottom: '0rem !important'
                  },
                  paddingBottom: '0rem !important',
                }}
              >
                <form onSubmit={handleSubmit(handleUpdateTopic)}>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        name='topicNameEn'
                        fullWidth
                        label='Topic name in English'
                        placeholder='Enter Topic name in English'
                        defaultValue={name?.en}
                        {...register('topicNameEn', { required: 'topic name in english is required' })}

                        error={Boolean(errors?.topicNameEn)}
                        helperText={errors?.topicNameEn?.message}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        name='topicNameAr'
                        fullWidth
                        label='Topic name in arabic'
                        placeholder='Enter Topic name in arabic'
                        defaultValue={name?.ar}
                        {...register('topicNameAr', { required: 'topic name in english is required' })}

                        error={Boolean(errors?.topicNameAr)}
                        helperText={errors?.topicNameAr?.message}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <CustomTextField
                        name="specialization"
                        select
                        fullWidth
                        label="Select specialization"

                        {...register('specialization')}
                        defaultValue={specializationId}
                        error={Boolean(errors?.specializationId)}
                        helperText={errors?.specializationId?.message}
                        required
                      >
                        {specializationes?.map((specializations) => (
                          <MenuItem key={specializations?.id} value={specializations?.id}>
                            {specializations?.name?.ar}
                          </MenuItem>
                        ))}
                      </CustomTextField>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <CustomTextField
                        name="is_active"
                        select
                        fullWidth
                        label="Topic Status"
                        defaultValue={is_active ? 'true' : 'false'}
                        {...register('is_active', { required: 'activation is required' })}

                        error={Boolean(errors.is_active)}
                        helperText={errors?.is_active?.message}
                        required
                      >
                        <MenuItem value="true">Active</MenuItem>
                        <MenuItem value="false">Inactive</MenuItem>
                      </CustomTextField>
                    </Grid>
                  </Grid>
                  <DialogActions
                    sx={{
                      mt: theme => [`${theme.spacing(4)} !important`, `${theme.spacing(7.5)} !important`],
                      '& .MuiDialogActions-root': {
                        paddingBottom: '0rem !important',
                        paddingRight: '0rem'
                      },
                      paddingBottom: '0rem !important',
                      paddingRight: '0rem'

                    }}
                  >
                    <Button variant='outlined' type='button' sx={{
                      color: "#0D0E10",
                      borderColor: "#DCDCDC",
                      py: theme => [`${theme.spacing(2)} !important`, `${theme.spacing(3)} !important`],
                      px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(7.5)} !important`],
                      "&:hover": {
                        color: "#0D0E10",
                        borderColor: "#DCDCDC",
                      }
                    }} onClick={handleEditClose}>
                      Cancel
                    </Button>
                    <Button variant='contained' type='submit' sx={{
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
                      },
                    }} disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <span>Editing...</span>
                          <span>
                            <CircularProgress size={20} />
                          </span>
                        </>
                      ) : 'Edit'}
                    </Button>

                  </DialogActions>
                </form>
              </DialogContent> : (
                <DialogContent>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '5rem', paddingBottom: '5rem' }}>
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
    return null;
  }

}

export default EditTopic
