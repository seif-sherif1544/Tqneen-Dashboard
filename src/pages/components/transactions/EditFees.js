import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Card, CircularProgress, Dialog, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'

import { Controller, useForm } from 'react-hook-form'
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useState } from 'react';
import baseUrl from 'src/API/apiConfig';

const transactionValidation = Yup.object().shape({
  percentage: Yup.number().typeError("percentage must be a number")
})

const EditFees = ({ open, onClose, handleReload }) => {

  const [error, setError] = useState("");

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    mode: 'onChange',
    resolver: yupResolver(transactionValidation)
  });

  const onSubmit = async (values) => {
    try {
      const response = await axios.put(`${baseUrl}/api/generalConfig/profitPercentage`, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      toast.success("percentage updated successfully");
      handleReload();
      handleClose();
    } catch (error) {
      setError(error?.message)
      toast.error(error?.response?.data?.message)
      console.log(error);
    }
  }


  const handleClose = () => {
    onClose();
    reset({
      percentage: ''
    })
    setError('')
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
            sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 460 } }}
          >
            <DialogTitle
              id='user-view-edit'
              sx={{
                // textAlign: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '1.5rem !important',
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(10)} !important`],
                pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`],
                pb: theme => [`${theme.spacing(4)} !important`, `${theme.spacing(4)} !important`],
                borderBottom: '0.5px solid #DEDEDE',
                color: "#000"
              }}
            >
              Profit Percentage
              <IconButton
                size='large'
                sx={{ color: 'text.secondary', padding: '0px' }}
                onClick={handleClose}
              >
                <Icon icon='ic:round-close' fontSize='2rem' color={"#BA1F1F"} />
              </IconButton>
            </DialogTitle>
            {/* loading === false && trackData?._id) */}
            {true ? (
              <>
                <DialogContent
                  sx={{
                    pb: theme => `${theme.spacing(8)} !important`,
                    px: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(16)} !important`]
                  }}
                >
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: "center",
                    marginBottom: '1rem'
                  }}>

                  </Box>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                      name='percentage'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          fullWidth
                          value={value}
                          sx={{ mb: 4 }}
                          label='Profit Percentage'

                          onChange={onChange}
                          placeholder='Enter profit percentage %'
                          error={Boolean(errors?.percentage)}
                          {...(errors?.percentage && { helperText: errors?.percentage?.message })}
                        />
                      )}
                    />
                    <Typography sx={{ color: 'red' }}>{error}</Typography>
                    <Box sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: '1rem'
                    }}>
                      <Button variant="outlined" type='button' onClick={handleClose} sx={{
                        color: "#0D0E10",
                        borderColor: "#DCDCDC",
                        py: theme => [`${theme.spacing(2)} !important`, `${theme.spacing(3)} !important`],
                        px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(7.5)} !important`]
                      }}>Cancel</Button>
                      <Button variant="contained" type='submit' sx={{
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#1068A8"
                        },
                        py: theme => [`${theme.spacing(2)} !important`, `${theme.spacing(3)} !important`],
                        px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(7.5)} !important`]
                      }} disabled={isSubmitting}>{isSubmitting ? 'applying...' : 'Apply'}</Button>
                    </Box>
                  </form>
                </DialogContent>
              </>

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
  )
}

export default EditFees
