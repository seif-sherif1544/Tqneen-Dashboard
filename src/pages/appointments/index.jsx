// ** React Imports
import { useState, useEffect, forwardRef, useCallback } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store & Actions Imports

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Styled Components
import baseUrl from 'src/API/apiConfig'
import { Controller, useForm } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Button, MenuItem, Select } from '@mui/material'
import { useAsync } from 'src/hooks/useAsync'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import DeleteData from 'src/@core/components/topics/DeleteData'
import { convertJsonToExcel } from 'src/@core/utils/convertToExcelFile'
import BookingDetails from '../components/bookings/BookingDetails'

// ** Styled component for the link in the dataTable

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  fontSize: theme.typography.body1.fontSize,
  color: `${theme.palette.primary.main} !important`
}))

// ** renders client column
const renderClient = row => {
  return (
    <CustomAvatar
      skin='light'
      color={row?.avatarColor || 'primary'}
      sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
    >
      {getInitials(row?.name || 'John Doe')}
    </CustomAvatar>
  )
}

const defaultColumns = [
  {
    flex: 0,
    field: '_id',
    minWidth: 100,
    headerClassName: 'super-app-theme--header',
    headerName: 'ID',
    renderHeader: () => (
      <Typography
        sx={{
          fontSize: '18px',
          color: '#161616',
          fontWeight: 700,
          lineHeight: '23.4px'
        }}
      >
        {'ID'}
      </Typography>
    ),
    renderCell: ({ row }) => <Typography sx={{ color: '#000' }}>#{`${row?._id?.slice(0, 3)}`}</Typography>
  },
  {
    flex: 0.11,
    field: 'lawyerId',
    headerClassName: 'super-app-theme--header',
    minWidth: 100,
    headerName: 'Lawyer ID',
    renderHeader: () => (
      <Typography
        sx={{
          fontSize: '18px',
          color: '#161616',
          fontWeight: 700,
          lineHeight: '23.4px'
        }}
      >
        {'Lawyer ID'}
      </Typography>
    ),
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: '#000', fontWeight: 500 }}>
            {row?.lawyerId}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    field: 'lawyerDetails',
    headerClassName: 'super-app-theme--header',
    minWidth: 100,
    headerName: 'Lawyer Name',
    renderHeader: () => (
      <Typography
        sx={{
          fontSize: '18px',
          color: '#161616',
          fontWeight: 700,
          lineHeight: '23.4px'
        }}
      >
        {'Lawyer Name'}
      </Typography>
    ),
    filterable: true,
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: '#000', fontWeight: 500 }}>
            {row?.lawyerDetails?.full_name}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 100,
    headerClassName: 'super-app-theme--header',
    field: 'createdAt',
    headerName: 'Date&Time',
    renderHeader: () => (
      <Typography
        sx={{
          fontSize: '18px',
          color: '#161616',
          fontWeight: 700,
          lineHeight: '23.4px'
        }}
      >
        {'Date&Time'}
      </Typography>
    ),
    renderCell: ({ row }) => {
      const AppointmentData = new Date(row?.createdAt)?.toLocaleString()

      return <Typography sx={{ color: '#000' }}>{AppointmentData}</Typography>
    }
  }
]

