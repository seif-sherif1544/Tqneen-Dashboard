
import { Grid } from '@mui/material';
import RequestView from './requestview';

const RequestProfile = () => {

  return (
    <div>
      <Grid container spacing={6}>
        <Grid item xs={12} md={12} lg={12}>
          <RequestView/>
        </Grid>

      </Grid>
    </div>
  );
};

export default RequestProfile;
