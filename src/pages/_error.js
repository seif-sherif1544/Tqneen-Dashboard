// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports

// ** Styled Components
const BoxWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw'
  }
}))

const Img = styled('img')(({ theme }) => ({
  [theme.breakpoints.down('lg')]: {
    height: 450,
    marginTop: theme.spacing(10)
  },
  [theme.breakpoints.down('md')]: {
    height: 400
  },
  [theme.breakpoints.up('lg')]: {
    marginTop: theme.spacing(20)
  }
}))

const ErrorPage = () => {
  return (
    <Box className='content-center'>
      <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <BoxWrapper>
          <Typography variant='h2' sx={{ mb: 1.5 }}>
            An Error occurred :(
          </Typography>
          <Typography sx={{ mb: 6, color: 'text.secondary' }}>
            Oops! 😖 Something went wrong please try again later.
          </Typography>
          <Button href='/Lawyer' component={Link} variant='contained' sx={{color:'white'}}>
            Back to Home
          </Button>
        </BoxWrapper>
        {/* <Img height='500' alt='error-illustration' src='/images/pages/404.png' /> */}
      </Box>
    </Box>
  )
}
ErrorPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default ErrorPage
