// ** React Imports
import { useState, useEffect, forwardRef } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import TablePagination from '@mui/material/TablePagination'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
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
import DatePicker from 'react-datepicker'

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
  },
  {
    flex: 0.12,
    minWidth: 100,
    field: 'status',
    headerName: 'status',
    renderCell: ({ row }) => {
      return row?.status !== 0 ? (
        <Typography color=''>{row?.status}</Typography>
      ) : (
        <CustomChip rounded size='small' skin='light' color='success' label='not active' />
      )
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
const Pagination = () => {
  // ** State
  const [dates, setDates] = useState([])
  const [value, setValue] = useState('')
  const [statusValue, setStatusValue] = useState('')
  const [endDateRange, setEndDateRange] = useState(null)
  const [selectedRows, setSelectedRows] = useState([])
  const [startDateRange, setStartDateRange] = useState(null)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [error, setError] = useState(null)
  const [data, setData] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(0)

  console.log('this PAGE data', data.docs)

  // ** Hooks

  useEffect(() => {
    dispatch(
      fetchData({
        dates,
        q: value,
        status: statusValue
      })
    )
  }, [statusValue, value, dates])

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

  const column = [
    ...defaultColumns,
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
    const fetchData = async () => {
      try {
        const token =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTY1YTM1NjNhMjE2N2Q3NDUxNTRhZGEiLCJ0eXBlIjoiYWRtaW4iLCJpZCI6MSwiaWF0IjoxNzAyMzY2NDE0fQ.3bOsxc0tjcOThhsmUaUsw6lNIumDWp3H9sC8FjU1bcs'

        const headers = {
          Authorization: `Bearer ${token}`
        }

        const { page, pageSize } = paginationModel

        const response = await axios.get(`${baseUrl}/api/appointments`, {
          headers,
          params: {
            page,
            pageSize
          }
        })

        setCount(response.docs.totalDocs)
        setData(response.docs)
        console.log(setData)
      } catch (error) {
        console.error(error)
        setError(error.message)
      }
    }
  })

  if (error) {
    return <p>Error: {error}</p>
  }
  console.log('appointment data', data)
  if (error) {
    return <p>Error: {error}</p>
  }

  //handlePageChange to handle the page change event:
  const handlePageChange = (event, newPage) => {
    setPaginationModel(prevState => ({
      ...prevState,
      page: newPage
    }))
    setPage(newPage)
  }

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Filters' />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <DatePicker
                    isClearable
                    selectsRange
                    monthsShown={2}
                    endDate={endDateRange}
                    selected={startDateRange}
                    startDate={startDateRange}
                    shouldCloseOnSelect={false}
                    id='date-range-picker-months'
                    onChange={handleOnChangeRange}
                    customInput={
                      <CustomInput
                        dates={dates}
                        setDates={setDates}
                        label='Appointment DAte Filter'
                        end={endDateRange}
                        start={startDateRange}
                      />
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TableHeader value={value} selectedRows={selectedRows} handleFilter={handleFilter} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <DataGrid
              pagination
              rowsPerPageOptions={[10, 25, 50]}
              paginationMode='server'
              onPageChange={handlePageChange}
              rowCount={count}
              page={page}
              rowsPerPage={paginationModel.pageSize}
              components={{
                Pagination: TablePagination
              }}
            />
          </Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default Pagination
