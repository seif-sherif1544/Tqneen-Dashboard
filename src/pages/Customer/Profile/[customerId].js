import CustomerView from './customer-profile';

import { Grid } from '@mui/material';


const CustomerProfile = () => {

  return (
    <div>
      <Grid container spacing={6} >
        <Grid item xs={12} md={12} lg={12}>
          <CustomerView />
        </Grid>
      </Grid>
    </div>
  );
};

export default CustomerProfile;
