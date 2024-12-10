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
import Icon from 'src/@core/components/icon'

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { boolean } from 'yup'
import baseUrl from 'src/API/apiConfig'
import * as Yup from "yup";
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, CircularProgress, IconButton } from '@mui/material'
import { addIcon } from '@iconify/react'
import Image from 'next/image'

// ...

const specializationValidation = Yup.object().shape({
  SpecializationsNameEn: Yup.string().matches(/^[A-Za-z\s]+$/, 'Only English characters are allowed').required("Specialization name in english is required"),
  SpecializationsNameAr: Yup.string().matches(/^[\u0600-\u06FF\s]+$/, 'Only Arabic characters are allowed').required("Specialization name in arabic is required"),

  // image: Yup.string().required("image is required")
})

addIcon('mdi:upload-box', {
  body: `

<path d="M2 19C2 20.7 3.3 22 5 22H19C20.7 22 22 20.7 22 19V11H2V19ZM19 4H17V3C17 2.4 16.6 2 16 2C15.4 2 15 2.4 15 3V4H9V3C9 2.4 8.6 2 8 2C7.4 2 7 2.4 7 3V4H5C3.3 4 2 5.3 2 7V9H22V7C22 5.3 20.7 4 19 4Z" fill="white"/>

`,
  width: 24,
  height: 24
})


// ... (your existing imports)

const AddSpecializations = ({ open, setOpenAdd, fetchData }) => {
  const [SpecializationsNameEn, setSpecializationsNameEn] = useState('');
  const [SpecializationsNameAr, setSpecializationsNameAr] = useState('');
  const [SpecializationsStatus, setSpecializationsStatus] = useState('');
  const [SpecializationsId, setSpecializationsId] = useState();
  const [imageFile, setImageFile] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState('')
  const [error, setError] = useState('')
  const [imageLoading, setImageLoading] = useState(false)

  const handleImageUpload = event => {
    const file = event.target.files[0]
    setImageFile(file)

  }

  const onClose = (event, reason) => {
    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
      // Set 'open' to false, however you would do that with your particular code.
      setOpenAdd(false);
    }
  }

  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      SpecializationsNameEn: '',
      SpecializationsNameAr: '',
      image: imageUrl
    },
    mode: 'onChange',
    resolver: yupResolver(specializationValidation)
  });
  console.log(errors);

  const fileInputRef = useRef(null)

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }


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
      toast.error(error?.message);
      setImageLoading(false)
    }
  }
  useEffect(() => {
    uploadimage()
  }, [imageFile])


  const handleAddSpecializations = async (subData) => {

    try {
      const data = {
        name: {
          ar: subData?.SpecializationsNameAr,
          en: subData?.SpecializationsNameEn,
        },
        image: imageUrl

        // is_active: Boolean(SpecializationsStatus)
      };



      const response = await axios.post(`${baseUrl}/api/specializations`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Handle the response as needed
      toast.success("Specialization added successfully")
      fetchData();
      reset({
        SpecializationsNameAr: '',
        SpecializationsNameEn: '',
        image: ''
      })
      setSelectedFile('');
      setImageUrl('');

      // Close the add Specializations dialog
      handleAddClose();
    } catch (error) {
      // Handle error
      console.error(error);
      toast.error(error?.response?.data?.message);
      setImageUrl('');

    }
  };

  const handleAddClose = () => {
    // Perform any necessary actions before closing the dialog
    onClose();
    reset({
      SpecializationsNameAr: '',
      SpecializationsNameEn: '',
      image: ''
    })
    setSelectedFile('');
    setImageUrl('');
  };



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
              Add Specialization
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

                // pb: theme => `${theme.spacing(8)} !important`,
                // px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
              }}
            >
              <form onSubmit={handleSubmit(handleAddSpecializations)}>
                <Grid container spacing={6}>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      name='SpecializationsNameEn'
                      fullWidth
                      label='Specializations name in En'
                      placeholder='enter Specializations name in english'
                      {...register("SpecializationsNameEn", { required: "Specialization name in english is required" })}
                      error={Boolean(errors?.SpecializationsNameEn)}
                      helperText={errors?.SpecializationsNameEn?.message}


                    // value={SpecializationsNameEn}
                    // onChange={handleChange(setSpecializationsNameEn)}
                    // error={Boolean(errors.SpecializationsNameEn)} // Display error state
                    // helperText={errors.SpecializationsNameEn}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      name='SpecializationsNameAr'
                      fullWidth
                      label='Specializations name in arabic'
                      placeholder='enter Specializations name in arabic'
                      {...register("SpecializationsNameAr", { required: "Specialization name in arabic is required" })}
                      error={Boolean(errors?.SpecializationsNameAr)}
                      helperText={errors?.SpecializationsNameAr?.message}


                    // value={SpecializationsNameAr}
                    // onChange={handleChange(setSpecializationsNameAr)}
                    // error={Boolean(errors.SpecializationsNameAr)} // Display error state
                    // helperText={errors.SpecializationsNameAr}

                    />
                  </Grid>

                </Grid>
                <Grid container spacing={6} sx={{
                  paddingTop: '1rem'
                }}>
                  <Grid item xs={12} sm={6} sx={{ position: 'relative', overflow: 'hidden', }}>
                    <CustomTextField
                      name='image'
                      fullWidth
                      label='Image'
                      value={selectedFile}
                      placeholder='enter service image'
                      {...register('image', {
                        required: 'service image is required',
                        validate: (value) => {
                          console.log(value)
                          if (!value || !selectedFile) {
                            return "Please select an image";
                          }

                          return true;
                        }
                      })}
                      error={!!errors.image}
                      helperText={errors?.image?.message}
                      onChange={(event) => {
                        console.log(event)
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        fontSize: '1.8rem',
                        paddingTop: '0.41rem',
                        paddingLeft: '0.7rem',
                        right: 0,
                        bottom: errors?.image ? '20.5%' : '0.5%',
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
                      placeholder="Select status "
                      value={SpecializationsStatus}
                      onChange={(event) => setSpecializationsStatus(event.target.value)}
                    >

                      <MenuItem value='true'>Active</MenuItem>
                      <MenuItem value='false'>Inactive</MenuItem>
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
                            {imageUrl && <Image width={100} height={100} objectFit='cover' src={imageUrl} alt="specialization iamge" style={{

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
                  <Button variant='outlined' type="button" onClick={handleAddClose} sx={{
                    color: "#0D0E10",
                    borderColor: "#DCDCDC",
                    py: theme => [`${theme.spacing(2)} !important`, `${theme.spacing(3)} !important`],
                    px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(7.5)} !important`],
                    "&:hover": {
                      color: "#0D0E10",
                      borderColor: "#DCDCDC",
                    }
                  }}>
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

                  }} disabled={isSubmitting || !imageUrl}>
                    {isSubmitting ? (
                      <>
                        <span>Adding...</span>
                        <span>
                          <CircularProgress size={20} />
                        </span>
                      </>
                    ) : 'add'}
                  </Button>

                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AddSpecializations;


