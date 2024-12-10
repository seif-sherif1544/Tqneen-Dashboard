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
import { Button, CardContent, CardHeader, Checkbox, FormControl, FormControlLabel, IconButton, InputLabel, Select, Tooltip } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Controller, useForm } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { convertJsonToExcel } from 'src/@core/utils/convertToExcelFile'
import toast from 'react-hot-toast'
import { fontSize } from '@mui/system'


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

const LawyerPayment = ({ apiData }) => {
  // ** State
  const [value, setValue] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [openDetails, setOpenDetails] = useState(false);
  const [lawyerPaymentId, setlawyerPaymentId] = useState("");
  const [error, setError] = useState(null);
  const [totalCounts, setTotalCounts] = useState(0);
  const [statusValue, setStatusValue] = useState("")

  const handleFilter = useCallback(val => {
    setValue(val)
    setPaginationModel({ page: 0, pageSize: paginationModel.pageSize });
  }, [])

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onChange'
  })
  const { page, pageSize } = paginationModel;

  const { data, execute: fetchLawyerData, status, loading } = useAsync(() => axios.get(`${baseUrl}/api/admin/users?type=lawyer&page=${page + 1}&limit=${pageSize}&search=${value}&status=${statusValue}`, {

    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }), { immediate: true })
  if (error) {
    return <p>Error: {error}</p>;
  }
  console.log(" adf ", data);

  // ** Hooks
  const toggleSidebarLawyer = () => setAddUserOpen(!addUserOpen)

  useEffect(() => {
    if (data?.totalDocs) {
      setTotalCounts(data?.totalDocs)
    }
  }, [data])

  useEffect(() => {
    fetchLawyerData();
  }, [paginationModel, value, statusValue])

  const handleStatus = useCallback(val => {
    setStatusValue(val)
    setPaginationModel({ page: 0, pageSize: paginationModel.pageSize })
  }, [])

  const handleShowTrack = (id) => {
    setOpenDetails(true);
    setlawyerPaymentId(id);
  }

  const handleClose = useCallback(() => {
    setOpenDetails(false);
  }, [])

  const changeRowDataKeys = (data) => {
    const newArr = data?.map((obj) => {
      const newObj = {};

      //You have to add a condition on the Object key name and perform your actions
      Object.keys(obj).forEach((key) => {
        if (key === "id") {
          newObj.id = obj.id;
        } else if (key === "full_name") {
          newObj.full_name = obj.full_name;
        } else if (key === "walletBalance") {
          newObj.walletBalance = obj.walletBalance;
        } else {
          newObj[key] = obj[key];
        }
      });
      let keys = [];
      Object.keys(newObj).forEach((key) => {
        keys.push(key);
      });
      const order = ["_id", "full_name", "walletBalance"];

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
  const onBtnExport = () => convertJsonToExcel(changeRowDataKeys(data?.docs), "Lawyer");

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
      headerName: 'Lawer ID',
      headerClassName: 'super-app-theme--header',
      renderHeader: () => <Typography sx={{
        fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',
      }}>{'Lawyer ID'}</Typography>,
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
      flex: 0.10,
      minWidth: 100,
      headerName: 'Lawer Name',
      field: 'full_name',
      headerClassName: 'super-app-theme--header',
      renderHeader: () => <Typography sx={{
        fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',
      }}>{'Lawyer Name'}</Typography>,
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: '#000', textTransform: 'capitalize' }}>
            {row?.full_name}
          </Typography>
        )
      }
    },
    {
      flex: 0.10,
      minWidth: 100,
      headerName: 'Total Fees',
      field: 'walletBalance',
      headerClassName: 'super-app-theme--header',
      renderHeader: () => <Typography sx={{
        fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',
      }}>{'Total Fees'}</Typography>,
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: '#000', textTransform: 'capitalize' }}>
            {row?.walletBalance}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 50,
      sortable: true,
      field: 'actions',
      headerClassName: 'super-app-theme--header',
      headerName: 'Details',
      renderHeader: () => <Typography sx={{
        fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',
      }}>{'Details'}</Typography>,
      renderCell: ({ row }) => <RowOptions id={row?.id} />
    }
  ]

  const CustomInput = forwardRef(({ ...props }, ref) => {
    return <CustomTextField inputRef={ref} {...props} />
  })


  return (
    <Grid container spacing={4}>

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
              justifyContent: 'space-between',

            }}
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant='h1' sx={{ fontSize: '2rem', fontWeight: 400, color: '#000' }}>
                Lawers Payment
              </Typography>
            </Box>
            <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}>
              <CustomTextField
                value={value}

                // sx={{ mr: 4 }}
                InputProps={{
                  startAdornment: (
                    <Icon icon={"mynaui:search"} color={"#64656980"}
                      fontSize={'1.6rem'} />
                  )
                }}
                placeholder='Search'
                onChange={e => handleFilter(e.target.value)}
              />
              <Button sx={{
                border: '1px solid #64656980',
                borderRadius: '4px',
                py: '14px',
                px: '16px',
                color: '#64656980'
              }} variant='outlined' startIcon={<Icon icon='tabler:upload' />} onClick={() => onBtnExport()} disabled={!data?.docs}>
                Export
              </Button>
              <Select
                IconComponent={"span"}
                displayEmpty
                sx={{
                  paddingRight: 0,
                  marginRight: 2,

                  '& .MuiSelect-select': {
                    display: 'flex',
                    justifyContent: 'flex-end',
                  },
                  '& .css-1ukp3w4-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select': {
                    minWidth: '4rem !important',
                    padding: "14.5px 14px"
                  },
                }}
                defaultValue={"Filter"}
                onChange={(e) => handleStatus(e.target.value)}
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
                <MenuItem value='active'>Active</MenuItem>
                <MenuItem value='not active'>Not Active</MenuItem>
                <MenuItem value='in call'>In Call</MenuItem>
              </Select>
              {/* <Button onClick={toggleSidebarLawyer} variant='contained' sx={{
                '& svg': { mr: 2 }, py: "13.2px",
                px: "34.5px",
                fontSize: "18px",
                fontWeight: 700,
                color: "#fff",
                backgroundColor: "#1068A8",
                '&:hover': {
                  backgroundColor: "#1174bb"
                }
              }}>
                <Icon fontSize='1.125rem' icon='tabler:plus' />
                Add Lawyer
              </Button> */}
            </Box>
          </Box>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <Divider sx={{ m: '0 !important' }} />

          <DataGrid
            autoHeight

            rowHeight={62}
            rows={data?.docs ?? []}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            loading={loading}
            paginationMode="server"
            rowCount={totalCounts}

            sx={{
              '& .super-app-theme--header': {
                backgroundColor: '#EFF5FA',

              },

            }}
          />
        </Card>
      </Grid>

    </Grid>
  )
}

export default LawyerPayment
