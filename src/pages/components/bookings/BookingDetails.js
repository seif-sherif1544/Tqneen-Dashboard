import { Button, Card, CircularProgress, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'
import axios from 'axios'
import baseUrl from 'src/API/apiConfig'
import { Box } from '@mui/system'
import Image from 'next/image'
import durationDate from 'src/libs/duartionDate'

const BookingDetails = ({ open, setOpenDetails, bookingId }) => {
  const [bookingDetails, setbookingDetails] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchReviewDetails = async () => {
    try {

      setLoading(true);
      if (bookingId !== '' && bookingId !== undefined) {

        const response = await axios.get(`${baseUrl}/api/admin/singleBooking/${bookingId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (response?.status === 200) {
          setbookingDetails(response?.data?.consultation);
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
  }, [bookingId])

  const onClose = (event, reason) => {
    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
      // Set 'open' to false, however you would do that with your particular code.
      setOpenDetails(false);
    }
  }
  const durationInDays = durationDate(bookingDetails?.startTime, bookingDetails?.endTime)

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
              sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 610 } }}
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
                Booking Details
                <IconButton
                  size='large'
                  sx={{ color: 'text.secondary', padding: '0px' }}
                  onClick={() => onClose()}
                >
                  <Icon icon='ic:round-close' fontSize='2rem' color={"#BA1F1F"} />
                </IconButton>
              </DialogTitle>
              {
                loading === false ? (<DialogContent
                  sx={{
                    pt: `0px !important`,
                    pb: theme => `${theme.spacing(8)} !important`,
                    px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(10)} !important`]
                  }}
                >
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'between',
                    alignItems: 'start',
                    gap: '1rem'
                  }}>
                    <Box>
                      <Typography sx={{
                        fontSize: '1rem',
                        color: '#64656980',
                        paddingTop: '1rem'
                      }}>Booking  info</Typography>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.8rem',
                        paddingY: '1rem'
                      }}>
                        <Typography sx={{
                          color: '#252525'
                        }}>Booking ID :</Typography>
                        <Typography sx={{
                          color: '#000'
                        }}>#{bookingDetails?._id}</Typography>
                      </Box>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.8rem',
                        paddingBottom: '1rem'
                      }}>
                        <Typography sx={{
                          color: '#252525'
                        }}>Created at :</Typography>
                        <Typography sx={{
                          color: '#000'
                        }}>{new Date(bookingDetails?.createdAt).toLocaleString()}</Typography>
                      </Box>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.8rem',
                        paddingBottom: '1rem'
                      }}>
                        <Typography sx={{
                          color: '#252525'
                        }}>Updated at :</Typography>
                        <Typography sx={{
                          color: '#000'
                        }}>{new Date(bookingDetails?.updatedAt).toLocaleString()}</Typography>
                      </Box>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.8rem',
                        paddingBottom: '1rem'
                      }}>
                        <Typography sx={{
                          color: '#252525'
                        }}>Duration :</Typography>
                        <Typography sx={{
                          color: '#000'
                        }}>{durationInDays}</Typography>
                      </Box>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.8rem',
                        paddingBottom: '1rem'
                      }}>
                        <Typography sx={{
                          color: '#252525'
                        }}>Booking Status :</Typography>
                        <Typography sx={{
                          color: '#000'
                        }}>{bookingDetails?.status}</Typography>
                      </Box>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.8rem',
                        paddingBottom: '1rem'
                      }}>
                        <Typography sx={{
                          color: '#252525'
                        }}>Cancelled By :</Typography>
                        <Typography sx={{
                          color: '#000'
                        }}>{bookingDetails?.canceledBy}</Typography>
                      </Box>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.8rem',
                        paddingBottom: '1rem'
                      }}>
                        <Typography sx={{
                          color: '#252525'
                        }}>Cancelled At :</Typography>
                        <Typography sx={{
                          color: '#000'
                        }}>{new Date(bookingDetails?.canceledAt).toLocaleString()}</Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Typography sx={{
                        fontSize: '1rem',
                        color: '#64656980',
                        paddingTop: '1rem'
                      }}>Payment  info</Typography>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.8rem',
                        paddingY: '1rem'
                      }}>
                        <Typography sx={{
                          color: '#252525'
                        }}>Fees :</Typography>
                        <Typography sx={{
                          color: '#000'
                        }}>{bookingDetails?.fees}</Typography>
                      </Box>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.8rem',
                        paddingBottom: '1rem'
                      }}>
                        <Typography sx={{
                          color: '#252525'
                        }}>Payment Status :</Typography>
                        <Typography sx={{
                          color: '#000'
                        }}>{bookingDetails?.isPaid ? 'Paid' : 'Not Paid'}</Typography>
                      </Box>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.8rem',
                        paddingBottom: '1rem'
                      }}>
                        <Typography sx={{
                          color: '#252525'
                        }}>Payment Method :</Typography>
                        <Typography sx={{
                          color: '#000'
                        }}>{'Paymod'}</Typography>
                      </Box>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.8rem',
                        paddingBottom: '1rem'
                      }}>
                        <Typography sx={{
                          color: '#252525'
                        }}>Payment Date :</Typography>
                        <Typography sx={{
                          color: '#000'
                        }}>{'Paymod'}</Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box>
                    <Typography sx={{
                      fontSize: '1rem',
                      color: '#64656980',
                      paddingTop: '1rem'
                    }}>Participants  info</Typography>
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.8rem',
                        paddingTop: '1rem'
                      }}>
                        <Typography sx={{
                          color: '#252525'
                        }}>Lawyer ID :</Typography>
                        <Typography sx={{
                          color: '#000'
                        }}>#{bookingDetails?.lawyerDetails?.id}</Typography>
                      </Box>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.8rem',
                        paddingTop: '1rem'
                      }}>
                        <Typography sx={{
                          color: '#252525'
                        }}>Lawyer Name :</Typography>
                        <Typography sx={{
                          color: '#000'
                        }}>{bookingDetails?.lawyerDetails?.full_name}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.8rem',

                      }}>
                        <Typography sx={{
                          color: '#252525'
                        }}>Customer ID :</Typography>
                        <Typography sx={{
                          color: '#000'
                        }}>#{bookingDetails?.customerDetails?.id}</Typography>
                      </Box>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.8rem',
                        paddingY: '1rem'
                      }}>
                        <Typography sx={{
                          color: '#252525'
                        }}>Customer Name :</Typography>
                        <Typography sx={{
                          color: '#000'
                        }}>{bookingDetails?.customerDetails?.full_name}</Typography>
                      </Box>
                    </Box>
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

export default BookingDetails
