
import { Grid } from '@mui/material';
import UserViewLeft from './appointmentView'

const AppointmentProfile = () => {

  return (
    <div>
      <Grid container spacing={6}>
        <Grid item xs={12} md={12} lg={12}>
          <UserViewLeft/>
        </Grid>

      </Grid>
    </div>
  );
};

export default AppointmentProfile;
