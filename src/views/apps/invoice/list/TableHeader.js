// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

const TableHeader = props => {
  // ** Props
  const { value, selectedRows, handleFilter } = props

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <CustomTextField
          value={value}
          sx={{ mr: 4, mb: 2 }}
          placeholder='Search In Appointment'
          onChange={e => handleFilter(e.target.value)}
        />
        <Button sx={{ mb: 2 }} component={Link} variant='contained' href='/apps/invoice/add'>
          Create Invoice
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeader
