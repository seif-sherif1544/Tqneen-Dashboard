import styled from '@emotion/styled'
import { Box, Button, Card, CircularProgress, Divider, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Select, Stack, Switch, Tooltip, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import baseUrl from 'src/API/apiConfig'
import Icon from 'src/@core/components/icon'

import { ToggleButton } from '@mui/material';
import { useAsync } from 'src/hooks/useAsync'
import { PieChart } from '@mui/x-charts/PieChart';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartTooltip, Brush, ReferenceLine, ReferenceDot } from 'recharts'
import Icomme from "../../../public/images/newIcons/Icomme"
import Outcomme from "../../../public/images/newIcons/outcomme"
import { convertJsonToExcel } from 'src/@core/utils/convertToExcelFile'
import UpdatePercentage from '../components/transactions/UpdatePercentage'



// ** Styled component for the link in the dataTable
// const LinkStyled = styled(Link)(({ theme }) => ({
//   textDecoration: 'none',
//   fontSize: theme.typography.body1.fontSize,
//   color: `${theme.palette.text.labelBlack} !important`
// }))
const label = { inputProps: { 'aria-label': 'Color switch demo' } };

const defaultColumns = [
  {
    flex: 0.1,
    field: 'transactionId',
    minWidth: 100,
    headerName: 'Transaction ID',
    headerClassName: 'super-app-theme--header',
    renderHeader: () => <Typography sx={{ fontSize: '18px', color: '#161616', fontWeight: 700, textWrap: 'wrap', textAlign: 'center' }}>{'Transaction ID'}</Typography>,
    renderCell: ({ row }) => <Typography sx={{ color: '#121212' }}>{`#${row?.transactionId}`}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 100,
    field: 'type',
    headerName: 'Transaction Type',
    renderHeader: () => <Typography sx={{ fontSize: '18px', color: '#161616', fontWeight: 700, textWrap: 'wrap', textAlign: 'center' }}>{'Transaction Type'}</Typography>,
    headerClassName: 'super-app-theme--header',
    renderCell: ({ row }) => {
      return (
        <Box sx={{
          backgroundColor: row?.type === 'withdraw' ? '#FFCECE4D' : row?.type === 'pending' ? '#FDC3654D' : '#C6F6D5',

          borderRadius: '1rem',
          padding: '0.3rem 0.7rem',
        }}>
          <Typography sx={{ display: 'flex', color: row?.type === 'withdraw' ? '#BF2D2D' : row?.type === 'pending' ? '#EA9000' : '#16980A', }}>{row?.type}</Typography>
        </Box>

      )

    }

  },
  {
    flex: 0.15,
    minWidth: 100,
    field: 'userDetails',
    renderHeader: () => <Typography sx={{ fontSize: '18px', color: '#161616', fontWeight: 700, }}>{'Customer Name'}</Typography>,
    headerClassName: 'super-app-theme--header',
    headerName: 'Customer Name',
    renderCell: ({ row }) => <Typography sx={{ color: '#121212' }}> {row?.userDetails?.full_name}</Typography>
  },
  {
    flex: 0.15,
    minWidth: 100,
    field: 'lawyername',
    headerClassName: 'super-app-theme--header',
    renderHeader: () => <Typography sx={{ fontSize: '18px', color: '#161616', fontWeight: 700, textWrap: 'wrap' }}>{'Lawyer Name'}</Typography>,
    headerName: 'Lawyer Name',
    renderCell: ({ row }) => <Typography sx={{ color: '#121212' }}>{row?.lawyerDetails?.type}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 100,
    field: 'fees',
    headerClassName: 'super-app-theme--header',
    renderHeader: () => <Typography sx={{ fontSize: '18px', color: '#161616', fontWeight: 700, textWrap: 'wrap' }}>{'Fees'}</Typography>,
    headerName: 'Fees',
    renderCell: ({ row }) => <Typography sx={{ color: '#121212' }}>{row?.userDetails?.walletBalance || 0}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 100,
    field: 'payments',
    headerClassName: 'super-app-theme--header',
    renderHeader: () => <Typography sx={{ fontSize: '18px', color: '#161616', fontWeight: 700, textWrap: 'wrap' }}>{'Payment Method'}</Typography>,
    headerName: 'Payment Method',
    renderCell: ({ row }) => <Typography sx={{ color: '#121212' }}>{'Paymob'}</Typography>
  },
  {
    flex: 0.1,
    minWidth: 100,
    field: 'createdAt',
    headerClassName: 'super-app-theme--header',
    renderHeader: () => <Typography sx={{ fontSize: '18px', color: '#161616', fontWeight: 700, textWrap: 'wrap' }}>{'Date'}</Typography>,
    headerName: 'Date',
    renderCell: ({ row }) => {
      const date = new Date(row?.createdAt);
      const day = String(date?.getUTCDate())?.padStart(2, '0'); // Get day and pad with zero if needed
      const month = String(date?.getUTCMonth() + 1)?.padStart(2, '0'); // Get month (0-indexed) and pad
      const year = date?.getUTCFullYear();

      return (
        <Typography sx={{ color: '#121212' }}>{`${day}/${month}/${year}`}</Typography>
      )
    }
  },

]