const AppointmentList = () => {
  // ** State
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [filters, setFilters] = useState({})
  const [FromDate, setFromDate] = useState({})
  const [ToDate, settToDate] = useState({})
  const [rowStatus, setRowStatus] = useState('')
  const [loadStatus, setLoadStatus] = useState(true)
  const [value, setValue] = useState('')
  const [openDelete, setOpenDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [statusValue, setStatusValue] = useState('')

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onChange'
  })

  const handleFilter = useCallback(val => {
    setValue(val)
    setPaginationModel({ page: 0, pageSize: paginationModel.pageSize })
  }, [])

  const { page, pageSize } = paginationModel

  const handleOpenDelete = id => {
    setOpenDelete(true)
    setDeleteId(id)
  }

  const {
    data,
    execute: fetchData,
    loading,
    error
  } = useAsync(
    params =>
      axios.get(
        `${baseUrl}/api/admin/booking?page=${page + 1}&limit=${pageSize}&search=${value}&status=${statusValue}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      ),
    { immediate: true }
  )

  const updatePaymentStatus = (id, value) => {
    // Make the API call to update the status
    axios
      .post(
        `${baseUrl}/api/consultation/approve/${id}`,
        { status: value },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      .then(response => {
        // Handle the response
        console.log('Status updated')
        toast.success('Status Updated successfully')
        setRowStatus(value)
        fetchData()

        // You can perform additional actions here if needed
      })
      .catch(error => {
        // Handle any network or API call errors
        console.error('Error:', error)
        toast.error(error?.message)

        // You can handle the error or show an error message to the user
      })
  }

  useEffect(() => {
    fetchData()
  }, [page, statusValue, value]) // Call the run function to fetch data

  const handleStatus = useCallback(val => {
    setStatusValue(val)
    setPaginationModel({ page: 0, pageSize: paginationModel.pageSize })
  }, [])

  const deleteConsultation = async () => {
    setIsDeleting(true)
    try {
      if (deleteId !== '' && deleteId !== null && deleteId !== undefined) {
        const response = await axios.delete(`${baseUrl}/api/consultation/cancel/${deleteId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
      }
      if (response?.status === 200) {
        toast.success('deleted Succesfully')
        setIsDeleting(false)
        fetchData()
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message)
      setIsDeleting(false)
    }
  }

  const handlePageChange = async paginationData => {
    console.log('handlePageChange', paginationData)

    await execute({ page: paginationData?.page + 1, pageSize: pageSize, filters })
  }

  if (error) {
    return <p>Error: {error?.message}</p>
  }

  const onSubmit = data => {
    setFilters(
      Object.assign(
        data?.fromDate ? { from: format(data.fromDate, 'yyyy-MM-dd') } : {},
        data?.toDate ? { to: format(data.toDate, 'yyyy-MM-dd') } : {},
        data?.status ? { status: data?.status } : {}
      )
    )
    setFromDate(data.fromDate)
    settToDate(data.toDate)

    execute({
      page: 1,
      pageSize: pageSize,
      filters: Object.assign(
        data?.fromDate ? { from: format(data.fromDate, 'yyyy-MM-dd') } : {},
        data?.toDate ? { to: format(data.toDate, 'yyyy-MM-dd') } : {},
        data?.status ? { status: data?.status } : {}
      )
    })
  }

  const CustomInput = forwardRef(({ ...props }, ref) => {
    return <CustomTextField inputRef={ref} {...props} />
  })

  const columns = [
    ...defaultColumns,
    {
      flex: 0.15,
      minWidth: 100,
      headerClassName: 'super-app-theme--header',
      field: 'price',
      headerName: 'Price',
      renderHeader: () => (
        <Typography
          sx={{
            fontSize: '18px',
            color: '#161616',
            fontWeight: 700,
            lineHeight: '23.4px'
          }}
        >
          {'Price'}
        </Typography>
      ),
      renderCell: ({ row }) => {
        return <Typography sx={{ color: 'text.primary' }}>{row?.fess || 'No Data'}</Typography>
      }
    },
    {
      flex: 0.1,
      minWidth: 100,
      headerClassName: 'super-app-theme--header',
      headerName: 'Status',
      field: 'status',
      renderHeader: () => (
        <Typography
          sx={{
            fontSize: '18px',
            color: '#161616',
            fontWeight: 700,
            lineHeight: '23.4px'
          }}
        >
          {'Status'}
        </Typography>
      ),
      renderCell: ({ row }) => {
        return (
          <Typography
            noWrap
            sx={{
              fontWeight: 500,
              color:
                row?.status === 'available' || row?.status === 'completed'
                  ? '#55C98B'
                  : row?.status === 'pending'
                  ? '#1068A880'
                  : '#AC3434',
              textTransform: 'capitalize'
            }}
          >
            {row?.status}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 140,
      sortable: false,
      field: 'actions',
      headerClassName: 'super-app-theme--header',
      headerName: 'Actions',
      renderHeader: () => (
        <Typography
          sx={{
            fontSize: '18px',
            color: '#161616',
            fontWeight: 700,
            lineHeight: '23.4px'
          }}
        >
          {'Actions'}
        </Typography>
      ),
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='View'>
            <IconButton size='small' onClick={() => handleOpenDelete(row?._id)} sx={{ color: '#000' }}>
              <Icon icon='ph:eye' />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  const changeRowDataKeys = data => {
    const newArr = data?.map(obj => {
      const newObj = {}

      //You have to add a condition on the Object key name and perform your actions

      Object.keys(obj).forEach(key => {
        if (key === '_id') {
          newObj._id = obj._id
        } else if (key === 'lawyerDetails') {
          newObj.lawyerDetails = {
            id: obj?.lawyerDetails?.id || '',
            full_name: obj?.lawyerDetails?.full_name || ''
          }
        } else if (key === 'createdAt') {
          newObj.createdAt = obj?.createdAt
        } else if (key === 'price') {
          newObj.price = obj?.price
        } else if (key === 'status') {
          newObj.status = obj?.status
        } else {
          newObj[key] = obj[key]
        }
      })
      let keys = []
      Object.keys(newObj).forEach(key => {
        keys.push(key)
      })
      const order = ['_id', 'lawyerDetails', 'createdAt', 'status', 'price']

      const newOrderdObj = order.reduce((obj, key) => {
        if (!newObj[key]) {
          obj[key] = 'N/A'
        } else {
          obj[key] = newObj[key]
        }

        return obj
      }, {})

      return newOrderdObj
    })

    return newArr
  }
  const onBtnExport = () => convertJsonToExcel(changeRowDataKeys(data?.consultations?.docs), 'appointments')

  return (
    <Grid container spacing={12}>
      <Grid item xs={12}>
        <Card>
          <Box
            sx={{
              py: 4,
              px: 6,
              rowGap: 2,
              columnGap: 4,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant='h1' sx={{ fontSize: '2rem', fontWeight: 400, color: '#000' }}>
                Consultations
              </Typography>
            </Box>
            <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}>
              <CustomTextField
                value={value}
                InputProps={{
                  startAdornment: <Icon icon={'mynaui:search'} color={'#64656980'} fontSize={'1.6rem'} />
                }}
                placeholder='Search'
                onChange={e => handleFilter(e.target.value)}
              />
              <Button
                sx={{
                  border: '1px solid #64656980',
                  borderRadius: '4px',
                  py: '14px',
                  px: '16px',
                  color: '#64656980'
                }}
                variant='outlined'
                startIcon={<Icon icon='tabler:upload' />}
                onClick={() => onBtnExport()}
                disabled={!data?.consultations?.docs}
              >
                Export
              </Button>
              <Select
                IconComponent={'span'}
                displayEmpty
                sx={{
                  paddingRight: 0,
                  marginRight: 2,

                  '& .MuiSelect-select': {
                    display: 'flex',
                    justifyContent: 'flex-end'
                  },
                  '& .css-1ukp3w4-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select': {
                    minWidth: '4rem !important',
                    padding: '14.5px 14px'
                  }
                }}
                defaultValue={'Filter'}
                onChange={e => handleStatus(e?.target?.value)}
                renderValue={value => {
                  return (
                    <Box sx={{ display: 'flex', gap: 1, paddingLeft: '0px', color: '#64656980' }}>
                      <Icon icon='hugeicons:menu-08' />
                      {value}
                    </Box>
                  )
                }}
              >
                <MenuItem value=''>Reset</MenuItem>
                <MenuItem value='available'>Available</MenuItem>
                <MenuItem value='reserved'>Reserved</MenuItem>
                <MenuItem value='pending'>Pending</MenuItem>
                <MenuItem value='canceled'>Canceled</MenuItem>
                <MenuItem value='completed'>Completed</MenuItem>
              </Select>
            </Box>
          </Box>
        </Card>
      </Grid>
      {/* <Grid item xs={12}>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader title='Filters' />
            <CardContent display={'flex'}>
              <Grid container item xs={12} sm={12} justifyContent={'start'} gap={10}>
                <div>
                  <DatePickerWrapper display={'flex'}>
                    <Controller
                      name='fromDate'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <DatePicker
                          id='fromDate'
                          onChange={onChange}
                          selected={value}
                          autoComplete='off'
                          customInput={<CustomInput label='From' />}
                        />
                      )}
                    />
                  </DatePickerWrapper>
                </div>
                <div>
                  <DatePickerWrapper display={'flex'}>
                    <Controller
                      rules={{
                        validate: (value, fields) => {
                          if (fields && fields?.fromDate && fields.fromDate > value)
                            return 'from date must be less than to date'
                        }
                      }}
                      name='toDate'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <DatePicker
                          id='toDate'
                          onChange={onChange}
                          selected={value}
                          autoComplete='off'
                          customInput={
                            <CustomInput
                              label='To'
                              error={Boolean(errors.toDate)}
                              helperText={errors.toDate?.message}
                              {...(errors.toDate && { helperText: errors.toDate.message })}
                            />
                          }
                        />
                      )}
                    />
                  </DatePickerWrapper>
                </div>
                <div>
                  <Controller
                    name='status'
                    control={control}
                    defaultValue=''
                    render={({ field: { onChange, ...rest } }) => (
                      <CustomTextField select sx={{ mb: 4 }} fullWidth onChange={onChange} label='Status' {...rest}>
                        <MenuItem></MenuItem>
                        {['available', 'reserved', 'pending', 'canceled', 'completed']?.map(status => (
                          <MenuItem key={status} value={status}>
                            {status?.replace(/\b\w/g, match => match?.toUpperCase())}
                          </MenuItem>
                        ))}
                      </CustomTextField>
                    )}
                  />
                </div>
                <Box sx={{ p: 5 }}>
                  <Button
                    type='submit'
                    variant='contained'
                    sx={{
                      color: '#fff',
                      '&:hover': {
                        color: '#fff',
                        backgroundColor: '#1174bb'
                      }
                    }}
                  >
                    Filter
                  </Button>
                </Box>
              </Grid>
            </CardContent>
          </form>
        </Card>
      </Grid> */}
      <Grid item xs={12}>
        <Card>
          <DataGrid
            loading={loading}
            autoHeight
            rowHeight={62}
            rows={data?.consultations?.docs ?? []}
            columns={columns}
            disableRowSelectionOnClick
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pagination
            paginationMode='server'
            rowCount={data?.consultations?.totalDocs}
            rowsPerPage={15}
            getRowId={row => row?._id} // Specify the custom ID function
            sx={{
              '& .super-app-theme--header': {
                backgroundColor: '#EFF5FA'
              }
            }}
          />
        </Card>
      </Grid>
      <BookingDetails open={openDelete} setOpenDetails={setOpenDelete} bookingId={deleteId} />

      {/* <DeleteData
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        isDeleting={isDeleting}
        deleteSubmit={deleteConsultation}
        title={'Delete Consultation'}
        text={'Do you want To delete this consultation'}
      /> */}
    </Grid>
  )
}

export default AppointmentList
