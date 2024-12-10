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
import { useEffect, useState } from 'react'
import axios from 'axios'
import baseUrl from 'src/API/apiConfig'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { CircularProgress, Typography } from '@mui/material'

const supportValidation = Yup.object().shape({
  contactNumber: Yup.string()
    .matches(/^01\d{9}$/, 'Should be egyption number')
    .required('support number is required'),
  is_active: Yup.boolean().required('number status is required')
})

const AddSupport = ({ open, onClose, fetchData }) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      contactNumber: '',
      is_active: false
    },
    mode: 'onChange',
    resolver: yupResolver(supportValidation)
  })

  // select city api

  const handleAddTopic = async subData => {
    try {
      const data = {
        contactNumber: subData?.contactNumber,
        is_active: subData?.is_active
      }

      const response = await axios.post(`${baseUrl}/api/support`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      toast.success('Support Number Added Successfully')
      fetchData()
      reset({
        contactNumber: '',
        is_active: false
      })

      // Close the add city dialog
      handleAddClose()
    } catch (error) {
      console.error(error)
      toast.error(error?.message)
    }
  }

  const handleAddClose = () => {
    reset({
      contactNumber: '',
      is_active: false
    })
    onClose()
  }

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
              add New Support Number
            </DialogTitle>
            <DialogContent
              sx={{
                pb: theme => `${theme.spacing(8)} !important`,
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
              }}
            >
              <form onSubmit={handleSubmit(handleAddTopic)}>
                <Grid container spacing={6}>
                  <Grid item xs={12} sm={12}>
                    <CustomTextField
                      name='supportNumber'
                      fullWidth
                      label='Support Number'
                      placeholder='enter support number'
                      {...register('contactNumber', { required: 'support number is required' })}
                      error={!!errors?.contactNumber}
                      helperText={errors?.contactNumber?.message}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <Controller
                      name='is_active'
                      control={control}
                      defaultValue={false}
                      render={({ field }) => (
                        <CustomTextField {...field} select fullWidth label='Support Number Status' defaultValue={false}>
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
                        <span>Adding...</span>
                        <span>
                          <CircularProgress size={20} />
                        </span>
                      </>
                    ) : (
                      'add Support Number'
                    )}
                  </Button>
                  <Button variant='tonal' type='button' color='secondary' onClick={handleAddClose}>
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
}

export default AddSupport
