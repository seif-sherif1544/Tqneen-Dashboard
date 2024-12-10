// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomTextField from 'src/@core/components/mui/text-field'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { fetchData, deleteUser } from 'src/store/apps/user'

// ** Third Party Components
import axios from 'axios'

// ** Custom Table Components Imports
import TableHeader from './TableHeader'
import AddCustomer from 'src/pages/Customer/AddCustomer'
import baseUrl from 'src/API/apiConfig'
import { convertJsonToExcel } from 'src/@core/utils/convertToExcelFile'
import { Button, Select, Tooltip } from '@mui/material'
import toast from 'react-hot-toast'

// ** renders client column

const userStatusObj = {
  true: 'success',
  pending: 'warning',
  false: 'secondary'
}

// ** renders client column
const renderClient = row => {
  if (row?.avatar) {
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

const RowOptions = ({ id }) => {
  // ** Hooks
  const dispatch = useDispatch()

  // ** State
  const [anchorEl, setAnchorEl] = useState(null)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    dispatch(deleteUser(id))
    handleRowOptionsClose()
  }

  const toggleAddCustomer = () => {
    setAddUserOpen(!addUserOpen)
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='tabler:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem component={Link} sx={{ '& svg': { mr: 2 } }} href='#' onClick={handleRowOptionsClose}>
          <Icon icon='tabler:eye' fontSize={20} />
          View
        </MenuItem>
      </Menu>

      <AddCustomer open={addUserOpen} toggle={toggleAddCustomer} />
    </>
  )
}

const columns = [
  {
    flex: 0.1,
    minWidth: 200,
    headerClassName: 'super-app-theme--header',
    field: 'id',
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
          #{row?.id}
        </Box>
      )
    }
  },
  {
    flex: 0.25,
    minWidth: 280,
    field: 'first_name',
    headerClassName: 'super-app-theme--header',
    headerName: 'Name',
    renderHeader: () => (
      <Typography
        sx={{
          fontSize: '18px',
          color: '#161616',
          fontWeight: 700,
          lineHeight: '23.4px'
        }}
      >
        {'Name'}
      </Typography>
    ),
    renderCell: ({ row }) => {
      const { first_name, last_name, email } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography
              noWrap
              component={Link}
              href='#'
              sx={{
                fontWeight: 500,
                textDecoration: 'none',
                color: '#000',
                '&:hover': { color: '#000' }
              }}
            >
              {first_name} {last_name}
            </Typography>
            <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
              {email}
            </Typography>
          </Box>
        </Box>
      )
    }
  },

  {
    flex: 0.2,
    minWidth: 120,
    headerName: 'email',
    headerClassName: 'super-app-theme--header',
    field: 'email',
    renderHeader: () => (
      <Typography
        sx={{
          fontSize: '18px',
          color: '#161616',
          fontWeight: 700,
          lineHeight: '23.4px'
        }}
      >
        {'Email'}
      </Typography>
    ),
    renderCell: ({ row }) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: '#000', textTransform: 'capitalize', textWrap: 'wrap' }}>
          {row?.email}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 190,
    field: 'phone',
    headerName: 'phone',
    headerClassName: 'super-app-theme--header',
    renderHeader: () => (
      <Typography
        sx={{
          fontSize: '18px',
          color: '#161616',
          fontWeight: 700,
          lineHeight: '23.4px'
        }}
      >
        {'Phone'}
      </Typography>
    ),
    renderCell: ({ row }) => {
      return (
        <Typography noWrap sx={{ color: 'text.secondary' }}>
          {row?.phone}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    headerClassName: 'super-app-theme--header',
    field: 'is_active',
    renderHeader: () => (
      <Typography
        sx={{
          fontSize: '18px',
          color: '#161616',
          fontWeight: 700,
          lineHeight: '23.4px'
        }}
      >
        {'IsActive'}
      </Typography>
    ),
    headerName: 'Is Active',
    renderCell: ({ row }) => {
      return (
        <CustomChip
          rounded
          skin='light'
          size='small'
          label={row?.is_active === true ? 'active' : 'Not Active'}
          color={userStatusObj[row?.is_active]}
          sx={{ textTransform: 'capitalize' }}
        />
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 140,
    sortable: true,
    headerClassName: 'super-app-theme--header',
    field: 'actions',
    headerName: 'Details',
    renderHeader: () => (
      <Typography
        sx={{
          fontSize: '18px',
          color: '#161616',
          fontWeight: 700,
          lineHeight: '23.4px'
        }}
      >
        {'Details'}
      </Typography>
    ),
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            size='small'
            component={Link}
            sx={{ color: 'text.secondary' }}
            href={`/Customer/Profile/${row?.id}`}
          >
            <Icon icon='tabler:eye' />
          </IconButton>
          <Tooltip title={row?.otp || 'Not Found'}>
            {/* <Link href={`/editcityid/${row.id}`}> */}
            <IconButton size='small'>
              <Icon icon='teenyicons:otp-outline' color='#000' fontSize='1.2rem' />
            </IconButton>
            {/* </Link> */}
          </Tooltip>
        </Box>
      )
    }
  }
]

