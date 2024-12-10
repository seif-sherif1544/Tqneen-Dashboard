// ** React Imports
import { useState, useEffect, forwardRef, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { Button } from '@mui/material'

import { Controller, useForm } from 'react-hook-form'

import UserSuspendDialog from './UserSuspendDialog'
import CustomTextField from 'src/@core/components/mui/text-field'
import axios from 'axios'
import baseUrl from 'src/API/apiConfig'
import { format } from 'date-fns'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const renderClient = row => {
  if (row?.avatar?.length) {
    return <CustomAvatar src={row?.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={row?.avatarColor}
        sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
      >
        {getInitials(row?.fullName ? row?.fullName : 'John Doe')}
      </CustomAvatar>
    )
  }
}

const PaymentList = () => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [data, setData] = useState([])
  const [lawyer, setLawyerId] = useState([])
  const [percent, setPercentData] = useState()
  const [fromDate, setFromDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [toDate, setToDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [paymentFilter, setPaymentFilter] = useState({})

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onChange'
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/admin/appointments/total`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      setData(response.data)
      const ids = response.data.map(item => item.id)
      console.log('ids', ids)
      console.log('data', response.data)
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleFilter = async data => {
    console.log('data', data)

    // setPaymentFilter({
    //   ...(data?.fromDate && { from: format(data.fromDate, "yyyy-MM-dd") }),
    //   ...(data?.toDate && { to: format(data.toDate, "yyyy-MM-dd") }),
    //   ...(data?.percent && { status: data.percent })
    // });

    setFromDate(format(data.fromDate, 'yyyy-MM-dd'))
    setToDate(format(data.toDate, 'yyyy-MM-dd'))
    setPercentData(data.percent)

    const url = `${baseUrl}/api/admin/appointments/total`

    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }

      const response = await axios.get(url, {
        headers,
        params: {
          ...(data?.fromDate && { from: format(data.fromDate, 'yyyy-MM-dd') }),
          ...(data?.toDate && { to: format(data.toDate, 'yyyy-MM-dd') }),
          ...(data?.percent && { percent: Number(data.percent) })
        }
      })
      setData(response.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const AddSettlement = async id => {
    const SettlementResponse = await axios.get(`${baseUrl}/api/admin/appointments/all`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      params: {
        from: fromDate,
        to: toDate,
        lawyer: id
      }
    })
    const Settlement = SettlementResponse.data

    const idArray = []
    for (const obj of Settlement) {
      idArray.push(obj.id)
    }
    console.log('all id', idArray)
    SettlementDone(idArray)
  }

  const SettlementDone = async idArray => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/admin/appointments/settle`,
        {
          appointments: idArray
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      fetchData()

      // Handle the response as needed
      console.log('dfdsfdsfdssdfsdfs', response.data)
    } catch (error) {
      // Handle errors
      console.error(error)
    }
  }

  const columns = [
    {
      flex: 1,
      minWidth: 280,
      field: 'Lawyer Name',
      headerName: 'Lawyer Name',
      renderCell: ({ row }) => {
        const { full_name } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                component={Link}
                href=''
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {full_name}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 2,
      field: 'Total Fees',
      minWidth: 170,
      headerName: 'Total Fees',
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'success.main', textTransform: 'capitalize' }}>
              {row?.totalFees}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 1.25,
      field: 'Net Fees',
      minWidth: 170,
      headerName: 'Net Fees',
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'red', textTransform: 'capitalize' }}>
              {row?.totalFeesAfterSubtractingPercentage}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 1,
      minWidth: 120,
      headerName: 'Settlement',
      field: 'Settlement',
      renderCell: ({ row }) => {
        return (
          <Button color='error' variant='tonal' onClick={() => AddSettlement(row?.id)}>
            Settle
          </Button>
        )
      }
    },
    {
      flex: 1,
      minWidth: 100,
      headerName: 'Action',
      field: 'Action',
      renderCell: ({ row }) => {
        return (
          <Typography
            noWrap
            sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}
            component={Link}
            href={`/payment/allConsultations?from=${fromDate}&to=${toDate}&lawyer=${row?.id}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            All Consultation
          </Typography>
        )
      }
    }
  ]

  const CustomInput = forwardRef(({ ...props }, ref) => {
    return <CustomTextField inputRef={ref} {...props} />
  })

  return (
    <Grid container spacing={6.5}>
      {/* <UserSuspendDialog open={suspendDialogOpen} setOpen={setSuspendDialogOpen} /> */}
      <Grid item xs={12}>
        <Card>
          <form onSubmit={handleSubmit(handleFilter)}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', margin: 5 }} className='demo-space-x'>
              <div>
                <DatePickerWrapper display={'flex'}>
                  <Controller
                    name='fromDate'
                    defaultValue={new Date().setMonth(new Date().getMonth() - 1)}
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
                    name='toDate'
                    defaultValue={new Date()}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <DatePicker
                        id='toDate'
                        onChange={onChange}
                        selected={value}
                        autoComplete='off'
                        customInput={<CustomInput label='To' />}
                      />
                    )}
                  />
                </DatePickerWrapper>
              </div>
              <div>
                <Controller
                  name='percent'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      sx={{ mb: 4 }}
                      label='percent'
                      onChange={onChange}
                      placeholder=''
                    />
                  )}
                />
              </div>
              <Box sx={{ p: 5 }}>
                <Button
                  type='submit'
                  variant='contained'
                  sx={{
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#1068A8',
                      color: 'white'
                    }
                  }}
                >
                  Filter
                </Button>
              </Box>
            </Box>
          </form>
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={data}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default PaymentList