const Payments = () => {
  const [value, setValue] = useState('')
  const [data, setDates] = useState([])
  const [loading, setLoading] = useState(false);
  const [totalCounts, setTotalCount] = useState(0)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [editServiceId, setEditServiceId] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailId, setDetailId] = useState('');
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [transaction, setTransaction] = useState('');
  const [statusValue, setStatusValue] = useState("");
  const [openTransaction, setOpenTrasaction] = useState(false);
  const [reload, setReload] = useState(false);

  const { page, pageSize } = paginationModel;

  const handleClose = useCallback(() => {
    setOpenTrasaction(false);
  }, [])

  const { data: dataLTransaction, execute: fetchServiceData, status, loading: LoadingService } = useAsync(() => axios.get(`${baseUrl}/api/transaction/allTransactions?page=${page + 1}&limit=${pageSize}&search=${value}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }), { immediate: true })

  const handlePageChange = async paginationData => {
    console.log('handlePageChange', paginationData)

    await execute({ page: paginationData?.page + 1, pageSize: pageSize })
  }

  const { data: tracks, execute: fetchTransactionData, loading: LoadingTransaction } = useAsync(() => axios.get(`${baseUrl}/api/transaction/totalTransactionsPrice`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }), { immediate: true })

  const { data: tqneen, execute: fetchTqneenData, loading: LoadingTqneen } = useAsync(() => axios.get(`${baseUrl}/api/transaction/tqneenProfit`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }), { immediate: true })

  const { data: lawyersProft, execute: fetchLawyersData, loading: LoadingLawyers } = useAsync(() => axios.get(`${baseUrl}/api/transaction/lawyersProfit`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }), { immediate: true })

  const handleFilter = useCallback(val => {
    setValue(val)
    setPaginationModel({ page: 0, pageSize: paginationModel.pageSize });
  }, [])

  useEffect(() => {
    fetchServiceData();
  }, [page, value])
  useEffect(() => {
    fetchTransactionData();
  }, [])
  useEffect(() => {
    fetchLawyersData()
    fetchTqneenData();
    setReload(false);
  }, [reload])

  const handleReload = useCallback(() => {
    setReload(true)
  }, []);


  // Handle Edit dialog
  const handleAddClickOpen = () => setOpenAdd(true)
  const handleEditClickOpen = () => setOpenEdit(true)
  const handleDetailClickOpen = () => setDetailOpen(true)
  const handleDeleteClickOpen = () => setOpenDelete(true)


  const openUpdateDialog = () => {
    setOpenTrasaction(true);
  }

  const handleChangeTransaction = (e) => {
    setTransaction(e.target.value);
  }


  const toggleSidebarLawyer = () => {

  }

  const handleDeleteCity = async id => {
    try {
      setDeleteLoading(true)
      if (id !== '' && id !== undefined && id !== null) {
        const response = await axios.delete(`${baseUrl}/api/userServices/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (response?.status === 200) {
          toast.success('Delete Successfully')
          setDeleteLoading(false)
          fetchServiceData()
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.message)
      setDeleteLoading(false)
    }

  }

  const changeRowDataKeys = (data) => {
    const newArr = data?.map((obj) => {
      const newObj = {};

      //You have to add a condition on the Object key name and perform your actions
      Object.keys(obj).forEach((key) => {
        if (key === "_id") {
          newObj._id = obj._id;
        } else if (key === "consultationDetails") {
          newObj.consultationDetails = {
            fees: obj.fees || '',
            isPaid: obj.isPaid || '',
            status: obj.status || ''
          }
        }
        else if (key === "lawyerDetails") {
          newObj.lawyerDetails = {
            email: obj.email || '',
            full_name: obj.full_name || '',
            status: obj.status || '',
            phone: obj.phone || ''
          }
        }
        else if (key === "userDetails") {
          newObj.lawyerDetails = {
            status: obj.status || '',
            full_name: obj.full_name || '',
            phone: obj.phone || ''
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
  const onBtnExport = () => convertJsonToExcel(changeRowDataKeys(dataLTransaction?.docs), "Transaction");

  const columns = [
    ...defaultColumns,

    // {
    //   flex: 0.1,
    //   minWidth: 100,
    //   sortable: false,
    //   field: 'actions',
    //   renderHeader: () => <Typography sx={{
    //     fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',

    //   }}>{'Actions'}</Typography>,
    //   headerClassName: 'super-app-theme--header',
    //   headerName: 'Actions',
    //   renderCell: ({ row }) => {
    //     const handleEditClick = id => {
    //       handleEditClickOpen()
    //       setEditServiceId(id)
    //     }

    //     const handleDetailClick = id => {
    //       handleDetailClickOpen()
    //       setDetailId(id)
    //     }

    //     const handleDeleteClick = id => {
    //       handleDeleteClickOpen()
    //       setDeleteId(id)
    //     }

    //     return (
    //       <Box sx={{ display: 'flex', alignItems: 'center' }}>
    //         {/* <Tooltip title='Delete city'>
    //           <IconButton size='small' sx={{ color: 'text.labelBlack' }} onClick={() => handleDeleteClick(row.id)}>
    //             <Icon icon='tabler:trash' />
    //           </IconButton>
    //         </Tooltip> */}
    //         <Tooltip title='Edit'>
    //           {/* <Link href={`/editcityid/${row.id}`}> */}
    //           <IconButton size='small' sx={{ color: "text.labelBlack" }} onClick={() => handleEditClick(row?.id)}>
    //             <Icon icon='tabler:edit' />
    //           </IconButton>
    //           {/* </Link> */}
    //         </Tooltip>
    //         <Tooltip title='detail'>
    //           {/* <Link href={`/editcityid/${row.id}`}> */}
    //           <IconButton size='small' sx={{ color: "text.labelBlack" }} onClick={() => handleDetailClick(row?.id)}>
    //             <Icon icon='ph:eye' />
    //           </IconButton>
    //           {/* </Link> */}
    //         </Tooltip>
    //       </Box>
    //     )
    //   }
    // }
  ]

  const dataChart = [
    { value: 15, label: '' },
    { value: 5, label: '' },
  ]
  const colors = ['#1068A880', '#F0E5FC'];


  const dataBar = [
    {
      name: 'Mon',
      uv: 4000,
      pv: 10,
      amt: 2400,
    },
    {
      name: 'Tue',
      uv: 3000,
      pv: 25,
      amt: 2210,
    },
    {
      name: 'Wed',
      uv: 2000,
      pv: 40,
      amt: 2290,
    },
    {
      name: 'Thu',
      uv: 2780,
      pv: 20,
      amt: 2000,
    },
    {
      name: 'Fri',
      uv: 1890,
      pv: 15,
      amt: 2181,
    },

  ];

  const dataSmall = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 1800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 1200,
      amt: 2500,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
  ];

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
              justifyContent: 'space-between',
              boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.25)'
            }}
          >
            {/* <Button
              color='secondary'
              variant='tonal'
              startIcon={<Icon icon='tabler:upload' />}
              onClick={() => onBtnExport()}
            >
              Export
            </Button> */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant='h1' sx={{ fontSize: '2rem', fontWeight: 400, color: '#000' }}>Dashboard</Typography>

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
              }} startIcon={<Icon icon='tabler:upload' />} onClick={() => onBtnExport()}>
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
                onChange={(e) => setStatusValue(e?.target?.value)}
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

                <MenuItem value='true'>True</MenuItem>
                <MenuItem value='false'>False</MenuItem>
              </Select>
              <Button onClick={openUpdateDialog} variant='contained' sx={{
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

                % profit percentage
              </Button>
            </Box>

          </Box>
          <Grid container spacing={5} sx={{ py: '24px', px: '70px' }}>

            {/* <Grid item xs={12} md={6} lg={3}>
              <Box sx={{
                padding: '17px  16px 16px',
                boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                justifyContent: 'space-evenly',
                 borderRadius: '8px'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'space-between', flexDirection: 'column', gap: '24px' }}>
                  <Typography variant='h3' sx={{ fontSize: '16px', fontWeight: 500, color: '#000000' }}>Total Profit</Typography>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 600, color: '#000000' }}>$15.000</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '9px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '3.95px' }}>

                    <Icon icon="ph:arrow-up-right" fontSize="14px" style={{ color: "#1068A8" }} />
                    <Typography variant="body1" sx={{ color: '#1068A8', fontSize: '14px', fontFamily: '600' }}>20%</Typography>
                  </Box>
                  <Typography variant="h4" sx={{ color: '#64656980', fontSize: '14px', fontFamily: '600' }}>last month</Typography>

                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Box sx={{
                padding: '16px  16px 16px',
                boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                justifyContent: 'space-between',
                paddingRight: '58px', borderRadius: '8px'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'space-between', flexDirection: 'column', gap: '24px' }}>
                  <Typography variant='h3' sx={{ fontSize: '16px', fontWeight: 500, color: '#000000' }}>Total Profit</Typography>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 600, color: '#000000' }}>$15.000</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '9px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '3.95px' }}>
                    <Icon icon="ph:arrow-up-right" fontSize="14px" style={{ color: '#1068A8' }} />
                    <Typography variant="body1" sx={{ color: '#1068A8', fontSize: '14px', fontFamily: '600' }}>20%</Typography>
                  </Box>
                  <Typography variant="h4" sx={{ color: '#64656980', fontSize: '14px', fontFamily: '600' }}>last month</Typography>

                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Box sx={{
                padding: '16px  16px 16px',
                boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                justifyContent: 'space-between',
                paddingRight: '58px', borderRadius: '8px'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'space-between', flexDirection: 'column', gap: '24px' }}>
                  <Typography variant='h3' sx={{ fontSize: '16px', fontWeight: 500, color: '#000000' }}>Total Profit</Typography>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 600, color: '#000000' }}>$15.000</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '9px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '3.95px' }}>
                    <Icon icon="ph:arrow-up-right" fontSize="14px" style={{ color: '#1068A8' }} />
                    <Typography variant="body1" sx={{ color: '#1068A8', fontSize: '14px', fontFamily: '600' }}>20%</Typography>
                  </Box>
                  <Typography variant="h4" sx={{ color: '#64656980', fontSize: '14px', fontFamily: '600' }}>last month</Typography>

                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Box sx={{
                padding: '16px  16px 16px',
                boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                justifyContent: 'space-between',
                paddingRight: '58px', borderRadius: '8px'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'space-between', flexDirection: 'column', gap: '24px' }}>
                  <Typography variant='h3' sx={{ fontSize: '16px', fontWeight: 500, color: '#000000' }}>Total Profit</Typography>
                  <Typography variant='body1' sx={{ fontSize: '18px', fontWeight: 600, color: '#000000' }}>$15.000</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '9px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '3.95px' }}>
                    <Icon icon="ph:arrow-up-right" fontSize="14px" style={{ color: '#1068A8' }} />
                    <Typography variant="body1" sx={{ color: '#1068A8', fontSize: '14px', fontFamily: '600' }}>20%</Typography>
                  </Box>
                  <Typography variant="h4" sx={{ color: '#64656980', fontSize: '14px', fontFamily: '600' }}>last month</Typography>

                </Box>
              </Box>
            </Grid> */}
            <Grid item xs={12} md={6} lg={4}>
              <Box sx={{
                padding: '17px  0px 16px 0px',
                boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                borderRadius: '8px',
                alignItems: 'center',
                textAlign: 'center',


              }}>
                <Box sx={{ flex: 1 }}>
                  <Icon icon='mage:dollar' font-size="2rem" style={{ color: '#1E8FF8' }} />
                  <Typography variant='body1' sx={{
                    fontSize: '1.25rem', fontWeight: 500, color: '#252525',
                    py: theme => [`${theme.spacing(2)} !important`, `${theme.spacing(4)} !important`],
                    mb: '0px !important',
                    lineHeight: '20.96px'
                  }}>Total Transactions </Typography>
                  <Typography variant='body1' sx={{
                    fontSize: '1.5rem', fontWeight: 600, color: '#252525',
                    lineHeight: '29.05px'
                  }}>
                    {!LoadingTransaction ? `$${tracks?.totalTransactionsPrice?.toFixed(2) || '0.00'}` : <CircularProgress size={20} />}
                  </Typography>
                </Box>

              </Box>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Box sx={{
                padding: '17px  0px 16px 0px',
                boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                borderRadius: '8px',
                alignItems: 'center',
                textAlign: 'center',


              }}>
                <Box sx={{ flex: 1 }}>
                  <Icomme />
                  {/* <Icon icon='mage:box-3d-download' font-size="2rem" style={{color:'#977CFA'}}/> */}
                  <Typography variant='body1' sx={{
                    fontSize: '1.25rem', fontWeight: 500, color: '#252525',
                    py: theme => [`${theme.spacing(2)} !important`, `${theme.spacing(4)} !important`],
                    mb: '0px !important',
                    lineHeight: '20.96px'
                  }}>Tqneen Profit</Typography>
                  <Typography variant='body1' sx={{
                    fontSize: '1.5rem', fontWeight: 600, color: '#252525',
                    lineHeight: '29.05px'
                  }}>
                    {!LoadingTqneen ? `$${tqneen?.tqneenProfit?.toFixed(2) || '0.00'}` : <CircularProgress size={20} />}

                  </Typography>
                </Box>

              </Box>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Box sx={{
                padding: '17px  0px 16px 0px',
                boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                borderRadius: '8px',
                alignItems: 'center',
                textAlign: 'center',
              }}>
                <Box sx={{ flex: 1 }}>
                  <Outcomme />
                  {/* <Icon icon='mage:dollar' font-size="2rem" style={{color:'#1E8FF8'}}/> */}
                  <Typography variant='body1' sx={{
                    fontSize: '1.25rem', fontWeight: 500, color: '#252525',
                    py: theme => [`${theme.spacing(2)} !important`, `${theme.spacing(4)} !important`],
                    mb: '0px !important',
                    lineHeight: '20.96px'
                  }}>Lawyer Profit</Typography>
                  <Typography variant='body1' sx={{
                    fontSize: '1.5rem', fontWeight: 600, color: '#252525',
                    lineHeight: '29.05px'
                  }}>
                    {!LoadingLawyers ? `$${lawyersProft?.lawyerProfit?.toFixed(2) || '0.00'}` : <CircularProgress size={20} />}
                  </Typography>
                </Box>

              </Box>
            </Grid>
          </Grid>
          <Grid container sx={{
            pb: '24px', px: '24px', display: 'flex', alignItems: 'center', flexDirection: {
              xs: 'column',
              sm: 'column',
              md: 'row',
              lg: 'row',
              xl: 'row'
            }, width: {
              xs: '100%',
              sm: '100%'
            }
          }} >
            <Grid xs={12} md={6} lg={6} sx={{
              display: 'flex', alignItems: 'center', flexWrap: {
                xs: 'wrap',
                sm: 'wrap',
                md: 'wrap',
                lg: 'nowrap'
              }, width: {
                xs: '100%',
                sm: '80%'
              }
            }}>
              <Typography variant='h2' sx={{
                fontSize: '1.25rem',
                lineHeight: '24.2px',
                fontWeight: 600,
                color: '#000000',
                textWrap: 'nowrap',
                mr: '24px'
              }}>Transactions List</Typography>
              {/* <Box sx={{
                display: 'flex', alignItems: 'center', flexDirection: {
                  xs: 'column',
                  sm: 'column',
                  md: 'row',
                  lg: 'row',
                  xl: 'row'
                }, width: {
                  xs: '100%',
                  sm: '100%'
                }, gap: {
                  xs: '10px',
                  sm: '10px',
                  md: '0px',
                  xl: '0px'
                }
              }}>
                <FormControl sx={{ minWidth: 70, width: { xs: '100%', sm: '100%', md: 70, xl: 70 } }}>
                  <InputLabel id="demo-simple-select-label" sx={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#252525',
                    marginTop: 'auto'
                  }}>All</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={transaction}
                    label="transaction"
                    onChange={handleChangeTransaction}
                    sx={{ borderTopRightRadius: '0px !important', borderBottomRightRadius: '0px !important' }}
                  >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 84, width: { xs: '100%', sm: '100%', md: 84, xl: 84 } }}>
                  <InputLabel id="demo-simple-select-label" sx={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#252525',
                    marginTop: 'auto'
                  }}>Sent</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={transaction}
                    label="transaction"
                    onChange={handleChangeTransaction}
                    sx={{ borderRadius: '0px !important' }}
                  >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 106, width: { xs: '100%', sm: '100%', md: 106, xl: 106 } }}>
                  <InputLabel id="demo-simple-select-label" sx={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#252525',
                    marginTop: 'auto'
                  }}>Receive</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={transaction}
                    label="transaction"
                    onChange={handleChangeTransaction}
                    sx={{ borderTopLeftRadius: '0px !important', borderBottomLeftRadius: '0px !important' }}
                  >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </FormControl>
              </Box> */}
            </Grid>
            <Grid xs={12} md={6} lg={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              {/* <Box sx={{
                gap: 4, display: 'flex', flexWrap: {
                  xs: 'wrap',
                  sm: 'wrap',
                  md: 'wrap',
                  xl: 'nowrap'
                }, alignItems: 'center', width: {
                  xs: '100%',
                  sm: '80%',
                  md: '100%',
                  lg: '100%',
                  xl: '100%'
                }
              }}>
                <CustomTextField
                  value={value}
                  sx={{
                    '&.MuiTextField-root': {
                      width: '100% !important'
                    },
                    '& .MuiInputBase-root': {
                      '&.MuiInputBase-sizeSmall': {
                        width: '100% !important'
                      }
                    },
                    mt: {
                      sx: '10px',
                      sm: '10px',
                      md: '0px',
                      lg: '0px'
                    }
                  }}
                  placeholder='Search transaction'
                  onChange={e => handleFilter(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon icon='iconamoon:search-thin' fontSize="1.500rem" style={{ color: "#1068A880" }} />
                      </InputAdornment>
                    ),
                  }}
                />
                 <FormControl sx={{
                  minWidth: 164, width: {
                    xs: '100%',
                    sm: '100%',
                    md: 164,
                    xl: 164
                  }
                }}>
                  <InputLabel id="demo-simple-select-label" sx={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#252525',
                    marginTop: 'auto'
                  }}>Transaction Type</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={transaction}
                    label="transaction"
                    onChange={handleChangeTransaction}
                  >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{
                  minWidth: 121, width: {
                    xs: '100%',
                    sm: '100%',
                    md: 121,
                    xl: 121
                  }
                }}>
                  <InputLabel id="demo-simple-select-label" sx={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#252525',
                    marginTop: 'auto'
                  }}>User Type</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={transaction}
                    label="transaction"
                    onChange={handleChangeTransaction}
                  >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{
                  minWidth: 96, width: {
                    xs: '100%',
                    sm: '100%',
                    md: 96,
                    xl: 96
                  }
                }}>
                  <InputLabel id="demo-simple-select-label" sx={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#252525',
                    marginTop: 'auto'
                  }}>Sort</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={transaction}
                    label="transaction"
                    onChange={handleChangeTransaction}
                  >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </FormControl>
              </Box> */}
            </Grid>
            <Grid></Grid>
          </Grid>
          {/* <Grid container spacing={10} sx={{ mb: '24px', px: '40px', display: 'flex', alignItems: 'flex-end' }}>
            <Grid item xs={12} md={6} lg={4}>
              <Box sx={{
                paddingTop: '32px',
                paddingBottom: '44px',
                px: '33px',
                boxShadow: '0px 2px 4px 0px rgba(13, 10, 44, 0.08)',
                borderRadius: '20px'
              }}>
                <Typography variant='h4' sx={{
                  color: '#9291A5',
                  fontSize: '1.2rem',
                  fontWeight: 400,
                  lineHeight: '20px',
                  marginBottom: '4px'
                }}>Statistics</Typography>
                <Typography variant='h2' sx={{
                  color: '#1E1B39',
                  fontSize: '1.375rem',
                  fontWeight: 700,
                  lineHeight: '28px',
                  borderBottom: '1px solid #E5E5EF',
                  paddingBottom: '1.375rem'
                }}>Yearly income</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center', position: 'relative' }}>

                  <PieChart
                    margin={{ left: -30 }}
                    series={[
                      {
                        data: dataChart,
                        innerRadius: 85,
                        outerRadius: 100,
                        paddingAngle: 3,
                        cornerRadius: 28,
                        startAngle: -141,
                        endAngle: 180,
                        cx: 150,
                        cy: 150,


                      }
                    ]}
                    colors={colors}
                    width={300}
                    height={300}
                    slotProps={{
                      legend: {
                        hidden: true
                      },
                    }}

                  // loading={true}
                  />
                  <Box sx={{
                    position: 'absolute',
                    textAlign: 'center',
                    top: '50%',
                    left: '43%',
                    transform: 'translate(-50%, -50%)',
                  }}>
                    <Typography variant='p' sx={{
                      color: '#615E83',
                      textAlign: 'center',
                      fontSize: '16px'
                    }}>Total income </Typography>
                    <Typography variant='h3' sx={{
                      color: '#1E1B39',
                      textAlign: 'center',
                      fontSize: '22px',
                      fontWeight: '700'
                    }}>$54,000.00</Typography>

                  </Box>
                </Box>
                <Box sx={{
                  marginTop: "30px",
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '40px'
                }}>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Icon icon="tabler:point-filled" fontSize="35px" style={{ color: '#1068A8' }} />
                    <Typography variant='p' sx={{
                      color: '#9291A5'
                    }}>Salary</Typography>
                    <Typography variant='p' sx={{
                      color: '#1E1B39', fontWeight: 500
                    }}>65%</Typography>

                  </Box>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Icon icon="tabler:point-filled" fontSize="35px" style={{ color: '#F0E5FC' }} />
                    <Typography variant='p' sx={{
                      color: '#9291A5'
                    }}>Investments</Typography>
                    <Typography variant='p' sx={{
                      color: '#1E1B39', fontWeight: 500
                    }}>35%</Typography>

                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Box sx={{
                paddingTop: '32px',
                paddingBottom: '44px',
                px: '33px',
                boxShadow: '0px 2px 4px 0px rgba(13, 10, 44, 0.08)',
                borderRadius: '20px'
              }}>
                <Typography variant='h4' sx={{
                  color: '#9291A5',
                  fontSize: '1.2rem',
                  fontWeight: 400,
                  lineHeight: '20px',
                  marginBottom: '4px'
                }}>Statistics</Typography>
                <Typography variant='h2' sx={{
                  color: '#1E1B39',
                  fontSize: '1.375rem',
                  fontWeight: 700,
                  lineHeight: '28px',
                  borderBottom: '1px solid #E5E5EF',
                  paddingBottom: '1.375rem'
                }}>Weekly revenue</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center', width: '100%' }}>
                  <ResponsiveContainer width={'100%'} height={300}>
                    <BarChart
                      width={433}
                      height={300}
                      data={dataBar}
                      margin={{
                        top: 20,
                        left: -15,
                        bottom: 5,
                      }}
                      barGap={10}
                    >

                      <XAxis dataKey="name" axisLine={false} />
                      <YAxis axisLine={false} unit={"k"} />
                      <RechartTooltip />
                      <Bar dataKey="pv" fill="#1068A8" background={{ fill: '#F8F8FF' }} radius={[0, 0, 11, 11]} />
                      <ReferenceLine x="Wed" stroke="#93AAFD" strokeDasharray="3 3" />
                      <ReferenceDot x="Wed" y={40} fill="#1068A8" stroke="#fff" />

                    </BarChart>
                  </ResponsiveContainer>

                </Box>

              </Box>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Box sx={{
                paddingTop: '32px',
                paddingBottom: '44px',
                px: '33px',
                boxShadow: '0px 2px 4px 0px rgba(13, 10, 44, 0.08)',
                borderRadius: '20px'
              }}>
                <Typography variant='h4' sx={{
                  color: '#9291A5',
                  fontSize: '1.2rem',
                  fontWeight: 400,
                  lineHeight: '20px',
                  marginBottom: '4px'
                }}>Revenue</Typography>
                <Typography variant='h2' sx={{
                  color: '#1E1B39',
                  fontSize: '1.375rem',
                  fontWeight: 700,
                  lineHeight: '28px',
                  borderBottom: '1px solid #E5E5EF',
                  paddingBottom: '1.375rem'
                }}>$12,875</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center', width: '100%' }}>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart
                      width={265}
                      height={150}
                      data={dataSmall}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >

                      <XAxis dataKey="name" hide={true}/>
                      <YAxis hide={true} />
                      <RechartTooltip />
                      <Bar dataKey="amt" stackId="a" fill="#1068A880" radius={[8, 8, 8, 8]} barSize={10} />
                      <Bar dataKey="pv" stackId="a" fill="#1068A8" radius={[8, 8, 8, 8]} barSize={10} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
                <Box sx={{
                  marginTop:'30px',
                  display:'flex',
                  justifyContent:'space-between',
                  alignContent:'center'
                }}>
                  <Box sx={{
                    display:'flex',
                    justifyContent:'flex-start',
                    alignContent:'center'
                  }}>
                   <Icon icon="tabler:point-filled" fontSize="25px" style={{ color: '#1068A8' }} />
                    <Typography variant='p' sx={{
                      fontSize:"16px",
                      fontWeight:'400',
                      color:'#1E1B39'
                    }}>Product sales</Typography>
                  </Box>
                  <Typography variant='p' sx={{
fontSize:"16px",
fontWeight:'400',
color:'#9291A5'
                  }}>$7,213</Typography>
                </Box>
                <Box sx={{
                  marginTop:'14px',
                  display:'flex',
                  justifyContent:'space-between',
                  alignContent:'center'
                }}>
                  <Box sx={{
                    display:'flex',
                    justifyContent:'flex-start',
                    alignContent:'center'
                  }}>
                   <Icon icon="tabler:point-filled" fontSize="25px" style={{ color: '#1068A8' }} />
                    <Typography variant='p' sx={{
                      fontSize:"16px",
                      fontWeight:'400',
                      color:'#1E1B39'
                    }}>Product sales</Typography>
                  </Box>
                  <Typography variant='p' sx={{
fontSize:"16px",
fontWeight:'400',
color:'#9291A5'
                  }}>$7,213</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid> */}
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={dataLTransaction?.docs ?? []}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            loading={LoadingService}
            paginationMode='server'

            pagination
            rowCount={dataLTransaction?.totalDocs}
            getRowId={(row) => row?._id} // Specify the custom ID function
            sx={{
              '& .super-app-theme--header': {
                backgroundColor: '#EFF5FA',

              },

            }}
          />
        </Card>
      </Grid>
      <UpdatePercentage open={openTransaction} setOpenTrasaction={setOpenTrasaction} handleReload={handleReload} />
    </Grid>
  )
}

export default Payments
