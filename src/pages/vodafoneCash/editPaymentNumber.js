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
import CustomTextField from 'src/@core/components/mui/text-field';
import baseUrl from 'src/API/apiConfig'
import { TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const EditPaymentNumber = ({ open, onClose, editPaymentContactId, fetchData }) => {
  // ** States
  const [paymentNumberStatus, setPaymentNumberStatus] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  // const { id } = router.query;


  const {
    reset,
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  })

  // fetch area data
  useEffect(() => {
    const getPaymentNumber = async () => {

      try {
        if(editPaymentContactId !== null && editPaymentContactId !== undefined && editPaymentContactId !== ""){

          const response = await axios.get(`${baseUrl}/api/paymentContact/${editPaymentContactId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });

          const PaymentContact = response?.data;
          setPaymentNumberStatus(PaymentContact?.is_active ? 'true' : 'false');
          setContactNumber(PaymentContact?.contactNumber);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getPaymentNumber();
  }, [editPaymentContactId])




  const handlelUpdatPaymentNumber = async (e) => {
    e.preventDefault();
    try {
      if(editPaymentContactId !== null && editPaymentContactId !== undefined && editPaymentContactId !== ""){

      const response = await axios.put(`${baseUrl}/api/paymentContact/${editPaymentContactId}`, {
        is_active: paymentNumberStatus,
        contactNumber: contactNumber
      },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success("Updated Successfully");
      fetchData();

      onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message);
    }
  };

  const handleEditClose = () => {
    onClose();
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
              edit New PaymentNumber Information
            </DialogTitle>
            <DialogContent
              sx={{
                pb: theme => `${theme.spacing(8)} !important`,
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
              }}
            >
              <form>
                <Grid container spacing={6}>
                  <Grid item xs={12} sm={12}>
                    <CustomTextField
                      sx={{ mb: 4 }}
                      select
                      fullWidth
                      label="PaymentNumberStatus"
                      value={paymentNumberStatus}
                      onChange={(event) => setPaymentNumberStatus(event.target.value)}
                      required
                    >
                      <MenuItem value="true">Active</MenuItem>
                      <MenuItem value="false">Inactive</MenuItem>
                    </CustomTextField>
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={12} >
                  <Controller
                    name='contactNumber'
                    control={control}
                    rules={{ required: true, pattern: { value: /^0[0-9]{10}$/, message: "mobile number must be 11 digits and start with zero" } }}
                    render={({ field: { value, onChange } }) => (
                      <>
                        <TextField
                          value={contactNumber}
                          fullWidth
                          sx={{ mb: 4 }}
                          label='Contact Number'
                          onChange={(event) => setContactNumber(event.target.value)}
                          placeholder=''
                          error={Boolean(errors.contactNumber)}
                          helperText={errors.contactNumber?.message}
                          {...(errors.contactNumber && { helperText: errors.contactNumber.message })}

                        />
                      </>
                    )}
                  />
                </Grid>

              </form>
            </DialogContent>
            <DialogActions
              sx={{
                justifyContent: 'center',
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              <Button variant='contained' sx={{ mr: 2 }} onClick={handlelUpdatPaymentNumber}>
                edit PaymentNumber
              </Button>
              <Button variant='tonal' color='secondary' onClick={handleEditClose}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Card>
      </Grid>
    </Grid>
  )

}

export default EditPaymentNumber
