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
import ScheduleDialog from '../components/scheduleDialog'
import DeleteData from 'src/@core/components/topics/DeleteData'


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
        sx={{ '& svg': { mr: 0 }, pr: '0rem !important' }}
        href={`/Lawyer/Profile/LawyerProfile/${id}`}

        // target="_blank"
        onClick={handleRowOptionsClose}
      >
        <Icon icon='tabler:eye' fontSize={20} />
      </MenuItem>

    </>
  )
}


const SchedulePage = ({ apiData }) => {
  // ** State
  const [value, setValue] = useState('')
  const [openCreateSchedule, setOpenCreateSchedule] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [error, setError] = useState(null);
  const [totalCounts, setTotalCounts] = useState(0);
  const [openDelete, setOpenDelete] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [scheduleId, setScheduleId] = useState('');


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

  const { data, execute: fetchLawyerData, status, loading } = useAsync(() => axios.get(`${baseUrl}/api/admin/getAllSchedules?page=${page + 1}&limit=${pageSize}&search=${value}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }), { immediate: true })
  if (error) {
    return <p>Error: {error}</p>;
  }

  const handleDeleteClick = async () => {
    setIsDeleteLoading(true)
    try {
      if (scheduleId !== null && scheduleId !== "" && scheduleId !== undefined) {
        const response = await axios.delete(`${baseUrl}/api/consultation/schedule/${scheduleId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })
        if (response?.status === 200) {
          toast.success("Schedule Delete Successfully")
          fetchLawyerData();
          setIsDeleteLoading(false);
          setOpenDelete(false)
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message)
      setIsDeleteLoading(false)
    }
  }

  // ** Hooks
  const toggleSidebarLawyer = () => setOpenCreateSchedule(true);

  useEffect(() => {
    if (data?.schedules?.totalDocs) {
      setTotalCounts(data?.schedules?.totalDocs)
    }
  }, [data])

  useEffect(() => {
    fetchLawyerData();
  }, [paginationModel, value])




  const changeRowDataKeys = (data) => {
    const newArr = data?.map((obj) => {
      const newObj = {};

      //You have to add a condition on the Object key name and perform your actions
      Object.keys(obj).forEach((key) => {
        if (key === "_id") {
          newObj._id = obj?._id;
        } else if (key === "startDate") {
          newObj.startDate = obj?.startDate;
        } else if (key === "endDate") {
          newObj.endDate = obj?.endDate;
        } else if (key === "type") {
          newObj.type = obj?.type;
        } else if (key === "fees") {
          newObj.fees = obj?.fees;
        } else if (key === "lawyerDetails") {
          newObj.lawyerDetails = {
            first_name: obj?.first_name || '',
            last_name: obj?.last_name || '',
            full_name: obj?.full_name || '',
            avatar: obj?.avatar || '',
            status: obj?.status || '',
            title: obj?.title || '',
            walletNumber: obj?.walletNumber || '',
            address: obj?.address || '',
          }
        }
        else {
          newObj[key] = obj[key];
        }
      });
      let keys = [];
      Object.keys(newObj).forEach((key) => {
        keys.push(key);
      });
      const order = ["_id", "startDate", "endDate", "type", "fees", "lawyerDetails"];

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
  const onBtnExport = () => convertJsonToExcel(changeRowDataKeys(data?.schedules?.docs), "Schedules");


  const columns = [
    {
      flex: 0.1,
      minWidth: 200,
      field: '_id',
      headerName: 'ID',
      headerClassName: 'super-app-theme--header',
      renderHeader: () => <Typography sx={{
        fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',
      }}>{'ID'}</Typography>,
      renderCell: ({ row }) => {
        // const { first_name, last_name, email } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', color: '#000' }}>

            #{row?._id?.slice(0, 4)}
          </Box>
        )
      }
    },
    {
      flex: 0.20,
      minWidth: 100,
      headerName: 'Lawyer',
      headerClassName: 'super-app-theme--header',
      field: 'lawyerId',
      renderHeader: () => <Typography sx={{
        fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',
      }}>{'Lawyer'}</Typography>,
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: '#000', textTransform: 'capitalize' }}>
            {row?.lawyerDetails?.full_name}
          </Typography>
        )
      }
    },
    {
      flex: 0.20,
      minWidth: 100,
      headerClassName: 'super-app-theme--header',
      headerName: 'Start Date',
      field: 'startDate',
      renderHeader: () => <Typography sx={{
        fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',
      }}>{'Start Date'}</Typography>,
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: '#000', textTransform: 'capitalize' }}>
            {new Date(row?.startDate)?.toLocaleString()}
          </Typography>
        )
      }
    },
    {
      flex: 0.20,
      minWidth: 100,
      headerClassName: 'super-app-theme--header',
      headerName: 'End Date',
      field: 'endDate',
      renderHeader: () => <Typography sx={{
        fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',
      }}>{'End Date'}</Typography>,
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: '#000', textTransform: 'capitalize' }}>
            {new Date(row?.endDate)?.toLocaleString()}
          </Typography>
        )
      }
    },
    {
      flex: 0.10,
      minWidth: 100,
      headerName: 'Type',
      headerClassName: 'super-app-theme--header',
      field: 'type',
      renderHeader: () => <Typography sx={{
        fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',
      }}>{'Type'}</Typography>,
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: '#000', textTransform: 'capitalize' }}>
            {row?.type}
          </Typography>
        )
      }
    },

    // {
    //   flex: 0.10,
    //   minWidth: 100,
    //   headerName: 'IsActive',
    //   field: 'status',
    //   renderHeader: () => <Typography sx={{
    //     fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',
    //   }}>{'IsActive'}</Typography>,
    //   renderCell: ({ row }) => {
    //     return (
    //       <FormControl fullWidth>
    //         <Select
    //           id="demo-simple-select"
    //           value={row?.status}
    //           defaultValue={row?.status}
    //           sx={{
    //             width: '120px',
    //             height: '32px',
    //             color: row?.status === 'active' ? '#55C98B' : row?.status === 'in call' ? '#1068A880' : '#AC3434',
    //             fontSize: '14px',
    //             fontWeight: 500,
    //           }}
    //           onChange={(e) => changeLawyerStatus(e, row?.id)}
    //         >

    //           <MenuItem value={"active"}>Active</MenuItem>
    //           <MenuItem value={"in call"}>Suspended</MenuItem>
    //           <MenuItem value={"not active"}>Not Active</MenuItem>
    //         </Select>
    //       </FormControl>
    //     )
    //   }
    // },
    {
      flex: 0.10,
      minWidth: 100,
      headerName: 'Price',
      headerClassName: 'super-app-theme--header',
      field: 'fees',
      renderHeader: () => <Typography sx={{
        fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',
      }}>{'Price'}</Typography>,
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: '#000', textTransform: 'capitalize' }}>
            {row?.fees}
          </Typography>
        )
      }
    },


    {
      flex: 0.1,
      minWidth: 50,
      headerClassName: 'super-app-theme--header',
      sortable: true,
      field: 'actions',
      headerName: 'Details',
      renderHeader: () => <Typography sx={{
        fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',
      }}>{'Details'}</Typography>,
      renderCell: ({ row }) => {
        return (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title='Schedule Delete'>
                <IconButton size='small' sx={{ color: 'text.labelBlack' }} onClick={() => {
                  setOpenDelete(true);
                  setScheduleId(row?._id)
                }}>
                  <Icon icon='tabler:trash' />
                </IconButton>
              </Tooltip>
            </Box>
          </>

        )
      }
    },

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
              <Typography variant='h1' sx={{ fontSize: '2rem', fontWeight: 400, color: '#000' }}>All Schedules</Typography>

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
              }} startIcon={<Icon icon='tabler:upload' />} onClick={() => onBtnExport()} disabled={!data?.schedules?.docs}>
                Export
              </Button>
              {/* <Select
                IconComponent={"span"}
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
                    padding: "14.5px 14px"
                  },


                  // '& .MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select': {

                  // },

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
                <MenuItem value='active'>Active</MenuItem>
                <MenuItem value='not active'>Not Active</MenuItem>
                <MenuItem value='in call'>In Call</MenuItem>
              </Select> */}
              <Button onClick={toggleSidebarLawyer} variant='contained' sx={{
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
                Add Schedule
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
            rows={data?.schedules?.docs ?? []}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            loading={loading}
            paginationMode="server"
            rowCount={totalCounts}
            getRowId={(row) => row?._id}
            sx={{
              '& .super-app-theme--header': {
                backgroundColor: '#EFF5FA'
              }
            }}
          />
        </Card>
      </Grid>
      <ScheduleDialog open={openCreateSchedule} setOpenAdd={setOpenCreateSchedule} fetchData={fetchLawyerData} />
      <DeleteData
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        isDeleting={isDeleteLoading}
        title={'Delete Schedule'}
        deleteSubmit={handleDeleteClick}
        text={'Are you sure to delete this schedule?'}
      />
    </Grid>
  )
}

export default SchedulePage
