// ** React Imports
// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import MenuItem from '@mui/material/MenuItem'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { boolean } from 'yup'
import baseUrl from 'src/API/apiConfig'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { CircularProgress, IconButton, InputAdornment, TextareaAutosize, TextField, Tooltip, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import Image from 'next/image'
import { Box } from '@mui/system'
import { DataGrid } from '@mui/x-data-grid'
import ReviewDetails from './ReviewDetails'
import durationDate from 'src/libs/duartionDate'


const TrackDetails = ({ open, onClose, trackId }) => {
  const [trackData, setTrackData] = useState([])

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewId, setReviewId] = useState("");
  const [openReview, setOpenReview] = useState(false);

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        setLoading(true);
        if (trackId !== "" && trackId !== undefined && trackId !== null) {
          const response = await axios.get(`${baseUrl}/api/admin/lawyerSessions/${trackId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          })

          setTrackData(response?.data?.lawyerSessions);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching city data:', error);
        toast.error(error?.message);
        setLoading(false);
      }
    };

    fetchCityData();
  }, [trackId]);


  const handleReviewOpen = (id) => {
    setOpenReview(true);
    setReviewId(id);
  }

  const handleCloseReview = useCallback(() => {
    setOpenReview(false)
  }, [])

  const RowOptions = ({ id }) => {


    // ** State
    const [anchorEl, setAnchorEl] = useState(null)
    const rowOptionsOpen = Boolean(anchorEl)

    const handleRowOptionsClick = event => {
      setAnchorEl(event.currentTarget)
    }

    const handleRowOptionsClose = () => {
      setAnchorEl(null)
    }



    return (
      <>
        <MenuItem
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          href={`/Lawyer/Profile/LawyerProfile/${id}`}

          // target="_blank"
          onClick={handleRowOptionsClose}
        >
          <Icon icon='tabler:eye' fontSize={20} />
        </MenuItem>
      </>
    )
  }

  const handleAddClose = () => {
    // Perform any necessary actions before closing the dialog
    onClose()
    setError('')
  }

  const columns = [
    {
      flex: 0.1,
      minWidth: 200,
      field: 'id',
      headerName: 'Customer Name',
      headerClassName: 'super-app-theme--header',
      renderHeader: () => <Typography sx={{
        fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',
      }}>{'Customer Name'}</Typography>,
      renderCell: ({ row }) => {
        // const { first_name, last_name, email } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', color: '#000' }}>
            {/* {renderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                component={Link}
                href={`/Lawyer/Profile/LawyerProfile/${row?.id}`}
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {first_name} {last_name}
              </Typography>
              <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                {email}
              </Typography>
            </Box> */}
            <Typography noWrap sx={{ fontWeight: 500, color: '#000', textTransform: 'capitalize' }}>
              {row?.customerDetails?.full_name}
            </Typography>

          </Box>
        )
      }
    },
    {
      flex: 0.10,
      minWidth: 100,
      headerName: 'Status',
      field: 'status',
      headerClassName: 'super-app-theme--header',
      renderHeader: () => <Typography sx={{
        fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',
      }}>{'Status'}</Typography>,
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: '#000', textTransform: 'capitalize' }}>
            {row?.status}
          </Typography>
        )
      }
    },
    {
      flex: 0.10,
      minWidth: 100,
      headerName: 'Duration',
      field: 'numberOfConsultations',
      headerClassName: 'super-app-theme--header',
      renderHeader: () => <Typography sx={{
        fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',
      }}>{'Duration'}</Typography>,
      renderCell: ({ row }) => {

        const durationInDays = durationDate(row?.startTime, row?.endTime)

        return (
          <Typography noWrap sx={{ fontWeight: 500, color: '#000', textTransform: 'capitalize' }}>
            {durationInDays}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 100,
      headerName: 'Started At',
      headerClassName: 'super-app-theme--header',
      field: 'startTime',
      renderHeader: () => <Typography sx={{
        fontSize: '18px', color: '#161616', fontWeight: 700,
        textWrap: 'wrap'
      }}>{'Started At'}
      </Typography>,
      renderCell: ({ row }) => {
        const startDate = new Date(row?.startTime);
        const formattedDateTime = `${startDate?.getFullYear()}-${String(startDate?.getMonth() + 1).padStart(2, '0')}-${String(startDate?.getDate()).padStart(2, '0')} ${String(startDate?.getHours()).padStart(2, '0')}:${String(startDate?.getMinutes()).padStart(2, '0')}:${String(startDate?.getSeconds()).padStart(2, '0')}`;


        return (
          <Typography noWrap sx={{ fontWeight: 500, color: '#000', textTransform: 'capitalize' }}>
            {formattedDateTime}
          </Typography>
        )
      }
    },
    {
      flex: 0.10,
      minWidth: 100,
      headerName: 'Type',
      headerClassName: 'super-app-theme--header',
      field: 'scheduleDetails',
      renderHeader: () => <Typography sx={{
        fontSize: '18px', color: '#161616', fontWeight: 700,
        textWrap: 'wrap'
      }}>{'Type'}</Typography>,
      renderCell: ({ row }) => {


        return (
          <Typography noWrap sx={{ fontWeight: 500, color: '#000', textTransform: 'capitalize' }}>
            {row?.scheduleDetails?.type}
          </Typography>
        )
      }
    },
    {
      flex: 0.10,
      minWidth: 100,
      headerName: 'Rate (AVG)',
      headerClassName: 'super-app-theme--header',
      field: 'avgRating',
      renderHeader: () => <Typography sx={{
        fontSize: '17px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',
      }}>{'Rate (AVG)'}</Typography>,
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: '#000', textTransform: 'capitalize' }}>
            {row?.customerRatings[0]?.rating}
          </Typography>
        )
      }
    },


    {
      flex: 0.15,
      minWidth: 50,
      sortable: true,
      field: 'actions',
      headerClassName: 'super-app-theme--header',
      headerName: 'Customer Review',
      renderHeader: () => <Typography sx={{
        fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',
      }}>{'Customer Review'}</Typography>,
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Review Details'>
              <IconButton size='small' sx={{ color: 'text.labelBlack' }} onClick={() => handleReviewOpen(trackData?.id)}>
                <Icon icon='ph:eye' />
              </IconButton>
            </Tooltip>
          </Box>
        )
      }
    }
  ]



  if (true) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <Dialog
              open={open}
              onClose={onClose}
              aria-labelledby='user-view-edit'
              aria-describedby='user-view-edit-description'
              sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 1200 } }}
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
                Lawyer's Sessions
                <IconButton
                  size='large'
                  sx={{ color: 'text.secondary', padding: '0px' }}
                  onClick={onClose}
                >
                  <Icon icon='ic:round-close' fontSize='2rem' color={"#BA1F1F"} />
                </IconButton>
              </DialogTitle>
              {/* loading === false && trackData?._id) */}
              {true ? (

                <DialogContent
                  sx={{
                    pb: theme => `${theme.spacing(8)} !important`,
                    px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(10)} !important`]
                  }}
                >
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: "center",
                    marginBottom: '1rem'
                  }}>
                    <Typography sx={{
                      fontSize: '1.625rem',
                      color: '#000',
                      marginRight: '0.8rem'
                    }}>{trackData[0]?.first_name}{" "}{trackData[0]?.last_name}</Typography>
                    <Typography sx={{
                      fontSize: '1.625rem',
                      color: '#000'
                    }}>{trackData[0]?.ratings?.rating}</Typography>
                    <Icon icon='solar:star-bold' color={"#FFCA10"} fontSize={20} />
                  </Box>
                  <DataGrid
                    autoHeight

                    rowHeight={62}
                    rows={trackData[0]?.consultations ?? []}
                    columns={columns}
                    disableRowSelectionOnClick
                    getRowId={(row) => row?._id} // Specify the custom ID function
                    // pageSizeOptions={[10, 25, 50]}
                    // paginationModel={paginationModel}
                    // onPaginationModelChange={setPaginationModel}
                    loading={loading}
                    hideFooterPagination={true}

                    // rowCount={totalCounts}

                    sx={{
                      '& .super-app-theme--header': {
                        backgroundColor: '#FFFFFF00',

                      },

                    }}
                  />
                </DialogContent>) : (
                <DialogContent>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '5rem', paddingBottom: '5rem' }}>
                    <CircularProgress size={80} />
                  </Box>
                </DialogContent>
              )}
            </Dialog>
          </Card>
          <ReviewDetails open={openReview} onClose={handleCloseReview} reviewId={reviewId} />
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default TrackDetails
