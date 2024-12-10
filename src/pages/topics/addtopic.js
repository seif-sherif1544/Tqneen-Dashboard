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
import baseUrl from 'src/API/apiConfig'
import * as Yup from "yup";
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { CircularProgress, IconButton } from '@mui/material'
import Icon from 'src/@core/components/icon'

const topicValidation = Yup.object().shape({
  topicNameEn: Yup.string().matches(/^[A-Za-z\s]+$/, 'Only English characters are allowed').required("Topic name in english is required"),
  topicNameAr: Yup.string().matches(/^[\u0600-\u06FF\s]+$/, 'Only Arabic characters are allowed').required("Topic name in arabic is required"),
  specializationsId: Yup.number().required("Specialization id  is required"),
})



const AddTopics = ({ open, setOpenAdd, fetchData }) => {
  const [topicNameEn, setTopicNameEn] = useState('');
  const [topicNameAr, setTopicNameAr] = useState('');
  const [topicStatus, setTopicStatus] = useState('');
  const [areaStatus, setAreaStatus] = useState('');
  const [specializationsId, setSpecializationsId] = useState('');
  const [specializations, setSpecializations] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [addLoading, setAddLoading] = useState(false)


  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      topicNameEn: '',
      topicNameAr: '',
      specializationsId: ''
    },
    mode: 'onChange',
    resolver: yupResolver(topicValidation)
  });

  const onClose = (event, reason) => {
    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
      // Set 'open' to false, however you would do that with your particular code.
      setOpenAdd(false);
    }
  }

  // select city api
  useEffect(() => {
    // fetch data
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/specializations?limit=100000`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setSpecializations(response?.data?.data?.docs);
        setAreaStatus(area.is_active ? 'true' : 'false');
        setSuccessMessage('Area add specializations successfully!');
        setErrorMessage('');
      } catch (error) {
        setErrorMessage('Failed to add specializations.');
        setSuccessMessage('');
        console.log(error);
      }
    }
    fetchSpecializations()
  }, []);


  const handleAddTopic = async (subData) => {
    try {
      const data = {
        name: {
          ar: subData?.topicNameAr,
          en: subData?.topicNameEn
        },

        specialization: subData?.specializationsId,
      };

      const response = await axios.post(`${baseUrl}/api/topics`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      toast.success("Topic Added Successfully")
      fetchData();
      reset({
        topicNameAr: '',
        topicNameEn: '',
        specializationsId: ''
      })
      setTopicStatus('');

      // Close the add city dialog
      handleAddClose();
    } catch (error) {
      console.error(error);
      toast.error(error?.message)

    }
  };

  const handleAddClose = () => {
    reset({
      topicNameAr: '',
      topicNameEn: '',
      specializationsId: ''
    })
    setTopicStatus('');
    onClose();
  };



  if (specializations) {
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
                  width: '100%', maxWidth: 694,
                  px: theme => [`${theme.spacing(4)} !important`, `${theme.spacing(6)} !important`],
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
                Add Topic
                <IconButton
                  size='large'
                  sx={{ color: 'text.secondary', padding: '0px' }}
                  onClick={() => handleAddClose()}
                >
                  <Icon icon='ic:round-close' fontSize='2.5rem' color="#BA1F1F" />
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
                  paddingBottom: '0rem !important',
                }}
              >
                <form onSubmit={handleSubmit(handleAddTopic)}>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        name='topicNameEn'
                        fullWidth
                        label='Topic name in En'
                        placeholder='enter Topic name in english'
                        {...register("topicNameEn", { required: "topic name in english is required" })}
                        error={errors?.topicNameEn}
                        helperText={errors?.topicNameEn?.message}

                        // value={topicNameEn}
                        // onChange={handleChange(setTopicNameEn)}
                        // error={Boolean(errors.topicNameEn)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        name='topicNameAr'
                        fullWidth
                        label='topic name in arabic'
                        placeholder='enter topic name in arabic'
                        {...register("topicNameAr", { required: "topic name in arabic is required" })}
                        error={!!errors?.topicNameAr}
                        helperText={errors?.topicNameAr?.message}

                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <CustomTextField
                        name="specializationsId"
                        select
                        fullWidth
                        label="Select specializations"
                        {...register("specializationsId", { required: "specializations id is required" })}
                        error={!!errors?.specializationsId}
                        helperText={errors?.specializationsId?.message}

                        required
                      >
                        {specializations.map((specializations) => (
                          <MenuItem key={specializations.id} value={specializations.id}>
                            {specializations.name.en} {/* or {city.name.ar} for Arabic name */}
                          </MenuItem>
                        ))}
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
                    <Button variant='outlined' type="button" sx={{
                      color: "#0D0E10",
                      borderColor: "#DCDCDC",
                      py: theme => [`${theme.spacing(2)} !important`, `${theme.spacing(3)} !important`],
                      px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(7.5)} !important`],
                      "&:hover": {
                        color: "#0D0E10",
                        borderColor: "#DCDCDC",
                      }
                    }} onClick={handleAddClose}>
                      Cancel
                    </Button>
                    <Button variant='contained' type="submit" sx={{
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
                          <span>Adding...</span>
                          <span>
                            <CircularProgress size={20} />
                          </span>
                        </>
                      ) : 'Add'}
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

export default AddTopics
