import React from 'react'
import { useRouter } from 'next/router'

// ** React Imports
import { useState, useEffect } from 'react'

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

import EditPaymentNumber from './editPaymentNumber'

import AddPaymentNumber from './addPaymentNumber'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  fontSize: theme.typography.body1.fontSize,
  color: `${theme.palette.primary.main} !important`
}))

const defaultColumns = [
  {
    flex: 0.2,
    field: 'id',
    minWidth: 100,
    headerName: 'ID',
    renderCell: ({ row }) => <Typography component={LinkStyled} href='#'>{`#${row?.id}`}</Typography>
  },

  {
    flex: 0.2,
    minWidth: 100,
    field: 'contactNumber',
    headerName: 'Contact Number ',
    renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{row?.contactNumber}</Typography>
  },

  {
    flex: 0.1,
    minWidth: 100,
    field: 'isActive',
    headerName: 'isActive',
    renderCell: ({ row }) => (
      <Typography sx={{ color: 'text.secondary' }}>{row?.is_active === true ? 'true' : 'false'}</Typography>
    )
  }
]

const VodafoneCash = () => {
  // ** State
  const [data, setDates] = useState([])
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [editPaymentContactId, setEditPaymentContactId] = useState()

  const handleAddClickOpen = () => setOpenAdd(true)
  const handleEditClickOpen = () => setOpenEdit(true)

  const router = useRouter()

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
          setEditPaymentContactId(id)
          setOpenEdit(true)
        }

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Delete area'>
              <IconButton size='small' sx={{ color: 'text.secondary' }}>
                <Icon icon='tabler:trash' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Edit'>
              <IconButton size='small' onClick={() => handleEditClick(row?.id)}>
                <Icon icon='tabler:edit' />
              </IconButton>
            </Tooltip>
          </Box>
        )
      }
    }
  ]

  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/paymentContact`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      setDates(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

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
              sx={{ color: 'white', '& svg': { mr: 2, color: 'white' } }}
              onClick={handleAddClickOpen}
            >
              <Icon fontSize='1.125rem' icon='tabler:plus' />
              Add New Number
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

            // onRowSelectionModelChange={rows => setSelectedRows(rows)}
          />
        </Card>
      </Grid>
      <AddPaymentNumber
        open={openAdd}
        addPaymentContactId={editPaymentContactId}
        onClose={() => {
          setOpenAdd(false)
        }}
        fetchData={fetchData}
      />
      <EditPaymentNumber
        open={openEdit}
        editPaymentContactId={editPaymentContactId}
        onClose={() => {
          setOpenEdit(false)
        }}
        fetchData={fetchData}
      />
    </Grid>
  )
}

export default VodafoneCash
