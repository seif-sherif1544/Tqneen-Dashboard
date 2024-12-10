// ** React Imports
import { useState, useEffect, forwardRef } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
// import { fetchData, deleteUser } from 'src/store/apps/user'

// ** Third Party Components
import axios from 'axios'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/user/list/TableHeader'
import { useAsync } from 'src/hooks/useAsync'
import { useCallback } from 'react'
import baseUrl from 'src/API/apiConfig'
import { Button, CardContent, CardHeader, Checkbox, FormControl, FormControlLabel, IconButton, InputLabel, Select, SvgIcon, Tooltip } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Controller, useForm } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { convertJsonToExcel } from 'src/@core/utils/convertToExcelFile'
import toast from 'react-hot-toast'
import BookingDetails from '../components/bookings/BookingDetails'


// ** renders client column
const userStatusObj = {
  active: 'success',
  pending: 'warning',
  false: 'secondary',
  true: 'success'
}



// ** renders client column
const renderClient = row => {
  if (row?.gender?.length) {
    return <CustomAvatar src={row?.avatar} sx={{ mr: 2.5, width: 50, height: 50 }} />
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




const Bookings = () => {
  // ** State
  const [value, setValue] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [checked, setChecked] = useState();
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({})
  const [FromDate, setFromDate] = useState({})
  const [ToDate, settToDate] = useState({})
  const [rowStatus, setRowStatus] = useState('')
  const [totalCounts, setTotalCounts] = useState(0);
  const [statusValue, setStatusValue] = useState("");
  const [openDetails, setOpenDetails] = useState(false);
  const [detailsId, setDetailsId] = useState('');


  const handleFilter = useCallback(val => {
    setValue(val)
    setPaginationModel({ page: 0, pageSize: paginationModel.pageSize });
  }, [])

  const handleStatus = useCallback(val => {
    setStatusValue(val)
    setPaginationModel({ page: 0, pageSize: paginationModel.pageSize })
  }, [])

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onChange'
  })

  const handleOpenDetails = (id) => {
    setOpenDetails(true)
    setDetailsId(id)
  }

  const { page, pageSize } = paginationModel;

  const { data, execute: fetchLawyerData, status, loading } = useAsync(() => axios.get(`${baseUrl}/api/admin/booking?page=${page + 1}&limit=${pageSize}&search=${value}&status=${statusValue}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }), { immediate: true })
  if (error) {
    return <p>Error: {error}</p>;
  }

  // ** Hooks
  const toggleSidebarLawyer = () => setAddUserOpen(!addUserOpen)

  useEffect(() => {
    if (data?.consultations?.totalDocs) {
      setTotalCounts(data?.consultations?.totalDocs)
    }

  }, [data])

  useEffect(() => {
    fetchLawyerData();
  }, [paginationModel, value, statusValue])

  async function changeLawyerStatus(e, id) {
    try {
      const selectedValue = e?.target?.value;

      const res = await axios.put(`${baseUrl}/api/admin/users/${id}`, {
        status: selectedValue
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      if (res?.status === 200) {
        toast.success("lawyer updated successfully");
        fetchLawyerData();
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message);
    }
  }

  const changeRowDataKeys = (data) => {
    const newArr = data?.map((obj) => {
      const newObj = {};

      //You have to add a condition on the Object key name and perform your actions
      Object.keys(obj).forEach((key) => {
        if (key === "_id") {
          newObj._id = obj._id;
        } else if (key === "full_name") {
          newObj.name = obj.name;
        } else if (key === "email") {
          newObj.email = obj.email;
        } else if (key === "phone") {
          newObj.phone = obj.phone;
        } else if (key === "is_active") {
          newObj.is_active = obj?.is_active;
        }
        else {
          newObj[key] = obj[key];
        }
      });
      let keys = [];
      Object.keys(newObj).forEach((key) => {
        keys.push(key);
      });
      const order = ["_id", "full_name", "email", "phone", "is_active"];

      const newOrderdObj = order.reduce((obj, key) => {

        if (!newObj[key]) {
          obj[key] = "N/A";
        } else {
          obj[key] = newObj[key];
        }

        return obj;

      }, {});

      return newOrderdObj;
    });

    return newArr;
  };
  const onBtnExport = () => convertJsonToExcel(changeRowDataKeys(data?.consultations?.docs), "Bookings");

  const updateUserHasFreeCall = async (userId, hasFreeCall) => {
    try {
      const response = await axios.put(
        `${baseUrl}/api/admin/users/${userId}`,
        { hasFreeCall },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      fetchLawyerData();
    } catch (error) {

      console.error(error);
    }
  };

  const columns = [
    {
      flex: 0.1,
      minWidth: 200,
      field: 'id',
      headerClassName: 'super-app-theme--header',
      headerName: 'ID',
      renderHeader: () => (<Typography sx={{
        fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',
      }}>{'ID'}</Typography>),
      renderCell: ({ row }) => {
        // const { first_name, last_name, email } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', color: '#000' }}>

            #{row?._id?.slice(0, 3)}
          </Box>
        )
      }
    },

    {
      flex: 0.15,
      minWidth: 100,
      headerName: 'Lawyer Name',
      headerClassName: 'super-app-theme--header',
      field: 'full_name',
      renderHeader: () => (<Typography sx={{
        fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',
      }}>{'Lawyer Name'}</Typography>),
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: '#000', textTransform: 'capitalize' }}>
            {row?.lawyerDetails?.full_name}
          </Typography>
        )
      }
    },

    {
      flex: 0.15,
      minWidth: 100,
      headerName: 'Lawyer Phone',
      headerClassName: 'super-app-theme--header',
      field: 'phone',
      renderHeader: () => (<Typography sx={{
        fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',
      }}>{'Lawyer Phone'}</Typography>),
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: '#000', textTransform: 'capitalize' }}>
            {row?.lawyerDetails?.phone}
          </Typography>
        )
      }
    },
    {
      flex: 0.10,
      minWidth: 100,
      headerClassName: 'super-app-theme--header',
      headerName: 'Type',
      field: 'type',
      renderHeader: () => (<Typography sx={{
        fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',
      }}>{'Type'}</Typography>),
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: '#000', textTransform: 'capitalize' }}>
            {row?.schedule?.type}
          </Typography>
        )
      }
    },
    {
      flex: 0.15,
      headerClassName: 'super-app-theme--header',
      minWidth: 100,
      headerName: 'Created Date',
      field: 'created_at',
      renderHeader: () => <Typography sx={{
        fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',
      }}>{'Created Date'}</Typography>,
      renderCell: ({ row }) => {
        const AppointmentData = new Date(row?.createdAt)?.toLocaleString();

        return (
          <Typography noWrap sx={{ fontWeight: 500, color: '#000', textTransform: 'capitalize' }}>
            {AppointmentData}
          </Typography>
        )
      }
    },

    {
      flex: 0.10,
      minWidth: 100,
      headerName: 'Status',
      headerClassName: 'super-app-theme--header',
      field: 'status',
      renderHeader: () => (<Typography sx={{
        fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',
      }}>{'Status'}</Typography>),
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: (row?.status === 'available' || row?.status === 'completed') ? '#55C98B' : row?.status === 'pending' ? '#1068A880' : '#AC3434', textTransform: 'capitalize' }}>
            {row?.status}
          </Typography>
        )
      }
    },

    {
      flex: 0.1,
      minWidth: 50,
      sortable: true,
      field: 'actions',
      headerName: 'Details',
      headerClassName: 'super-app-theme--header',
      renderHeader: () => (<Typography sx={{
        fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',
      }}>{'Details'}</Typography>),
      renderCell: ({ row }) => {

        return (

          <Box>
            <Tooltip title='detail'>
              {/* <Link href={`/editcityid/${row.id}`}> */}
              <IconButton size='small' sx={{ color: "text.labelBlack" }} onClick={() => handleOpenDetails(row?._id)}>
                <Icon icon='ph:eye' />
              </IconButton>
              {/* </Link> */}
            </Tooltip>
          </Box>

        )
      }
    }
  ]

  const CustomInput = forwardRef(({ ...props }, ref) => {
    return <CustomTextField inputRef={ref} {...props} />
  })

  const onSubmit = data => {

  }

  return (
    <Grid container spacing={4}>

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
              <Typography variant='h1' sx={{ fontSize: '2rem', fontWeight: 400, color: '#000' }}>Bookings</Typography>

            </Box>

            <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              <CustomTextField
                value={value}
                sx={{ mr: 4 }}
                placeholder='Search'
                InputProps={{
                  startAdornment: (
                    <Icon icon={"mynaui:search"} color={"#64656980"}
                      fontSize={'1.6rem'} />
                  )
                }}
                onChange={e => handleFilter(e.target.value)}
              />
              <Button color='secondary' variant='outlined' sx={{
                paddingY: "0.9rem",
                borderColor: '#64656980',
                color: "#64656980",
                marginRight: 2
              }} startIcon={<Icon icon='tabler:upload' />} onClick={() => onBtnExport()} disabled={!data?.consultations?.docs}>
                Export
              </Button>
              <Select
                IconComponent={"span"}
                displayEmpty
                sx={{
                  paddingRight: 0,
                  marginRight: 4,

                  '& .MuiSelect-select': {
                    display: 'flex',
                    justifyContent: 'flex-end',
                  },
                  '& .css-1ukp3w4-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select': {
                    minWidth: '4rem !important',
                    padding: "14.5px 14px"
                  },
                }}
                onChange={(e) => handleStatus(e?.target?.value)}
                defaultValue={"Filter"}
                renderValue={(value) => {
                  return (
                    <Box sx={{ display: "flex", gap: 1, paddingLeft: '0px', color: "#64656980" }}>
                      <Icon icon='hugeicons:menu-08' />
                      {value}
                    </Box>
                  );
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
      <Grid item xs={12}>
        <Card>

          <DataGrid
            autoHeight
            rowHeight={62}
            rows={data?.consultations?.docs ?? []}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            loading={loading}
            paginationMode="server"
            getRowId={(row) => row?._id} // Specify the custom ID function
            rowCount={totalCounts}
            sx={{
              '& .super-app-theme--header': {
                backgroundColor: '#EFF5FA'
              }
            }}
          />
        </Card>
      </Grid>
      <BookingDetails open={openDetails} setOpenDetails={setOpenDetails} bookingId={detailsId} />
    </Grid>
  )
}

export default Bookings
