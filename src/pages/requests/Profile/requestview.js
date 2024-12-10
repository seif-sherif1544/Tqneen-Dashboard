// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'

import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Utils Import
import { useAsync } from 'src/hooks/useAsync'
import { useRouter } from 'next/router'
import axios from 'axios'
import baseUrl from 'src/API/apiConfig'
import { Button, CardActions, CardMedia, CircularProgress, Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import toast from 'react-hot-toast'




const roleColors = {
  admin: 'error',
  customer: 'success',

  // accepted: 'info',

  accepted: 'warning',
  maintainer: 'success',
  subscriber: 'primary',
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

// const statusColors = {
//   true: 'success',
//   pending: 'warning',
//   false: 'secondary'
// }

const RequestView = () => {
  // const [openEdit, setOpenEdit] = useState(false)

  const router = useRouter()
  const [reqId, setReqId] = useState([])
  const [rotation, setRotation] = useState(0);
  const [cartRotation, setCartRotation] = useState(0);
  const [loadAccept, setLoadAccept] = useState(false);
  const [loadReject, setLoadReject] = useState(false);

  // const handleEditClickOpen = () => setOpenEdit(true)

  // const handleEditClose = () => setOpenEdit(false)

  // const {
  //   control,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm({
  //   mode: 'onSubmit',

  // })

  const requestId = router.query.requestid


  const { data, execute } = useAsync((requestId) => {
    return axios.get(`${baseUrl}/api/admin/docRequest/${requestId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    });
  }, { immediate: false });

  useEffect(() => {
    if (router.query.requestid) {

      execute(router.query.requestid)
    }

  }, [router.query.requestid])





  const handleAccepted = async (requestId) => {
    try {
      if (requestId !== "" && requestId !== undefined && requestId !== null) {
        setLoadAccept(true);

        const response = await axios.put(
          `${baseUrl}/api/admin/docRequest/${requestId}`,
          {
            status: 'accepted',
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        toast.success("Active Successfully");
        setLoadAccept(false);

        router.push('/requests');
      }
    } catch (error) {
      console.error('Failed to reject request:', error.message);
      toast.error(error?.response?.data.message);
      setLoadAccept(false);
    }
  }

  const handleReject = async (requestId) => {
    try {
      if (requestId !== "" && requestId !== undefined && requestId !== null) {
        setLoadReject(true);

        const response = await axios.put(
          `${baseUrl}/api/admin/docRequest/${requestId}`,
          {
            status: 'rejected',
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        toast.success("Request rejected successfully");
        setLoadReject(false);
        router.push('/requests');
      }
    } catch (error) {
      console.error('Failed to reject request:', error.message);
      toast.error(error.message);
      setLoadReject(false);
    }
  }

  // const handleRotateLeft = () => {
  //   setRotation((prevRotation) => prevRotation - 90);
  // };

  // const handleRotateRight = () => {
  //   setRotation((prevRotation) => prevRotation + 90);
  // };

  const handleRotate = (direction, setRotationFunction) => {
    setRotationFunction((prevRotation) => (direction === 'left' ? prevRotation - 90 : prevRotation + 90));
  };

  return (
    <Grid container spacing={12}>
      <Grid item xs={12} lg={6}>
        <Card>
          <Box sx={{ pt: 13.5, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <CardMedia sx={{ width: 200, height: 300, mb: 2 }} image={data?.lawyer?.avatar} />
            <Typography sx={{ m: 2, fontWeight: 'bold', color: 'text.secondary', textAlign: 'center' }}>{data?.lawyer?.full_name} </Typography>
          </Box>
          <Typography sx={{ m: 4, fontWeight: 'bold', color: 'text.secondary', textAlign: 'center', fontSize: 22 }}>Request  Details </Typography>
          <CardContent sx={{ pb: 4 }}>
            <Box sx={{ pt: 4 }}>
              <Box sx={{ display: 'flex', mb: 3, alignItems: 'center' }}>
                <Typography sx={{ mr: 2, fontWeight: 'bold', color: 'text.secondary', textAlign: 'center' }}>Request  Number :</Typography>
                <Typography sx={{ color: 'text.secondary' }}> {data?.id} </Typography>
              </Box>
              <Box sx={{ mb: 3, mr: 2, fontWeight: 'bold', color: 'text.secondary ' }}>
                <Typography sx={{ fontWeight: 'bold', color: 'text.secondary ' }} color={roleColors[data?.status]} >Request Status : {data?.status}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 3 }}>
                <Typography sx={{ mr: 2, fontWeight: 'bold', color: 'text.secondary ' }}>Created at:</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{new Date(data?.createdAt).toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 3 }}>
                <Typography sx={{ mr: 2, fontWeight: 'bold', color: 'text.secondary ' }}>updated at:</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{new Date(data?.updatedAt).toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 3 }}>
                <Typography sx={{ mr: 2, fontWeight: 'bold', color: 'text.secondary ' }}>fees:</Typography>
                <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>{data?.fees}</Typography>
              </Box>
              <div className='demo-space-x'>
                <Button variant="contained" onClick={() => handleAccepted(requestId)} disabled={loadAccept} sx={{
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#1174bb',
                  }
                }}>
                  {loadAccept ? (
                    <>
                      <span>Accepting...</span>
                      <span>
                        <CircularProgress size={20} />
                      </span>
                    </>
                  ) : 'Accept'}
                </Button>
                <Button variant="contained" color="secondary" onClick={() => handleReject(requestId)} disabled={loadReject}>
                  {loadReject ? (
                    <>
                      <span>Rejecting...</span>
                      <span>
                        <CircularProgress size={20} />
                      </span>
                    </>
                  ) : 'Reject'}
                </Button>
              </div>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} lg={6} >
        <Card>
          <CardContent ssx={{ pt: 13.5, display: 'flex', alignItems: 'center' }}>
            <Typography variant='body2' sx={{ color: 'text.disabled', fontSize: 18, mp: 8, textAlign: 'center', alignItems: 'center', textTransform: 'uppercase' }}>
              Personal Card  information Image
            </Typography>
            <Divider sx={{ my: 5, mx: 6 }} />
            <Typography variant='body2' sx={{ color: 'text.disabled', fontSize: 18, mp: 16, textAlign: 'left', alignItems: 'center', textTransform: 'uppercase' }}>
              {data?.flag}
            </Typography>
            <div style={{ display: 'flex', gap: '16px', width: '100%', height: '100%', overflow: 'hidden' }}>
              {data?.docs?.map((image, index) => (
                <Card key={index} sx={{ width: '100%', height: '100%', overflow: 'hidden', display: 'flex', transform: `rotate(${rotation}deg)`, ml: 15 }}>
                  <CardMedia
                    component="img"
                    sx={{ width: '100%', height: '100%', overflow: 'hidden', pb: 4, textAlign: 'center' }}
                    image={image || '/images/cards/glass-house.png'}
                  />
                </Card>

              ))}
            </div>

            {/* <div>
            <button onClick={handleRotateLeft}>Rotate Left</button>
            <button onClick={handleRotateRight}>Rotate Right</button>
          </div> */}
            <div>
              <button onClick={() => handleRotate('left', setRotation)}>Rotate Left</button>
              <button onClick={() => handleRotate('right', setRotation)}>Rotate Right</button>
            </div>
            {/* <Divider sx={{ my: 5, mx: 6 }} /> */}
            {/* <Card sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
              <CardMedia component="img" sx={{ width: '100%', height: '100%', pb: 4, textAlign: 'center', transform: `rotate(${cartRotation}deg)`, ml: 15, overflow: 'hidden' }} image={data?.lawyer?.cardImages ? data?.lawyer.cardImages : ''} />
            </Card> */}
            {/* <div>
              <button onClick={() => handleRotate('left', setCartRotation)}>Rotate Left</button>
              <button onClick={() => handleRotate('right', setCartRotation)}>Rotate Right</button>
            </div> */}
            {/* <Divider sx={{ my: 5, mx: 6 }} /> */}
            {/* <Card sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
              <CardMedia component="img" sx={{ hwidth: '100%', height: '100%', pb: 4, textAlign: 'center', overflow: 'hidden' }} image={data?.lawyer?.cardImages ? data?.lawyer.cardImages : ''} />
            </Card> */}
            {/* <Divider sx={{ my: 5, mx: 6 }} /> */}
          </CardContent>
        </Card>
      </Grid>

    </Grid>
  )


}

export default RequestView
