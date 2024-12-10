// ** React Imports
import { useState, useEffect } from 'react'

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
import { useDispatch, useSelector } from 'react-redux'

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
import TableHeader from './TableHeader'
import SidebarLawyer from './CreateLawyer'
import { useAsync } from 'src/hooks/useAsync'
import { useCallback } from 'react'
import baseUrl from 'src/API/apiConfig'


// ** renders client column
const userStatusObj = {
  true: 'success',
  pending: 'warning',
  false: 'secondary'
}



// ** renders client column
const renderClient = row => {
  if (row.gender.length) {
    return <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor}
        sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
      >
        {getInitials(row.fullName ? row.fullName : 'Layer Name')}
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

  // const handleDelete = () => {
  //   dispatch(deleteUser(id))
  //   handleRowOptionsClose()
  // }

  return (
    <>
      <MenuItem
        component={Link}
        sx={{ '& svg': { mr: 2 } }}
        href={`/Lawyer/Profile/LawyerProfile/${id}`}
        onClick={handleRowOptionsClose}
      >
        <Icon icon='tabler:eye' fontSize={20} />
      </MenuItem>
    </>
  )
}

const ListAllData = ({ apiData }) => {
  // ** State

  const [value, setValue] = useState('')

  // const [status, setStatus] = useState('')

  const [addUserOpen, setAddUserOpen] = useState(false)

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // const [data, setData] = useState([]);

  const [error, setError] = useState(null);

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])


  const { data, execute: fetchLawyerData, status, loading } = useAsync(() => axios.get(`${baseUrl}/api/admin/users?type=lawyer`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }), { immediate: true })

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTY1YTM1NjNhMjE2N2Q3NDUxNTRhZGEiLCJ0eXBlIjoiYWRtaW4iLCJpZCI6MSwiaWF0IjoxNzAxMTYwNDI1fQ.JruvwV_Xqa1-jTXFk1osKrpzNzMMUVKnAdyC4H5Ei_M';

  //       const headers = {
  //         Authorization: `Bearer ${token}`
  //       };

  //       console.log(response.data);

  //       setData(response.data);
  //     } catch (error) {
  //       console.error(error);
  //       setError(error.message);
  //     }
  //   };

  //   fetchData();
  // }, []);

  if (error) {
    return <p>Error: {error}</p>;
  }

  const columns = [
    {
      flex: 0.1,
      minWidth: 200,
      field: 'first_name',
      headerName: 'Name',
      renderCell: ({ row }) => {
        const { first_name, last_name, email } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                component={Link}
                href={`/Lawyer/Profile/LawyerProfile/${row.id}`}
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
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.10,
      minWidth: 100,
      headerName: 'Phone',
      field: 'phone',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.phone}
          </Typography>
        )
      }
    },
    {
      flex: 0.10,
      minWidth: 50,
      headerName: 'gender',
      field: 'gender',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.gender}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 190,
      minWidth: 50,
      field: 'address',
      headerName: 'Address',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ color: 'text.secondary' }}>
            {row.address}
          </Typography>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'is_active',
      headerName: 'is active',
      renderCell: ({ row }) => {

        const turu = true;

        return (
          <CustomChip
            rounded
            skin='light'
            size='small'
            label={row.is_active === turu ? "active" : "not active"}
            color={userStatusObj[row.is_active]}
            sx={{ textTransform: 'capitalize' }}
          />
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: true,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => <RowOptions id={row.id} />
    }
  ]

  // ** Hooks

  const toggleSidebarLawyer = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        {apiData && (<Grid container spacing={6}>
          {apiData.statsHorizontalWithDetails.map((item, index) => {
            return (<Grid item xs={12} md={3} sm={6} key={index}>
              <CardStatsHorizontalWithDetails {...item} />
            </Grid>
            )
          })}
        </Grid>
        )}
      </Grid>
      <Grid item xs={12}>
        <Card>
          <Divider sx={{ m: '0 !important' }} />
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleSidebarLawyer} />
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={data ?? []}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            loading={loading}
          />
        </Card>
      </Grid>
      <SidebarLawyer open={addUserOpen} toggle={toggleSidebarLawyer} fetchLawyerData={fetchLawyerData} />
    </Grid>
  )
}

export default ListAllData
