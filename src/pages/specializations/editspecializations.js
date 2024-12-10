// ** React Imports
import { useState, useEffect, useRef } from 'react';
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
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomTextField from 'src/@core/components/mui/text-field'
import baseUrl from 'src/API/apiConfig';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import { Box, CircularProgress, IconButton } from '@mui/material';
import { addIcon } from '@iconify/react';
import Image from 'next/image';
import toast from 'react-hot-toast';

const specializationValidation = Yup.object().shape({
  SpecializationsNameEn: Yup.string().optional().matches(/^[A-Za-z\s]+$/, 'Only English characters are allowed').required("Specialization name in english is required"),
  SpecializationsNameAr: Yup.string().optional().matches(/^[\u0600-\u06FF\s]+$/, 'Only Arabic characters are allowed').required("Specialization name in arabic is required"),
  is_active: Yup.string().optional().required("Activation is required")
})

addIcon('mdi:upload-box', {
  body: `

<path d="M2 19C2 20.7 3.3 22 5 22H19C20.7 22 22 20.7 22 19V11H2V19ZM19 4H17V3C17 2.4 16.6 2 16 2C15.4 2 15 2.4 15 3V4H9V3C9 2.4 8.6 2 8 2C7.4 2 7 2.4 7 3V4H5C3.3 4 2 5.3 2 7V9H22V7C22 5.3 20.7 4 19 4Z" fill="white"/>

`,
  width: 24,
  height: 24
})


const EditSpecializations = ({ open, setOpenEdit, SpecializationsId, fetchData }) => {
  // ** States
  const [SpecializationsData, setSpecializationsData] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState('');
  const [error, setError] = useState('');
  const [imageLoading, setImageLoading] = useState(false)

  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm({
    mode: 'onChange',
    resolver: yupResolver(specializationValidation)
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
  };

  const onClose = (event, reason) => {
    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
      // Set 'open' to false, however you would do that with your particular code.
      reset({
        SpecializationsNameEn: SpecializationsData?.name?.en || '',
        SpecializationsNameAr: SpecializationsData?.name?.ar || '',
        is_active: SpecializationsData?.is_active ? 'active' : 'inactive',
        image: SpecializationsData?.image || '',
      })
      setOpenEdit(false);
      setImageUrl('');
    }
  }
  async function uploadImages() {

    // Upload the image and get the URL
    try {
      if (imageFile) {
        setImageLoading(true);
        const formData = new FormData();
        formData.append('image', imageFile);
        setSelectedFile(imageFile?.name)

        const response = await axios.post(`${baseUrl}/images`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        setImageUrl(response?.data?.signedUrl)
        setImageLoading(false);
      }
    } catch (error) {
      console.log(error?.message)
      toast.error(error?.message);
      setImageLoading(false)
    }
  }
  useEffect(() => {
    uploadImages()
  }, [imageFile])

  const fileInputRef = useRef(null)

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  useEffect(() => {
    const fetchSpecializationsData = async () => {
      setLoading(true)
      try {
        if (SpecializationsId !== "" && SpecializationsId !== null && SpecializationsId !== undefined) {

          const response = await axios.get(`${baseUrl}/api/specializations/${SpecializationsId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          });
          setSpecializationsData(response?.data?.data);
          reset({
            SpecializationsNameEn: response?.data?.data?.name?.en || '',
            SpecializationsNameAr: response?.data?.data?.name?.ar || '',
            is_active: response?.data?.data?.is_active ? 'active' : 'inactive',
            image: response?.data?.data?.image || '',
          });
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching Specializations data:', error);
        setLoading(false)
      }
    };

    fetchSpecializationsData();
  }, [SpecializationsId, reset, selectedFile]);

  const handleEditClose = async (data) => {
    try {
      if (SpecializationsId !== "" && SpecializationsId !== null && SpecializationsId !== undefined) {

        await axios.put(`${baseUrl}/api/specializations/${SpecializationsId}`, {
          name: {
            ar: data?.SpecializationsNameAr,
            en: data?.SpecializationsNameEn
          },
          is_active: data?.is_active === 'active',
          image: imageUrl === '' ? SpecializationsData?.image : imageUrl
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        fetchData()
        onClose();
      }
    } catch (error) {
      setError(error?.message)
      console.error('Error updating Specializations:', error);
    }
  };

  const closeEdit = () => {
    onClose();

    setError('');
  }


  if (SpecializationsData) {
    const { name, is_active } = SpecializationsData;

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
                },

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
                Edit Specialization
                <IconButton
                  size='large'
                  sx={{ color: 'text.secondary', padding: '0px' }}
                  onClick={closeEdit}
                >
                  <Icon icon='ic:round-close' fontSize='2.5rem' color="#BA1F1F" />
                </IconButton>
              </DialogTitle>
              {(loading === false && SpecializationsData?._id) ? (
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
                  <form onSubmit={handleSubmit(handleEditClose)}>
                    <Grid container spacing={6}>
                      <Grid item xs={12} sm={6}>
                        <CustomTextField
                          name="SpecializationsNameEn"
                          fullWidth
                          label='Specializations Name (English)'
                          defaultValue={name?.en}
                          {...register('SpecializationsNameEn', { required: 'activation is required' })}

                          error={Boolean(errors.SpecializationsNameEn)}
                          helperText={errors?.SpecializationsNameEn?.message}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <CustomTextField
                          name="SpecializationsNameAr"
                          fullWidth
                          label='Specializations Name (Arabic)'
                          defaultValue={name?.ar}
                          {...register('SpecializationsNameAr', { required: 'activation is required' })}

                          error={Boolean(errors.SpecializationsNameAr)}
                          helperText={errors?.SpecializationsNameAr?.message}
                          required
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={6} sx={{
                      paddingTop: '1rem'
                    }}>
                      <Grid item xs={12} sm={6} sx={{ position: 'relative', overflow: 'hidden' }}>
                        <CustomTextField
                          name='image'
                          fullWidth
                          label='Image'
                          placeholder='enter service image'
                          defaultValue={selectedFile !== '' ? selectedFile : SpecializationsData?.image}
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
                          name="is_active"
                          select
                          fullWidth
                          label='Status'
                          defaultValue={is_active ? 'active' : 'inactive'}
                          {...register('is_active', { required: 'activation is required' })}

                          error={Boolean(errors.is_active)}
                          helperText={errors?.is_active?.message}
                          required
                        >
                          <MenuItem value='active'>Active</MenuItem>
                          <MenuItem value='inactive'>Inactive</MenuItem>
                        </CustomTextField>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{
                          width: '5rem',
                          height: '5rem'
                        }}>
                          {
                            imageLoading ? (
                              <span>
                                <CircularProgress size={25} />
                              </span>
                            ) : (
                              <>
                                {(imageUrl || SpecializationsData?.image) && <Image width={100} height={100} objectFit='cover' src={imageUrl || SpecializationsData?.image} alt="specialization iamge" style={{

                                }} />}
                              </>
                            )
                          }

                        </Box>
                      </Grid>

                    </Grid>
                    <DialogActions
                      sx={{
                        justifyContent: 'flex-end',

                        // px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],

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
                      }} onClick={closeEdit}>
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
                            <span>Editing...</span>
                            <span>
                              <CircularProgress size={20} />
                            </span>
                          </>
                        ) : 'Edit'}
                      </Button>

                    </DialogActions>
                  </form>
                </DialogContent>
              ) : (
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
    );
  } else {
    return null
  }
};

export default EditSpecializations
