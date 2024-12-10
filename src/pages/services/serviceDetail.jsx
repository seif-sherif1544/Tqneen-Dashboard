import { Card, CircularProgress, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'
import axios from 'axios'
import baseUrl from 'src/API/apiConfig'
import { Box } from '@mui/system'
import Image from 'next/image'

const ServiceDetails = ({open,onClose,detailId}) => {
  const [serviceDetail,setServiceDetail] = useState({});
  const [loading,setLoading] = useState(true);

  const fetchSerivceDetails = async ()=>{
    try{

      if(detailId !== '' && detailId !== undefined){
        setLoading(true);

        const response = await axios.get(`${baseUrl}/api/services/${detailId}`,{
          headers:{
            Authorization:`Bearer ${localStorage.getItem('token')}`
          }
        })
        if(response?.status === 200){
          setServiceDetail(response?.data?.data);
        }
        setLoading(false);
      }
    }catch(error){
      console.log(error?.message);
      toast.error(error?.message);
      setLoading(false);

    }
  }
  useEffect(()=>{
    fetchSerivceDetails();
  },[detailId])

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
                  color:"#000"
                }}
              >
                Service Details
                <IconButton
                  size='large'
                  sx={{ color: 'text.secondary', padding: '0px' }}
                  onClick={() => onClose()}
                >
                  <Icon icon='ic:round-close' fontSize='2.5rem' />
                </IconButton>
              </DialogTitle>
              {
                loading === false ? (<DialogContent
                  sx={{
                    pt:`0px !important`,
                    pb: theme => `${theme.spacing(8)} !important`,
                    px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(10)} !important`]
                  }}
                >
                  <Grid container spacing={2} sx={{marginTop:'40px'}}>
                <Grid item xs={12} md={4}>
                  <Box sx={{

                  }}>
                    <Image src={serviceDetail?.image || '/images/image.png'} alt={serviceDetail?.title} width={150} height={150} quality={85} style={{borderRadius:'8px'}} objectFit='cover'/>
                  </Box>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Box sx={{display:'flex',justifyContent:'flex-start',alignItems:'flex-start',gap:'4px',marginBottom:'1rem',paddingTop:'0px'}}>
                    <Typography variant='h2' sx={{fontSize:'1rem',fontWeight:700,textAlign:'right',color:"#000"}}>Service Name :</Typography>
                    <Typography variant='body1' sx={{fontSize:'14px',fontWeight:400,textAlign:'right',color:"#000"}}>{serviceDetail?.title}</Typography>
                    </Box>
                    <Box sx={{display:'flex',justifyContent:'flex-start',alignItems:'flex-start',gap:'4px',marginBottom:'1rem'}}>
                    <Typography variant='h2' sx={{fontSize:'1rem',fontWeight:700,textAlign:'right',color:"#000"}}>Service Price :</Typography>
                    <Typography variant='body1' sx={{fontSize:'14px',fontWeight:400,textAlign:'right',color:"#000"}}>{serviceDetail?.fees || 0}</Typography>
                    </Box>
                    <Box sx={{display:'flex',justifyContent:'flex-start',alignItems:'flex-start',gap:'4px',marginBottom:'1rem'}}>
                    <Typography variant='h2' sx={{fontSize:'1rem',fontWeight:700,textAlign:'right',color:"#000"}}>Service Duration :</Typography>
                    <Typography variant='body1' sx={{fontSize:'14px',fontWeight:400,textAlign:'right',color:"#000"}}>{serviceDetail?.duration || 0}</Typography>
                    </Box>
                    <Box sx={{display:'flex',justifyContent:'flex-start',alignItems:'flex-start',flexDirection:'column',gap:'4px'}}>
                    <Typography variant='h2' sx={{fontSize:'1rem',fontWeight:700,textAlign:'right',color:"#000"}}>Service Description :</Typography>
                    <Typography variant='body1' sx={{fontSize:'14px',fontWeight:400,textAlign:'right',color:"#000",textAlign:"left",lineHeight:'22.4px',height:'176px'}}>{serviceDetail?.description || ''}</Typography>
                    </Box>

                  </Grid>
                  </Grid>

                </DialogContent>) : (
                  <DialogContent>
                    <Box sx={{ display: 'flex',justifyContent:'center',alignItems:'center',paddingTop:'5rem',paddingBottom:'5rem' }}>
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

export default ServiceDetails
