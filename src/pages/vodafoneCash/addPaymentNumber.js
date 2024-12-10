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

const AddPaymentNumber = ({ open, onClose,  fetchData }) => {
  // ** States
  const [paymentNumberStatus, setPaymentNumberStatus] = useState('');
  const [paymentContactNumber, setContactNumber] = useState('');

  // const { id } = router.query;
  const handlePaymentContact = async (e) => {
    e.preventDefault();
    try {

      const response = await axios.post(`${baseUrl}/api/paymentContact`,
        {

        contactNumber:paymentContactNumber,
        is_active: paymentNumberStatus
      },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

      fetchData();
      setContactNumber('');
      handleAddClose();
    } catch (error) {
      console.error(error);
    }
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
              <form >
                <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                      <CustomTextField
                        name='contactNumber'
                        fullWidth
                        label='contact tNumber'
                        placeholder='enter contactNumber  '
                        value={paymentContactNumber}
                        onChange={(event) => setContactNumber(event.target.value)}
                        required
                      />
                    </Grid>
                  <Grid item xs={12} sm={12}>
                    <CustomTextField
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
              </form>
            </DialogContent>
            <DialogActions
              sx={{
                justifyContent: 'center',
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              <Button variant='contained' sx={{ mr: 2 }} onClick={handlePaymentContact}>
                Add PaymentNumber
              </Button>
              <Button variant='tonal' color='secondary' >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Card>
      </Grid>
    </Grid>
  )

}

export default AddPaymentNumber
