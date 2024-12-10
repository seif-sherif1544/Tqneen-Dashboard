import styled from '@emotion/styled'
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Tooltip,
  Typography
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import baseUrl from 'src/API/apiConfig'
import Icon from 'src/@core/components/icon'
import AddRequestServices from './addRequestService'
import EditRequestServices from './editRequestService'
import RequestServiceDetails from './requestServiceDetail'
import CustomDelete from 'src/@core/components/customDelete'
import { useAsync } from 'src/hooks/useAsync'
import { convertJsonToExcel } from 'src/@core/utils/convertToExcelFile'

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  fontSize: theme.typography.body1.fontSize,
  color: `${theme.palette.text.labelBlack} !important`
}))

const defaultColumns = [
  {
    flex: 0.1,
    field: 'id',
    minWidth: 100,
    headerClassName: 'super-app-theme--header',
    headerName: 'User ID',
    renderHeader: () => (
      <Typography sx={{ fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px' }}>
        {'User ID'}
      </Typography>
    ),
    renderCell: ({ row }) => <Typography component={LinkStyled} href='#'>{`#${row?.customerId}`}</Typography>
  },

  {
    flex: 0.2,
    minWidth: 100,
    headerClassName: 'super-app-theme--header',
    field: 'customerFullName',
    headerName: 'Name',
    renderHeader: () => (
      <Typography sx={{ fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px' }}>
        {'Name'}
      </Typography>
    ),
    renderCell: ({ row }) => (
      <Typography sx={{ color: 'text.labelBlack', textWrap: 'wrap' }}>{row?.customerFullName} </Typography>
    )
  },

  {
    flex: 0.2,
    minWidth: 100,
    headerClassName: 'super-app-theme--header',
    field: 'service.title',
    headerName: 'Service',
    renderHeader: () => (
      <Typography sx={{ fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px' }}>
        {'Service'}
      </Typography>
    ),
    renderCell: ({ row }) => (
      <Typography sx={{ display: 'flex', color: 'text.labelBlack', textWrap: 'wrap' }}>
        {row?.service?.title}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 100,
    headerClassName: 'super-app-theme--header',
    field: 'service.fees',
    headerName: 'Fees',
    renderHeader: () => (
      <Typography sx={{ fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px' }}>
        {'Fees'}
      </Typography>
    ),
    renderCell: ({ row }) => <Typography sx={{ color: 'text.labelBlack' }}> {row?.service?.fees}$ </Typography>
  },
  {
    flex: 0.15,
    minWidth: 100,
    headerClassName: 'super-app-theme--header',
    field: 'service.duration',
    headerName: 'Duration(days)',
    renderHeader: () => (
      <Typography sx={{ fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px' }}>
        {'Duration(days)'}
      </Typography>
    ),
    renderCell: ({ row }) => <Typography sx={{ color: 'text.labelBlack' }}>{row?.service?.duration}</Typography>
  },
  {
    flex: 0.15,
    minWidth: 100,
    field: 'status',
    headerClassName: 'super-app-theme--header',
    headerName: 'Status',
    renderHeader: () => (
      <Typography sx={{ fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px' }}>
        {'Status'}
      </Typography>
    ),
    renderCell: ({ row }) => <Typography sx={{ color: 'text.labelBlack' }}>{row?.status}</Typography>
  }
]

const RequestServices = () => {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [editServiceId, setEditServiceId] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailId, setDetailId] = useState('')
  const [openDelete, setOpenDelete] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [statusValue, setStatusValue] = useState('')

  const { page, pageSize } = paginationModel

  const {
    data: dataLSerivce,
    execute: fetchServiceData,
    status,
    loading: LoadingService
  } = useAsync(
    () =>
      axios.get(`${baseUrl}/api/userServices?page=${page + 1}&limit=${pageSize}&search=${value}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
    { immediate: true }
  )

  // Handle Edit dialog
  const handleAddClickOpen = () => setOpenAdd(true)
  const handleEditClickOpen = () => setOpenEdit(true)
  const handleDetailClickOpen = () => setDetailOpen(true)
  const handleDeleteClickOpen = () => setOpenDelete(true)

  const handleFilter = useCallback(val => {
    setValue(val)
    setPaginationModel({ page: 0, pageSize: paginationModel.pageSize })
  }, [])

  useEffect(() => {
    fetchServiceData() // Call the run function to fetch data
  }, [page, value])

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
      headerClassName: 'super-app-theme--header',
      headerName: 'Details',
      renderHeader: () => (
        <Typography sx={{ fontSize: '18px', color: '#161616', fontWeight: 700, lineHeight: '23.4px' }}>
          {'Details'}
        </Typography>
      ),
      renderCell: ({ row }) => {
        const handleEditClick = id => {
          handleEditClickOpen()
          setEditServiceId(id)
        }

        const handleDeleteClick = id => {
          handleDeleteClickOpen()
          setDeleteId(id)
        }

        const handleDetailClick = id => {
          handleDetailClickOpen()
          setDetailId(id)
        }

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* <Tooltip title='Delete Service'>
              <IconButton size='small' sx={{ color: 'text.labelBlack' }} onClick={() => handleDeleteClick(row?._id)}>
                <Icon icon='tabler:trash' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Edit'>
              {/* <Link href={`/editcityid/${row.id}`}>
              <IconButton size='small' sx={{color:"text.labelBlack"}} onClick={() => handleEditClick(row?.id)}>
                <Icon icon='tabler:edit' />
              </IconButton>
              {/* </Link>
            </Tooltip> */}

            <Tooltip title='detail'>
              {/* <Link href={`/editcityid/${row.id}`}> */}
              <IconButton size='small' sx={{ color: 'text.labelBlack' }} onClick={() => handleDetailClick(row?.id)}>
                <Icon icon='ph:eye' />
              </IconButton>
              {/* </Link> */}
            </Tooltip>
          </Box>
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
  const onBtnExport = () => convertJsonToExcel(changeRowDataKeys(dataLSerivce?.data?.docs), 'Requested Services')

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
                Requested Services
              </Typography>
            </Box>
            <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              <CustomTextField
                value={value}
                placeholder='Search Lawyer'
                sx={{
                  mr: 4,
                  '&::placeholder': {
                    color: '#1068A880 !important'
                  }
                }}
                onChange={e => handleFilter(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Icon icon='iconamoon:search-thin' fontSize='1.500rem' style={{ color: '#1068A880' }} />
                    </InputAdornment>
                  )
                }}
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
                disabled={!dataLSerivce?.data?.docs}
              >
                Export
              </Button>
              {/* <Select
                IconComponent={'span'}
                displayEmpty
                sx={{
                  paddingRight: 0,
                  marginRight: 4,

                  '& .MuiSelect-select': {
                    display: 'flex',
                    justifyContent: 'flex-end'
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
                <MenuItem value='true'>True</MenuItem>
                <MenuItem value='false'>False</MenuItem>
              </Select> */}
              <Button
                onClick={handleAddClickOpen}
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
                <Icon fontSize='1.125rem' icon='tabler:plus' style={{ color: 'white' }} />
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
            getRowId={row => row?._id} // Specify the custom ID function
            sx={{
              '& .super-app-theme--header': {
                backgroundColor: '#EFF5FA'
              }
            }}
          />
        </Card>
      </Grid>
      <AddRequestServices open={openAdd} setOpenAdd={setOpenAdd} fetchData={fetchServiceData} />
      <EditRequestServices
        open={openEdit}
        onClose={() => {
          setOpenEdit(false)
        }}
        editServiceId={editServiceId}
        fetchData={fetchServiceData}
      />
      <RequestServiceDetails open={detailOpen} onClose={() => setDetailOpen(false)} detailId={detailId} />
      <CustomDelete
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        detailId={deleteId}
        fetchData={fetchServiceData}
        text={'Are you sure to delete the product?'}
      />
    </Grid>
  )
}

export default RequestServices
