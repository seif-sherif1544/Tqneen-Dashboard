// ** React Imports
import { useState, useEffect, forwardRef } from 'react'

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

// ** Third Party Imports
import format from 'date-fns/format'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchData, deleteInvoice } from 'src/store/apps/invoice'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import TableHeader from 'src/views/apps/invoice/list/TableHeader'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import baseUrl from 'src/API/apiConfig'
import { Button, MenuItem } from '@mui/material'
import { useForm } from 'react-hook-form'

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  fontSize: theme.typography.body1.fontSize,
  color: `${theme.palette.primary.main} !important`
}))

// ** Vars
const userStatusObj = {
  rejected: 'success',
  pending: 'primary',
  false: 'secondary'
}

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
    field: 'id',
    minWidth: 100,
    headerName: 'ID',
    renderCell: ({ row }) => (
      <Typography component={LinkStyled} href={`/appointments/Profile/${row?.id}`}>
        {`${row?.id}`}
      </Typography>
    )
  },
  {
    flex: 0.15,
    field: 'lawyer',
    minWidth: 100,
    headerName: 'Lawyer',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {row?.lawyer?.full_name}
            </Typography>
            <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
              {row?.lawyer?.phone}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    field: 'customer',
    minWidth: 100,
    headerName: 'Customer',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {row?.customer?.full_name}
            </Typography>
            <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
              {row?.customer?.phone}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 100,
    field: 'created data',
    headerName: 'Created Date',
    renderCell: ({ row }) => {
      const AppointmentData = new Date(row?.createdAt).toLocaleString()

      return <Typography sx={{ color: 'text.primary' }}>{AppointmentData}</Typography>
    }
  }
]
/* eslint-disable */
const CustomInput = forwardRef((props, ref) => {
  const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
  const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null
  const value = `${startDate}${endDate !== null ? endDate : ''}`
  props.start === null && props.dates.length && props.setDates ? props.setDates([]) : null
  const updatedProps = { ...props }
  delete updatedProps.setDates
  return <CustomTextField fullWidth inputRef={ref} {...updatedProps} label={props.label || ''} value={value} />
})

/* eslint-enable */
const AppointmentList = () => {
  // ** State
  const [dates, setDates] = useState([])
  const [value, setValue] = useState('')
  const [statusValue, setStatusValue] = useState('')
  const [endDateRange, setEndDateRange] = useState(null)
  const [selectedRows, setSelectedRows] = useState([])
  const [startDateRange, setStartDateRange] = useState(null)
  const [paginationModel, setPaginationModel] = useState({ page: 1, limit: 15, total: 0 })
  const [error, setError] = useState(null)
  const [data, setData] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(0)
  const [rowStatus, setRowStatus] = useState('')

  console.log('rowStatus', rowStatus)

  const handleFilter = val => {
    setValue(val)
  }

  const handleStatusValue = e => {
    setStatusValue(e.target.value)
  }

  const handleOnChangeRange = dates => {
    const [start, end] = dates
    if (start !== null && end !== null) {
      setDates(dates)
    }
    setStartDateRange(start)
    setEndDateRange(end)
  }

  const columns = [
    ...defaultColumns,
    {
      flex: 0.12,
      minWidth: 100,
      field: 'status',
      headerName: 'status',
      renderCell: ({ row }) => {
        const updatePaymentStatus = value => {
          // Make the API call to update the status
          axios
            .put(
              `${baseUrl}/api/appointments/${row?.id}`,
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
              setRowStatus(value)
              fetchData()

              // You can perform additional actions here if needed
            })
            .catch(error => {
              // Handle any network or API call errors
              console.error('Error:', error)

              // You can handle the error or show an error message to the user
            })
        }

        return (
          <>
            <CustomTextField
              select
              label=''
              value={row?.status}
              onChange={event => updatePaymentStatus(event.target.value)}
            >
              <MenuItem value='paid'>paid</MenuItem>
              <MenuItem value='accepted'>accepted</MenuItem>
              <MenuItem value='completed'>Completed</MenuItem>
              <MenuItem value='rejected'>rejected</MenuItem>
            </CustomTextField>
          </>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 140,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='View'>
            <IconButton
              size='small'
              component={Link}
              sx={{ color: 'text.secondary' }}
              href={`/appointments/Profile/${row?.id}`}
            >
              <Icon icon='tabler:eye' />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  useEffect(() => {
    fetchData()
  }, [paginationModel])

  const fetchData = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }

      const response = await axios.get(`${baseUrl}/api/appointments`, {
        headers,
        params: {
          page: paginationModel.page, // Use the correct page parameter
          limit: paginationModel.limit
        }
      })
      setRowStatus(response.data.docs.status)
      setCount(response.data.totalDocs)
      setData(response.data.docs)
      setPage(response.data.totalPages)
    } catch (error) {
      console.error(error)
      setError(error.message)
    }
  }

  const handlePageChange = params => {
    const newPage = params.page + 1 // Add 1 to match your backend page indexing
    setPaginationModel(prevState => ({
      ...prevState,
      page: newPage
    }))
  }
  if (error) {
    return <p>Error: {error}</p>
  }
  console.log('appointment data', data)
  if (error) {
    return <p>Error: {error}</p>
  }
  console.log(' appointment data', data)

  // const {
  //   control,
  //   handleSubmit,
  //   formState: { errors }
  // } = useForm({
  //   mode: 'onChange'
  // })

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Filters' />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  {/* <Box sx={{ display: 'flex', flexWrap: 'wrap', margin: 5 }} className='demo-space-x'>
                    <div>
                      <DatePickerWrapper
                        display={'flex'}
                        name='fromDate'
                        control={control}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        label='From'
                      />
                    </div>
                    <div>
                      <DatePickerWrapper
                        display={'flex'}
                        name='toDate'
                        control={control}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        label='To'
                      />
                    </div>
                    <Box sx={{ p: 5 }}>
                      <Button variant='contained'>Filter</Button>
                    </Box>
                  </Box> */}
                </Grid>
                <Grid item xs={12} sm={4}>
                  {/* <TableHeader value={value} selectedRows={selectedRows} handleFilter={handleFilter} /> */}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <DataGrid
              autoHeight
              rowHeight={62}
              rows={data}
              columns={columns}
              checkboxSelection
              disableRowSelectionOnClick
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              onRowSelectionModelChange={rows => setSelectedRows()}
              pagination
              rowsPerPageOptions={[10, 30, 50, 70, 100]}
              paginationMode='server'
              onPageChange={handlePageChange}
              rowCount={count}
              page={page}
              rowsPerPage={Number(paginationModel.limit)}
              pageSize={page}
            />
          </Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default AppointmentList
