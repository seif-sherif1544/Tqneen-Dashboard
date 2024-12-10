import styled from '@emotion/styled'
import { Box, Button, Card, Divider, Grid, IconButton, MenuItem, Select, Switch, Tooltip, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import baseUrl from 'src/API/apiConfig'
import Icon from 'src/@core/components/icon'
import AddServices from './addServices'
import EditServices from './editServices'
import { ToggleButton } from '@mui/material';
import ServiceDetails from './serviceDetail'
import CustomDelete from 'src/@core/components/customDelete'
import { useAsync } from 'src/hooks/useAsync'
import { useRouter } from 'next/router'
import { convertJsonToExcel } from 'src/@core/utils/convertToExcelFile'


const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
  },
}));

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  fontSize: theme.typography.body1.fontSize,
  color: `${theme.palette.text.labelBlack} !important`
}))
const label = { inputProps: { 'aria-label': 'Color switch demo' } };

const defaultColumns = [
  {
    flex: 0.1,
    field: 'id',
    minWidth: 100,
    headerName: 'ID',
    headerClassName: 'super-app-theme--header',
    renderHeader: () => <Typography sx={{ fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px' }}>{'ID'}</Typography>,
    renderCell: ({ row }) => <Typography component={LinkStyled} href='#'>{`#${row?.id}`}</Typography>
  },
  {
    flex: 0.2,
    minWidth: 100,
    field: 'title',
    headerName: 'Service',
    renderHeader: () => <Typography sx={{ fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px' }}>{'Service'}</Typography>,
    headerClassName: 'super-app-theme--header',
    renderCell: ({ row }) => (
      <Typography sx={{ display: 'flex', color: 'text.labelBlack', textWrap: 'wrap' }}>{row?.title}</Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 100,
    field: 'fees',
    renderHeader: () => <Typography sx={{ fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px' }}>{'Fees'}</Typography>,
    headerClassName: 'super-app-theme--header',
    headerName: 'Fees',
    renderCell: ({ row }) => <Typography sx={{ color: 'text.labelBlack' }}> {row?.fees}$ </Typography>
  },
  {
    flex: 0.15,
    minWidth: 100,
    field: 'duration',
    headerClassName: 'super-app-theme--header',
    renderHeader: () => <Typography sx={{ fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px', textWrap: 'wrap' }}>{'Duration (days)'}</Typography>,
    headerName: 'Duration(days)',
    renderCell: ({ row }) => <Typography sx={{ color: 'text.labelBlack' }}>{row?.duration}</Typography>
  },
  {
    flex: 0.15,
    minWidth: 100,
    field: 'isActive',
    headerClassName: 'super-app-theme--header',
    renderHeader: () => <Typography sx={{ fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px' }}>{'IsActive'}</Typography>,
    headerName: 'IsActive',
    renderCell: ({ row }) => <Switch  {...label} checked={row?.isActive} onChange={() => {
      const newStatus = !row?.isActive;
      updatePaymentStatus(row?.id, newStatus); // Call the update function
    }}
    />
  }
]

const AllServices = () => {
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
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusValue, setStatusValue] = useState("");

  const router = useRouter();
  const { page, pageSize } = paginationModel;

  const { data: dataLSerivce, execute: fetchServiceData, status, loading: LoadingService } = useAsync(() => axios.get(`${baseUrl}/api/services?page=${page + 1}&limit=${pageSize}${value?.length > 0 ? `&search=${value}` : ''}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }), { immediate: true })

  useEffect(() => {
    fetchServiceData();
  }, [value, page])


  // Handle Edit dialog
  const handleAddClickOpen = () => setOpenAdd(true)
  const handleEditClickOpen = () => setOpenEdit(true)
  const handleDetailClickOpen = () => setDetailOpen(true)
  const handleDeleteClickOpen = () => setOpenDelete(true)

  const handleFilter = useCallback(val => {
    setValue(val)
    setPaginationModel({ page: 0, pageSize: paginationModel.pageSize });
  }, [])



  const updatePaymentStatus = (id, value) => {
    // Make the API call to update the status
    try {
      if (id !== '' && id !== undefined && id !== null) {
        setStatusLoading(true);
        axios
          .put(
            `${baseUrl}/api/services/activate/${id}`,
            { status: value },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          )
          .then(response => {
            // Handle the response
            router.replace(router.asPath)
            console.log('Status updated')
            toast.success("Status Updated successfully")
            fetchServiceData()
            setStatusLoading(false);

            // You can perform additional actions here if needed
          })
          .catch(error => {
            // Handle any network or API call errors
            console.error('Error:', error)
            toast.error(error?.message);
            setStatusLoading(false);

            // You can handle the error or show an error message to the user
          })
      }
    } catch (err) {
      console.log(err?.message);
      toast.error(err?.message);
      setStatusLoading(false);

    }

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

  const columns = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      renderHeader: () => <Typography sx={{
        fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',

      }}>{'Details'}</Typography>,
      headerClassName: 'super-app-theme--header',
      headerName: 'Details',
      renderCell: ({ row }) => {
        const handleEditClick = id => {
          handleEditClickOpen()
          setEditServiceId(id)
        }

        const handleDetailClick = id => {
          handleDetailClickOpen()
          setDetailId(id)
        }

        const handleDeleteClick = id => {
          handleDeleteClickOpen()
          setDeleteId(id)
        }

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Delete Service'>
              <IconButton size='small' sx={{ color: 'text.labelBlack' }} onClick={() => handleDeleteClick(row?.id)}>
                <Icon icon='tabler:trash' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Edit'>
              {/* <Link href={`/editcityid/${row.id}`}> */}
              <IconButton size='small' sx={{ color: "text.labelBlack" }} onClick={() => handleEditClick(row?.id)}>
                <Icon icon='tabler:edit' />
              </IconButton>
              {/* </Link> */}
            </Tooltip>
            {row?.isActive && (<Tooltip title='detail'>
              {/* <Link href={`/editcityid/${row.id}`}> */}
              <IconButton size='small' sx={{ color: "text.labelBlack" }} onClick={() => handleDetailClick(row?.id)}>
                <Icon icon='ph:eye' />
              </IconButton>
              {/* </Link> */}
            </Tooltip>)}
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'status',
      headerName: 'Change status',
      headerClassName: 'super-app-theme--header',
      renderHeader: () => <Typography sx={{
        fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px',

      }}>{'Change status'}</Typography>,
      renderCell: ({ row }) => {
        const isActiveData = row?.isActive ? 'Active' : 'NotActive';

        return (
          <>
            <CustomTextField
              select
              label=''
              defaultValue={isActiveData}
              value={isActiveData}
              disabled={statusLoading}
              onChange={event => updatePaymentStatus(row?.id, event.target.value)}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="NotActive">NotActive</MenuItem>
            </CustomTextField>
          </>
        )
      }
    }
  ]

  const changeRowDataKeys = data => {
    const newArr = data?.map(obj => {
      const newObj = {}

      //You have to add a condition on the Object key name and perform your actions

      Object.keys(obj).forEach(key => {
        if (key === 'id') {
          newObj.id = obj.id
        } else if (key === 'title') {
          newObj.title = obj.title
        } else if (key === 'fees') {
          newObj.fees = obj.fees
        } else if (key === 'isActive') {
          newObj.isActive = obj.isActive
        } else if (key === 'duration') {
          newObj.duration = obj.duration
        } else if (key === 'description') {
          newObj.description = obj.description
        } else if (key === 'createdAt') {
          newObj.createdAt = obj.createdAt
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
  const onBtnExport = () => convertJsonToExcel(changeRowDataKeys(dataLSerivce?.data?.docs), "All Services");


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
              <Typography variant='h1' sx={{ fontSize: '2rem', fontWeight: 400, color: '#000' }}>
                All Services
              </Typography>
            </Box>
            <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              <CustomTextField
                value={value}
                sx={{ mr: 4 }}
                placeholder='Search '
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
              }} startIcon={<Icon icon='tabler:upload' />} onClick={() => onBtnExport()} disabled={!dataLSerivce?.data?.docs}>
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
                  },

                  '& .MuiSelect-select-MuiInputBase-input-MuiInputBase-input.MuiSelect-select': {
                    minWidth: '4rem !important',
                    padding: "14.5px 14px"
                  },


                  // '& .MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select': {

                  // },

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
              </Select> */}
              <Button onClick={handleAddClickOpen} variant='contained' sx={{
                '& svg': { mr: 2 },
                py: "13.2px",
                px: "34.5px",
                fontSize: "18px",
                fontWeight: 700,
                color: "#fff",
                backgroundColor: "#1068A8",
                '&:hover': {
                  backgroundColor: "#1174bb"
                }
              }}>
                <Icon fontSize='1.125rem' icon='tabler:plus' style={{ color: "white" }} />
                Add Service
              </Button>
            </Box>
          </Box>
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={dataLSerivce?.data?.docs ?? []}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            loading={LoadingService}
            paginationMode='server'
            rowCount={dataLSerivce?.data?.totalDocs}
            getRowId={(row) => row?._id} // Specify the custom ID function
            sx={{
              '& .super-app-theme--header': {
                backgroundColor: '#EFF5FA',

              },

            }}
          />
        </Card>
      </Grid>
      <AddServices open={openAdd} setOpenAdd={setOpenAdd} fetchData={fetchServiceData} />
      <EditServices open={openEdit} setOpenEdit={setOpenEdit} editServiceId={editServiceId} fetchData={fetchServiceData} />
      <ServiceDetails open={detailOpen} onClose={() => setDetailOpen(false)} detailId={detailId} />
      <CustomDelete open={openDelete} onClose={() => setOpenDelete(false)} detailId={deleteId} text={"Are you sure to delete the product?"} fetchData={fetchServiceData} />
    </Grid>
  )
}

export default AllServices
