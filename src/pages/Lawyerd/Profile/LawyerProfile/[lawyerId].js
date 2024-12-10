import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid } from '@mui/material';
import LawyerView from './LawyerView'

const LawyerProfile = () => {

  return (
    <div>
      <Grid container spacing={6}>
        <Grid item xs={12} md={12} lg={12}>
          <LawyerView />
        </Grid>

      </Grid>
    </div>
  );
};

export default LawyerProfile;
