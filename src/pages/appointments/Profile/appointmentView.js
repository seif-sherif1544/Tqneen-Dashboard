// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'

import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'


// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { useAsync } from 'src/hooks/useAsync'
import { useRouter } from 'next/router'
import axios from 'axios'
import Link from 'next/link'
import baseUrl from 'src/API/apiConfig'

const data = {
  id: 1,
  role: 'Lawyer',
  status: 'active',
  username: 'gslixby0',
  avatarColor: 'primary',
  country: 'El Salvador',
  company: 'Yotz PVT LTD',
  accepted: 'Manual - Cash',
  contact: '(479) 232-9151',
  avatar: '/images/avatars/3.png'
}

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

const statusColors = {
  true: 'success',
  pending: 'warning',
  false: 'secondary'
}

const UserViewLeft = () => {


  const router = useRouter()

  console.log(router);


  const { data, loading, execute } = useAsync((appiontd) => axios.get(`${baseUrl}/api/consultation/${appiontd}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }), { immediate: false })

  useEffect(() => {
    if (router.query.appiontd) {
      execute(router.query.appiontd)
    }
  }, [router]);

  console.log("router", router.query.appiontd);


  // ** States


  if (data) {
    return (
      <Grid container spacing={12}>
        <Grid item xs={12} lg={8}>
          <Card>
            <Typography sx={{ m: 8, fontWeight: 'bold', color: 'text.secondary', textAlign: 'center' }}>Consultation  Details </Typography>
            <CardContent sx={{ pb: 4 }}>
              <Box sx={{ pt: 4 }}>
                <Box sx={{ display: 'flex', mb: 3, alignItems: 'center' }}>
                  <Typography sx={{ mr: 2, fontWeight: 'bold', color: 'text.secondary', textAlign: 'center' }}>Consultation  Number :</Typography>
                  <Typography sx={{ color: 'text.secondary' }}> {data?.scheduleId} </Typography>
                </Box>
                <Box sx={{ mb: 3, mr: 2, fontWeight: 'bold', color: 'text.secondary ' }}>
                  <Typography sx={{ fontWeight: 'bold', color: 'text.secondary ' }} color={roleColors[data?.status]} >Consultation Status : {data?.status}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 'bold', color: 'text.secondary ' }}>Created at:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{new Date(data?.createdAt)?.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 'bold', color: 'text.secondary ' }}>updated at:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{new Date(data?.updatedAt).toLocaleString()}</Typography>
                </Box>
                {/* <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 'bold', color: 'text.secondary ' }}>Topic:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{data.topic.name.en} { }</Typography>
                </Box> */}
                {/* <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 'bold', color: 'text.secondary ' }}>specification:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{data?.specification.name.en} { }</Typography>
                </Box> */}
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 'bold', color: 'text.secondary ' }}>fees:</Typography>
                  <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>{data?.fees}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3, alignItems: 'center' }}>
                  <Typography sx={{ mr: 2, fontWeight: 'bold', color: 'text.secondary ', display: 'flex', gap: '4px' }}>Description: <Typography>{data?.lawyer?.bio} </Typography></Typography>
                </Box>
                {data?.status == "rejected" ? <Box sx={{ display: 'flex', mb: 3, alignItems: 'center' }}>
                  <Typography sx={{ mr: 2, fontWeight: 'bold', color: 'text.secondary ' }}>Rejected Reason: </Typography>
                  <Typography>{data?.rejectReason} </Typography>
                </Box> : ''}
                <Box sx={{ display: 'flex', mb: 3, alignItems: 'center' }}>
                  <Typography sx={{ mr: 2, fontWeight: 'bold', color: 'text.secondary' }}>Files:</Typography>
                  {data?.files.map((file, index) => (
                    <Typography key={index}>
                      <a href={file} target="_blank" rel="noopener noreferrer">
                        {file}
                      </a>
                    </Typography>
                  ))}
                </Box>
                <Box sx={{ display: 'flex', mb: 3, alignItems: 'center' }}>
                  <Typography sx={{ mr: 2, fontWeight: 'bold', color: 'text.secondary' }}>images:</Typography>
                  {data?.images.map((images, index) => (
                    <CustomAvatar key={index}
                      skin='light'
                      src={images}
                      sx={{ width: 100, height: 100, mb: 4, fontSize: '3rem' }}
                    >
                    </CustomAvatar>
                  ))}
                </Box>
                <Box sx={{ display: 'flex', mb: 3, alignItems: 'center' }}>
                  <Typography sx={{ mr: 2, fontWeight: 'bold', color: 'text.secondary ', display: 'flex', gap: '4px' }}>Canceled At: <Typography>{new Date(data?.canceledAt)?.toLocaleString()} </Typography></Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3, alignItems: 'center' }}>
                  <Typography sx={{ mr: 2, fontWeight: 'bold', color: 'text.secondary ', display: 'flex', gap: '4px' }}>Canceled By: <Typography>{data?.canceledBy} </Typography></Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }} >
              {data?.avatar ? (
                <CustomAvatar
                  src={data?.customer?.avatar}
                  variant='rounded'
                  alt={data?.customer?.full_name}
                  sx={{ width: 100, height: 100, mb: 4 }}
                  size='small'
                  component={Link}
                  href={`/Customer/Profile/${data?.customer?.id}`}
                />

              ) : (
                <CustomAvatar
                  skin='light'
                  component={Link}
                  href={`/Customer/Profile/${data?.customer?.id}`}
                  variant='rounded'
                  color={data?.avatarColor}
                  src={data?.customer?.avatar}
                  sx={{ width: 100, height: 100, mb: 4, fontSize: '3rem' }}
                >
                </CustomAvatar>
              )}
              <Typography variant='h4' sx={{ mb: 3 }}>
                {data?.customer?.full_name}
              </Typography>
              <Typography variant='p' sx={{ mb: 3 }}>
                {data?.customer?.phone}
              </Typography>
              <Typography sx={{ mb: 3 }} color={data?.customer?.is_active === true ? 'green' : 'red'}>
                {data?.customer?.is_active === true ? "Active" : "Not Active"}
              </Typography>
              <CustomChip
                rounded
                skin='light'
                size='small'
                label={data?.customer?.type}
                color={roleColors[data?.status]}
                sx={{ textTransform: 'capitalize' }}
              />
            </CardContent>
            <Divider sx={{ my: '2 !important', mx: 12 }} />
            <CardContent sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }} >
              {data?.lawyer?.avatar ? (
                <CustomAvatar
                  component={Link}
                  src={data?.lawyer?.avatar}
                  href={`/Lawyer/Profile/LawyerProfile/${data?.lawyer?.id}`}
                  variant='rounded'
                  alt={data?.lawyer?.full_name}
                  sx={{ width: 100, height: 100, mb: 4 }}
                />
              ) : (
                <CustomAvatar
                  skin='light'
                  variant='rounded'
                  component={Link}
                  href={`/Lawyer/Profile/LawyerProfile/${data?.lawyer?.id}`}
                  color={data?.avatarColor}
                  sx={{ width: 100, height: 100, mb: 4, fontSize: '3rem' }}
                >
                </CustomAvatar>
              )}
              <Typography variant='h4' sx={{ mb: 3 }}>
                {data?.lawyer?.full_name}
              </Typography>
              <Typography variant='p' sx={{ mb: 3 }}>
                {data?.lawyer?.phone}
              </Typography>
              <Typography sx={{ mb: 3 }} color={data?.lawyer?.is_active === true ? 'green' : 'red'}>
                {data?.lawyer?.is_active === true ? "Active" : "Not Active"}
              </Typography>
              <CustomChip
                rounded
                skin='light'
                size='small'
                label={data?.lawyer?.type}
                color={roleColors[data?.status]}
                sx={{ textTransform: 'capitalize' }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid >
    )
  } else {
    return null
  }
}

export default UserViewLeft
