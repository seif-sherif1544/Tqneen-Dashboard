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
import DatePicker from 'react-datepicker'

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
import { Controller, useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

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
              {row?.phone}
            </Typography>
          </Box>
        </Box>
      )
    }
  },

  {
    flex: 0.15,
    field: 'Appointment Fees',
    minWidth: 100,
    headerName: 'Appointment Fees',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap variant='body1' sx={{ color: 'text.secondary' }}>
              {row?.fees}
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
const CustomInput = forwardRef(({ ...props }, ref) => {
  return <CustomTextField inputRef={ref} {...props} />
})

/* eslint-enable */
const PaymentsList = () => {
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

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onChange'
  })

  // ** Hooks
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(
      fetchData({
        dates,
        q: value,
        status: statusValue
      })
    )
  }, [dispatch, statusValue, value, dates])

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

  const columns = [...defaultColumns]

  const router = useRouter()
  const { query } = router
  const { from, to, lawyer } = query

  useEffect(() => {
    const fetchData = async () => {
      const url = `${baseUrl}/api/admin/appointments/all`

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          params: {
            from,
            to,
            lawyer
          }
        })

        const responseData = response.data

        console.log('comeleted appointment', responseData)

        const idArray = []

        for (const obj of responseData) {
          idArray.push(obj.id)
        }
        console.log(idArray)
        setData(responseData)
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchData()
  }, [from, to, lawyer])

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

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          {/* <Card>
            <CardHeader title='Filters' />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <TableHeader value={value} selectedRows={selectedRows} handleFilter={handleFilter} />
                </Grid>
              </Grid>
            </CardContent>
          </Card> */}
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

export default PaymentsList
