// ** React Imports
import { useState, useEffect, forwardRef, useMemo, useCallback } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import baseUrl from 'src/API/apiConfig'
import { Button, Divider, MenuItem, Select } from '@mui/material'

import CustomTextField from 'src/@core/components/mui/text-field'
import { convertJsonToExcel } from 'src/@core/utils/convertToExcelFile'
import SidebarLawyer from '../Lawyer/CreateLawyer'

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
      <CustomAvatar src={row?.lawyer?.avatar} sx={{ height: 26, width: 26 }} />
    </CustomAvatar>
  )
}

const RequestLawyer = () => {
  // ** State
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [error, setError] = useState(null)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [totalCounts, setTotalCount] = useState('');
  const [statusValue, setStatusValue] = useState("pending");

  const toggleSidebarLawyer = () => setAddUserOpen(!addUserOpen)
  const { page, pageSize } = paginationModel

  const fetchData = async () => {
    try {
      setLoading(true)

      const response = await axios.get(
        `${baseUrl}/api/admin/docRequest?page=${page + 1}&limit=${pageSize}&search=${value}&status=${statusValue}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      setData(response?.data?.docs)
      setTotalCount(response?.data?.totalDocs)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setError(error.message)
    }
  }
  useEffect(() => {
    fetchData()
  }, [value, page, statusValue])

  const handleStatus = useCallback(val => {
    setStatusValue(val)
    setPaginationModel({ page: 0, pageSize: paginationModel.pageSize })
  }, [])

  const handleFilter = useCallback(val => {
    setValue(val)
    setPaginationModel({ page: 0, pageSize: paginationModel.pageSize });
  }, [])


  const changeRowDataKeys = (data) => {
    const newArr = data?.map((obj) => {
      const newObj = {};

      //You have to add a condition on the Object key name and perform your actions
      Object.keys(obj).forEach((key) => {

        if (key === "id") {
          newObj.id = obj.id;
        } else if (key === "lawyer") {
          if (obj.lawyer) {
            newObj.lawyer = {
              full_name: obj.lawyer.full_name || "",
              email: obj.lawyer.email || ""
            };
          }

        } else if (key === "status") {
          newObj.status = obj?.status;
        } else if (key === "flag") {
          newObj.flag = obj?.flag;
        } else if (key === "is_active") {
          newObj.is_active = obj?.is_active;
        } else if (key === "createdAt") {
          newObj.createdAt = obj?.createdAt;
        } else {
          newObj[key] = obj[key];
        }
      });
      let keys = [];
      Object.keys(newObj).forEach((key) => {
        keys.push(key);
      });
      const order = ["id", "lawyer", "status", "flag", "is_active", "createdAt"];

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

  const onBtnExport = () => {
    const dataToExport = changeRowDataKeys(data);
    convertJsonToExcel(dataToExport, 'requests lawyer');
  }

  // const tableData = data.map((request) => ({
  //   id: request.id,
  //   lawyerName: request.lawyer.full_name,
  //   status: request.status,
  // }));
  const pendingRequests = useMemo(() => {
    return data?.filter(item => item?.status === 'pending') || []
  }, [data])

  // Now, tableData contains an array of objects suitable for rendering the table
  // console.log("Table Data:", tableData);
  // const lawyerIds = data.map(item => item.lawyer.id);

  // // console.log("lawyer id ",lawyerIds);

  // const lawyerRequests = data.filter(item => item.lawyer.id ===lawyerIds);

  // Now, lawyerRequests contains an array of objects with requests for the specified lawyer

  // Assuming the data object contains the lawyer information
  // const { lawyer } = data;
  // const lawyerId = data.lawyer.id;
  // console.log("lawyer id", lawyerId);

  const columns = [
    {
      flex: 0,
      field: 'id',
      minWidth: 100,
      headerName: 'ID',
      headerClassName: 'super-app-theme--header',
      renderHeader: () => <Typography sx={{
        fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',
      }}>{'ID'}</Typography>,
      renderCell: ({ row }) => (
        <Typography sx={{
          color: '#000'
        }}>
          #{`${row?.id}`}
        </Typography>
      )
    },
    {
      flex: 0.15,
      field: 'number of request',
      minWidth: 100,
      headerName: 'Name',
      headerClassName: 'super-app-theme--header',
      renderHeader: () => <Typography sx={{
        fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',
      }}>{'Name'}</Typography>,
      renderCell: ({ row }) => {
        return (

          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap sx={{ color: '#000', fontWeight: 500 }}>
              {row?.lawyer?.full_name}
            </Typography>
          </Box>

        )
      }
    },
    {
      flex: 0.15,
      field: 'lawyer.email',
      minWidth: 100,
      headerName: 'Email',
      headerClassName: 'super-app-theme--header',
      renderHeader: () => <Typography sx={{
        fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',
      }}>{'Email'}</Typography>,
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>

            <Typography noWrap sx={{ color: '#000', fontWeight: 500 }}>
              {row?.lawyer?.email}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 100,
      field: 'created data',
      headerName: 'Created Date',
      headerClassName: 'super-app-theme--header',
      renderHeader: () => <Typography sx={{
        fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',
      }}>{'Created Date'}</Typography>,
      renderCell: ({ row }) => {
        const RequestData = new Date(row?.createdAt).toLocaleString()

        return <Typography sx={{ color: '#000' }}>{RequestData}</Typography>
      }
    },
    {
      flex: 0.12,
      minWidth: 100,
      field: 'status',
      headerName: 'Status',
      headerClassName: 'super-app-theme--header',
      renderHeader: () => <Typography sx={{
        fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',
      }}>{'Status'}</Typography>,
      renderCell: ({ row }) => {
        return row?.status !== 0 ? (
          <Typography color='#000'>{row?.status}</Typography>
        ) : (
          <CustomChip rounded size='small' skin='light' color='#000' label='not active' />
        )
      }
    },
    {
      flex: 0.12,
      minWidth: 100,
      field: 'falg',
      headerName: 'flag',
      headerClassName: 'super-app-theme--header',
      renderHeader: () => <Typography sx={{
        fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',
      }}>{'Flag'}</Typography>,
      renderCell: ({ row }) => {
        return row?.status !== 0 ? (
          <Typography color='#000'>{row?.flag == 'cardDoc' ? 'كارنيه  النقابة' : ' البطاقة الشخصية'}</Typography>
        ) : (
          <CustomChip rounded size='small' skin='light' color='#000' label='not active' />
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 140,
      sortable: false,
      field: 'actions',
      headerClassName: 'super-app-theme--header',
      headerName: 'Details',
      renderHeader: () => <Typography sx={{
        fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',
      }}>{'Details'}</Typography>,
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='View'>
            <Link href={`/requests/Profile/${row?.id}`} passHref>
              <IconButton
                size='small'
                sx={{ color: '#000' }}

              // href={{
              //   pathname: '/requests/profile/[requestid]',
              //   query:  { requestid: row.id }
              // }}
              >
                <Icon icon='tabler:eye' />
              </IconButton>
            </Link>
          </Tooltip>
        </Box>
      )
    }
  ]

  if (error) {
    return <p>Error: {error}</p>
  }
  console.log('request data', data)
  if (error) {
    return <p>Error: {error}</p>
  }
  console.log(' request data', data)

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            {/* <Divider sx={{ m: '0 !important' }} /> */}
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
                  Lawers Requests
                </Typography>
              </Box>

              <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                <CustomTextField
                  value={value}
                  sx={{ mr: 4 }}
                  placeholder='Search'
                  InputProps={{
                    startAdornment: <Icon icon={'mynaui:search'} color={'#64656980'} fontSize={'1.6rem'} />
                  }}
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
                  onClick={() => onBtnExport()} disabled={!data}
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
                      justifyContent: 'flex-end'
                    },
                    '& .css-1ukp3w4-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select': {
                      minWidth: '4rem !important',
                      padding: '14.5px 14px'
                    }
                  }}
                  onChange={e => handleStatus(e?.target?.value)}
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
                  <MenuItem value='pending'>Pending</MenuItem>
                  <MenuItem value='accepted'>Accepted</MenuItem>
                  <MenuItem value='rejected'>Rejected</MenuItem>
                </Select>
                {/* <Button
                  onClick={toggleSidebarLawyer}
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
                  Add Lawyer
                </Button> */}
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
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              loading={loading}
              paginationMode="server"
              rowCount={totalCounts}
              sx={{
                '& .super-app-theme--header': {
                  backgroundColor: '#EFF5FA'
                }
              }}
            />
          </Card>
        </Grid>
        <SidebarLawyer open={addUserOpen} toggle={toggleSidebarLawyer} fetchLawyerData={fetchData} />

      </Grid>
    </DatePickerWrapper>
  )
}

export default RequestLawyer
