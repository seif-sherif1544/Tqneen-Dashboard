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
  percentage: Yup.number().typeError("percentage must be a number").required("percentage is required")
})

const AcceptRejectDrawal = ({ open, setDrawal, accept, loading, handleSubmit, text }) => {

  const [error, setError] = useState("");



  const onClose = (event, reason) => {
    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
      // Set 'open' to false, however you would do that with your particular code.
      setDrawal(false);
    }
  }




  const handleClose = () => {
    onClose();
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
            sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 457 } }}
          >
            <DialogTitle
              id='user-view-edit'
              sx={{
                // textAlign: 'center',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                fontSize: '1.5rem !important',
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(10)} !important`],
                pt: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(6)} !important`],
                pb: theme => [`${theme.spacing(2)} !important`, `${theme.spacing(4)} !important`],

                color: "#000"
              }}
            >

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
                    pt: '0rem !important',
                    px: theme => [`${theme.spacing(2)} !important`, `${theme.spacing(4)} !important`]
                  }}
                >
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: "center",
                    marginBottom: '1rem'
                  }}>

                  </Box>
                  <Box>
                    <Typography sx={{
                      fontSize: '1.4rem',
                      textAlign: 'center',
                      color: '#000000'
                    }}>{text}</Typography>
                  </Box>
                  <Typography sx={{ color: 'red' }}>{error}</Typography>
                  <Box sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: '2rem',
                    gap: '1rem'
                  }}>
                    <Button variant="outlined" type='button' onClick={handleClose} sx={{
                      color: "#0D0E10",
                      borderColor: "#DCDCDC",
                      py: theme => [`${theme.spacing(2)} !important`, `${theme.spacing(3)} !important`],
                      px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(7.5)} !important`]
                    }}>Cancel</Button>
                    {accept ? (<Button variant="contained" type='submit' sx={{
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#1068A8"
                      },
                      py: theme => [`${theme.spacing(2)} !important`, `${theme.spacing(3)} !important`],
                      px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(7.5)} !important`]
                    }} onClick={handleSubmit} disabled={loading}>{loading ? 'approving' : 'Approve'}</Button>) : (
                      <Button variant="contained" type='submit' sx={{
                        color: "white",
                        backgroundColor: "#BA1F1F",
                        "&:hover": {
                          backgroundColor: "#BA1F1F"
                        },
                        py: theme => [`${theme.spacing(2)} !important`, `${theme.spacing(3)} !important`],
                        px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(7.5)} !important`]
                      }} onClick={handleSubmit} disabled={loading}>{loading ? 'rejecting' : 'Reject'}</Button>
                    )}
                  </Box>

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

export default AcceptRejectDrawal
