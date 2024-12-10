import { Button, Card, CircularProgress, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'
import axios from 'axios'
import baseUrl from 'src/API/apiConfig'
import { Box } from '@mui/system'
import Image from 'next/image'

const ReviewDetails = ({ open, onClose, reviewId }) => {
  const [ReviewDetails, setReviewDetails] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchReviewDetails = async () => {
    try {

      if (reviewId !== '' && reviewId !== undefined) {
        setLoading(true);

        const response = await axios.get(`${baseUrl}/api/services/${reviewId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (response?.status === 200) {
          setReviewDetails(response?.data?.data);
        }
        setLoading(false);
      }
    } catch (error) {
      console.log(error?.message);
      toast.error(error?.message);
      setLoading(false);

    }
  }
  useEffect(() => {
    fetchReviewDetails();
  }, [reviewId])

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <Dialog
              open={open}
              onClose={onClose}
              aria-labelledby='user-view-edit'
              aria-describedby='user-view-edit-description'
              sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 554 } }}
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
                Review
                <IconButton
                  size='large'
                  sx={{ color: 'text.secondary', padding: '0px' }}
                  onClick={() => onClose()}
                >
                  <Icon icon='ic:round-close' fontSize='2rem' color={"#BA1F1F"} />
                </IconButton>
              </DialogTitle>
              {
                true ? (<DialogContent
                  sx={{
                    pt: `0px !important`,
                    pb: theme => `${theme.spacing(8)} !important`,
                    px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(10)} !important`]
                  }}
                >
                  <Box>
                    <Typography sx={{
                      color: '#000',
                      lineHeight: 1.5,
                      marginTop: '1rem'
                    }}>Absolutely positive experience with the legal consultation! The attorney was incredibly knowledgeable and took the time to thoroughly explain my options in a clear and straightforward manner. Their experience and attention to detail gave me a solid understanding of my case and confidence moving forward. Highly recommend for anyone needing reliable legal advice!</Typography>
                  </Box>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '1.5rem'
                  }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2.5px'
                    }}>
                      <Typography sx={{
                        color: '#000',
                        fontSize: '1.625rem'
                      }}>4.9</Typography>
                      <Icon icon='solar:star-bold' color={"#FFCA10"} fontSize={23} />
                    </Box>
                    <Button variant="outlined" color="secondary" sx={{
                      color: '#0D0E10'
                    }}>Cancel</Button>
                  </Box>
                </DialogContent>) : (
                  <DialogContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '5rem', paddingBottom: '5rem' }}>
                      <CircularProgress size={80} />
                    </Box>
                  </DialogContent>
                )
              }

            </Dialog>
          </Card>
        </Grid>
      </Grid>


    </>
  )
}

export default ReviewDetails
