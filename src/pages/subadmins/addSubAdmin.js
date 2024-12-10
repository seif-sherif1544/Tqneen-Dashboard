// ** React Imports
// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useState } from 'react';
import axios from 'axios';
import { boolean } from 'yup'
import baseUrl from 'src/API/apiConfig'
import { Controller } from 'react-hook-form'
import { CircularProgress, TextField } from '@mui/material'


import { useForm } from 'react-hook-form'
import * as Yup from "yup";
import toast from 'react-hot-toast'
import { yupResolver } from '@hookform/resolvers/yup'

const subAdminValidation = Yup.object().shape({
  userName: Yup.string().required("user name is required"),
  phoneName: Yup.string().matches(/^0[0-9]{10}$/, "Invalid phone number format").required("phone name is required"),
  email: Yup.string().required("email is required"),
  password: Yup.string().required("password is required"),
})

const AddSubAdmin = ({ open, onClose, fetchData }) => {

  const [userName, setUserName] = useState('');
  const [phoneName, setPhoneName] = useState('');
  const [email, setUserEmail] = useState('');
  const [password, setUserPassword] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      userName: '',
      phoneName: '',
      email: '',
      password: ''
    },
    mode: 'onChange',
    resolver: yupResolver(subAdminValidation)
  });

  const onSubmit = async (subData) => {
    try {
      await axios.post(`${baseUrl}/api/admin/users`, {
        type: "subAdmin",
        first_name: subData?.userName,
        last_name: subData?.userName,
        password: subData?.password,
        gender: "male",
        phone: subData?.phoneName,
        area_id: "1",
        city: "1",
        email: subData?.email,

        // is_active: true

      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });

      toast.success("user added successfully");
      fetchData();
      reset({
        userName: '',
        phoneName: '',
        email: '',
        password: ''
      })
      onClose();
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(error?.response?.data?.message);
    }
  };






  const handleAddClose = () => {
    onClose();
    reset({
      userName: '',
      phoneName: '',
      email: '',
      password: ''
    })

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
                add users
              </DialogTitle>
              <DialogContent
                sx={{
                  pb: theme => `${theme.spacing(8)} !important`,
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
                }}
              >
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={6}>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        name='userName'
                        fullWidth
                        label='first name'
                        placeholder='first name'
                        rules={{ required: "required" }}
                        {...register("userName", { required: "userName is required" })}
                        error={Boolean(errors.userName)}
                        helperText={errors?.userName?.message}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        name='phoneName'
                        rules={{
                          required: true,
                          pattern: {
                            value: /^0[0-9]{10}$/,
                            message: "Mobile number must be 11 digits and start with zero"
                          }
                        }} fullWidth
                        label='phone'
                        {...register("phoneName", { required: "phone is required" })}
                        error={Boolean(errors.phoneName)}
                        helperText={errors?.phoneName?.message}
                        placeholder='phone'
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        rules={{ required: "Email is required" }}
                        name='email'
                        {...register("email", { required: "email is required" })}
                        error={Boolean(errors.email)}
                        helperText={errors?.email?.message}
                        fullWidth
                        label='email'
                        placeholder='email'
                        required

                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <CustomTextField
                        rules={{
                          required: "Password is required",
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters"
                          }
                        }}
                        name='password'
                        {...register("password", { required: "password is required" })}
                        error={Boolean(errors.password)}
                        helperText={errors?.password?.message}
                        fullWidth
                        label='password'
                        placeholder='password'
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
                    }} type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <span>Adding...</span>
                          <span>
                            <CircularProgress size={20} />
                          </span>
                        </>
                      ) : 'add user'}
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

export default AddSubAdmin
