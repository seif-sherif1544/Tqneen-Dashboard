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
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { Button } from '@mui/material'

import axios from 'axios'

import baseUrl from 'src/API/apiConfig'
import AddSubAdmin from './addSubAdmin'
import EditSubAdmin from './editSubAdmin'
import toast from 'react-hot-toast'

// ** Styled Components

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  fontSize: theme.typography.body1.fontSize,
  color: `${theme.palette.primary.main} !important`
}))

const defaultColumns = [
  {
    flex: 0.1,
    field: 'id',
    minWidth: 100,
    headerName: 'ID',
    renderCell: ({ row }) => <Typography component={LinkStyled} href='#'>{`#${row?.id}`}</Typography>
  },

  {
    flex: 0.1,
    minWidth: 100,
    field: 'first_name',
    headerName: 'name',
    renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{row?.first_name} </Typography>
  },

  {
    flex: 0.1,
    minWidth: 100,
    field: 'phone',
    headerName: 'phone',
    renderCell: ({ row }) => <Typography sx={{ display: 'flex', color: 'text.secondary' }}>{row?.phone}</Typography>
  },

  {
    flex: 0.15,
    minWidth: 100,
    field: 'isActive',
    headerName: 'isActive',
    renderCell: ({ row }) => (
      <Typography sx={{ color: 'text.secondary' }}>{row?.is_active === true ? 'active' : 'not active'}</Typography>
    )
  },
  {
    flex: 0.15,
    minWidth: 100,
    field: 'mail',
    headerName: 'mail',
    renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{row?.email}</Typography>
  },
  {
    flex: 0.15,
    minWidth: 100,
    field: 'sub admin',
    headerName: 'sum admin',
    renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>Sub Admin</Typography>
  }
]

/* eslint-enable */
const SubAdmins = () => {
  // ** State
  const [data, setDates] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [editUserId, setEditUserId] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Handle Edit dialog
  const handleAddClickOpen = () => setOpenAdd(true)
  const handleEditClickOpen = () => setOpenEdit(true)

  // const handleDeleteSubAdmin = async (id)=>{
  //   try{
  //     setDeleteLoading(true);
  //     if(id !== "" && id !== undefined && id !== null){
  //       const response = await axios.put(`${baseUrl}/api/topics/${id}`,{
  //         is_active:false
  //       },{
  //         headers:{
  //           Authorization:`Bearer ${localStorage.getItem("token")}`
  //         }
  //       });
  //       if(response?.status === 200){
  //         toast.success("Delete Successfully");
  //         setDeleteLoading(false);
  //         fetchData();
  //       }
  //     }
  //   }catch(error){
  //     console.log(error)
  //     toast.error(error?.message);
  //     setDeleteLoading(false);
  //   }
  // }

  const columns = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => {
        const handleEditClick = id => {
          setEditUserId(id)
          handleEditClickOpen()
        }

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Delete city'>
              <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={() => handleDeleteCustomer(row?.id)}>
                <Icon icon='tabler:trash' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Edit'>
              {/* <Link href={`/editcityid/${row.id}`}> */}
              <IconButton size='small' onClick={() => handleEditClick(row?.id)}>
                <Icon icon='tabler:edit' />
              </IconButton>
              {/* </Link> */}
            </Tooltip>
          </Box>
        )
      }
    }
  ]

  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/admin/users?type=subAdmin`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = response?.data?.docs
      setDates(data)
      console.log(data)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error?.response?.data?.message)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDeleteCustomer = editUserId => {
    try {
      if (editUserId !== '' && editUserId !== undefined && editUserId !== null) {
        axios
          .delete(`${baseUrl}/api/admin/users/${editUserId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
          .then(response => {
            console.log('User deleted successfully')
            toast.success('User deleted successfully')
            fetchData()
          })
          .catch(error => {
            // Handle any errors that occur during the request
            console.error('Failed to delete user', error)
          })
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message)
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box
          sx={{
            py: 0,
            px: 0,
            display: 'flex',
            float: 'right'
          }}
        >
          <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap' }}>
            <Button
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
              onClick={handleAddClickOpen}
            >
              <Icon fontSize='1.125rem' icon='tabler:plus' />
              Add New User
            </Button>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <DataGrid
            autoHeight
            pagination
            rowHeight={62}
            rows={data ?? []}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>
      <AddSubAdmin
        open={openAdd}
        onClose={() => {
          setOpenAdd(false)
        }}
        fetchData={fetchData}
      />
      <EditSubAdmin
        open={openEdit}
        onClose={() => {
          setOpenEdit(false)
        }}
        userID={editUserId}
        fetchData={fetchData}
      />
    </Grid>
  )
}

export default SubAdmins
