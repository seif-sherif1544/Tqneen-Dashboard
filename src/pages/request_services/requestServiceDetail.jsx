import { Card, CircularProgress, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'
import axios from 'axios'
import baseUrl from 'src/API/apiConfig'
import { Box } from '@mui/system'
import Image from 'next/image'
import Carousel from 'react-material-ui-carousel'

const RequestServiceDetails = ({ open, onClose, detailId }) => {
  const [serviceDetail, setServiceDetail] = useState({})

  const fetchSerivceDetails = async () => {
    try {
      if (detailId !== '' && detailId !== undefined) {
        const response = await axios.get(`${baseUrl}/api/userServices/${detailId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (response?.status === 200) {
          setServiceDetail(response?.data?.userService)
        }
      }
    } catch (error) {
      console.log(error?.message)
      toast.error(error?.message)
    }
  }
  useEffect(() => {
    fetchSerivceDetails()
  }, [detailId])

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
              sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 694 } }}
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
                  borderBottom: '0.5px solid #646569',
                  color: '#000'
                }}
              >
                Requested Service
                <IconButton size='large' sx={{ color: 'text.secondary', padding: '0px' }} onClick={() => onClose()}>
                  <Icon icon='ic:round-close' fontSize='2.5rem' />
                </IconButton>
              </DialogTitle>
              {serviceDetail?._id ? (
                <DialogContent
                  sx={{
                    pt: `0px !important`,
                    pb: theme => `${theme.spacing(8)} !important`,
                    px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(10)} !important`]
                  }}
                >
                  <Grid container spacing={2} sx={{ marginTop: '40px' }}>
                    <Grid item xs={12} md={4}>
                      <Image
                        src={serviceDetail?.service?.image || '/images/image.png'}
                        alt={serviceDetail?.title}
                        width={150}
                        height={150}
                        quality={85}
                        style={{ borderRadius: '8px' }}
                        objectFit='cover'
                      />
                      <Carousel>
                        {serviceDetail?.images?.length > 0 ? (
                          serviceDetail?.images?.map(item => {
                            return (
                              <Image
                                key={item}
                                src={item || '/images/image.png'}
                                alt={item}
                                width={150}
                                height={150}
                                quality={85}
                                style={{ borderRadius: '8px' }}
                                objectFit='cover'
                              />
                            )
                          })
                        ) : (
                          <Typography
                            sx={{
                              color: '#000',
                              marginTop: '0.4rem',
                              fontSize: '1.1rem'
                            }}
                          >
                            No Images For User
                          </Typography>
                        )}
                      </Carousel>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-start',
                          alignItems: 'flex-start',
                          gap: '4px'

                          // marginBottom: '8px',
                          // marginTop: '13px'
                        }}
                      >
                        <Typography
                          variant='h2'
                          sx={{ fontSize: '1rem', fontWeight: 700, textAlign: 'right', color: '#000' }}
                        >
                          User Name :
                        </Typography>
                        <Typography
                          variant='body1'
                          sx={{ fontSize: '14px', fontWeight: 400, textAlign: 'right', color: '#000' }}
                        >
                          {serviceDetail?.customerFullName}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-start',
                          alignItems: 'flex-start',
                          gap: '4px',
                          marginY: '1rem'
                        }}
                      >
                        <Typography
                          variant='h2'
                          sx={{ fontSize: '1rem', fontWeight: 700, textAlign: 'right', color: '#000' }}
                        >
                          User ID :
                        </Typography>
                        <Typography
                          variant='body1'
                          sx={{ fontSize: '14px', fontWeight: 400, textAlign: 'right', color: '#000' }}
                        >
                          {serviceDetail?.customerId}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-start',
                          alignItems: 'flex-start',
                          gap: '4px',
                          marginBottom: '1rem'
                        }}
                      >
                        <Typography
                          variant='h2'
                          sx={{ fontSize: '1rem', fontWeight: 700, textAlign: 'right', color: '#000' }}
                        >
                          Service Name :
                        </Typography>
                        <Typography
                          variant='body1'
                          sx={{ fontSize: '14px', fontWeight: 400, textAlign: 'right', color: '#000' }}
                        >
                          {serviceDetail?.service?.title}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-start',
                          alignItems: 'flex-start',
                          gap: '4px',
                          marginBottom: '1rem'
                        }}
                      >
                        <Typography
                          variant='h2'
                          sx={{ fontSize: '1rem', fontWeight: 700, textAlign: 'right', color: '#000' }}
                        >
                          Service Price :
                        </Typography>
                        <Typography
                          variant='body1'
                          sx={{ fontSize: '14px', fontWeight: 400, textAlign: 'right', color: '#000' }}
                        >
                          {serviceDetail?.service?.fees || 0}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-start',
                          alignItems: 'flex-start',
                          gap: '4px',
                          marginBottom: '1rem'
                        }}
                      >
                        <Typography
                          variant='h2'
                          sx={{ fontSize: '1rem', fontWeight: 700, textAlign: 'right', color: '#000' }}
                        >
                          Service Duration :
                        </Typography>
                        <Typography
                          variant='body1'
                          sx={{ fontSize: '14px', fontWeight: 400, textAlign: 'right', color: '#000' }}
                        >
                          {serviceDetail?.service?.duration || 0}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-start',
                          alignItems: 'flex-start',
                          gap: '4px',
                          marginBottom: '1rem'
                        }}
                      >
                        <Typography
                          variant='h2'
                          sx={{ fontSize: '1rem', fontWeight: 700, textAlign: 'right', color: '#000' }}
                        >
                          User Note :
                        </Typography>
                        <Typography
                          variant='body1'
                          sx={{ fontSize: '14px', fontWeight: 400, textAlign: 'right', color: '#000' }}
                        >
                          {serviceDetail?.note || ''}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-start',
                          alignItems: 'flex-start',
                          flexDirection: 'column',
                          gap: '4px'
                        }}
                      >
                        <Typography
                          variant='h2'
                          sx={{ fontSize: '1rem', fontWeight: 700, textAlign: 'right', color: '#000' }}
                        >
                          Service Description :
                        </Typography>
                        <Typography
                          variant='body1'
                          sx={{
                            fontSize: '14px',
                            fontWeight: 400,
                            textAlign: 'right',
                            color: '#000',
                            textAlign: 'left',
                            lineHeight: '22.4px',
                            height: '176px'
                          }}
                        >
                          {serviceDetail?.service?.description || ''}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </DialogContent>
              ) : (
                <DialogContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingTop: '5rem',
                      paddingBottom: '5rem'
                    }}
                  >
                    <CircularProgress size={80} />
                  </Box>
                </DialogContent>
              )}
            </Dialog>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default RequestServiceDetails