const Customer = ({ apiData }) => {
  // ** State
  const [role, setRole] = useState('')
  const [plan, setPlan] = useState('')
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [totalCounts, setTotalCounts] = useState(0)
  const [statusValue, setStatusValue] = useState('')
  const [loading, setLoading] = useState(false)

  // ** Hooks
  const dispatch = useDispatch()
  useEffect(() => {}, [dispatch, plan, role, status, value])

  const handleFilter = useCallback((val, status) => {
    setValue(val)
    setPaginationModel({ page: 0, pageSize: paginationModel.pageSize })
  }, [])

  const handleRoleChange = useCallback(e => {
    setRole(e.target.value)
  }, [])

  const handlePlanChange = useCallback(e => {
    setPlan(e.target.value)
  }, [])

  const handleStatusChange = useCallback(e => {
    setStatus(e.target.value)
  }, [])

  const toggleAddCustomer = () => setAddUserOpen(!addUserOpen)

  const fetchData = async () => {
    setLoading(true)
    try {
      const { page, pageSize } = paginationModel

      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }

      const response = await axios.get(
        `${baseUrl}/api/admin/users?type=customer&page=${
          page + 1
        }&limit=${pageSize}&search=${value}&status=${statusValue}`,
        { headers }
      )

      setData(response?.data?.docs)
      if (response?.data?.totalDocs) {
        setTotalCounts(response?.data?.totalDocs)
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
      setError(error.message)
      toast.error(error?.response?.data?.message)
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchData()
  }, [paginationModel, value, statusValue])

  useEffect(() => {
    setPaginationModel({ page: 0, pageSize: paginationModel.pageSize })
  }, [statusValue])

  if (error) {
    return <p>Error: {error}</p>
  }

  const changeRowDataKeys = data => {
    const newArr = data?.map(obj => {
      const newObj = {}

      //You have to add a condition on the Object key name and perform your actions

      Object.keys(obj).forEach(key => {
        if (key === '_id') {
          newObj._id = obj._id
        } else if (key === 'first_name') {
          newObj.first_name = obj.first_name
        } else if (key === 'last_name') {
          newObj.last_name = obj.last_name
        } else if (key === 'gender') {
          newObj.gender = obj.gender
        } else if (key === 'type') {
          newObj.type = obj.type
        } else if (key === 'address') {
          newObj.address = obj.address
        } else if (key === 'phone') {
          newObj.phone = obj.phone
        } else if (key === 'area') {
          newObj.area = obj?.area?.name?.ar
          newObj.city = obj?.area?.city?.name?.ar
        } else {
          newObj[key] = obj[key]
        }
      })
      let keys = []
      Object.keys(newObj).forEach(key => {
        keys.push(key)
      })
      const order = ['_id', 'first_name', 'last_name', 'gender', 'type', 'address', 'phone', 'area']

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
  const onBtnExport = () => convertJsonToExcel(changeRowDataKeys(data), 'Customer')

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <Divider sx={{ m: '0 !important' }} />
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
                All Customers
              </Typography>
            </Box>
            <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              <CustomTextField
                value={value}
                sx={{ mr: 4 }}
                InputProps={{
                  startAdornment: <Icon icon={'mynaui:search'} color={'#64656980'} fontSize={'1.6rem'} />
                }}
                placeholder='Search'
                onChange={e => handleFilter(e.target.value)}
              />
              <Button
                color='secondary'
                variant='outlined'
                sx={{
                  paddingY: '0.9rem',
                  borderColor: '#64656980',
                  color: '#64656980',
                  marginRight: 2
                }}
                startIcon={<Icon icon='tabler:upload' />}
                onClick={() => onBtnExport()}
                disabled={!data}
              >
                Export
              </Button>
              <Select
                IconComponent={'span'}
                displayEmpty
                sx={{
                  paddingRight: 0,
                  marginRight: 4,

                  '& .MuiSelect-select': {
                    display: 'flex',
                    justifyContent: 'flex-end',
                    paddingRight: '1.5rem !important',
                    paddingLeft: '0rem !important'
                  },

                  '& .MuiSelect-select-MuiInputBase-input-MuiInputBase-input.MuiSelect-select': {
                    minWidth: '4rem !important',
                    padding: '14.5px 14px'
                  }

                  // '& .MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select': {

                  // },
                }}
                onChange={e => setStatusValue(e?.target?.value)}
                defaultValue={'Filter'}
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
                <MenuItem value='active'>Active</MenuItem>
                <MenuItem value='not active'>Not Active</MenuItem>
                <MenuItem value='in call'>In Call</MenuItem>
              </Select>
              <Button
                onClick={toggleAddCustomer}
                variant='contained'
                sx={{
                  '& svg': { mr: 2 },
                  py: '13.2px',
                  px: '34.5px',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#fff',
                  backgroundColor: '#1068A8',
                  '&:hover': {
                    backgroundColor: '#1174bb'
                  }
                }}
              >
                <Icon fontSize='1.125rem' icon='tabler:plus' />
                Add Customer
              </Button>
            </Box>
          </Box>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={data}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            rowCount={totalCounts}
            paginationModel={paginationModel}
            paginationMode='server'
            onPaginationModelChange={setPaginationModel}
            loading={loading}
            sx={{
              '& .super-app-theme--header': {
                backgroundColor: '#EFF5FA'
              }
            }}
          />
        </Card>
      </Grid>

      <AddCustomer open={addUserOpen} toggle={toggleAddCustomer} GetCustomerData={fetchData} />
    </Grid>
  )
}

export default Customer
