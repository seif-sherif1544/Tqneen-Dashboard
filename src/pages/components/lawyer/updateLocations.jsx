import React, { useEffect, useState } from 'react'
import { Grid, Typography, TextField, Button, Autocomplete, MenuItem } from '@mui/material'
import { Controller } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import axios from 'axios'
import baseUrl from 'src/API/apiConfig'

const UpdateLocations = ({ index, cities, addNewAddress, removeAddress, control, errors, addresses }) => {
  const [selectedCityIds, setSelectedCityIds] = useState([])
  const [areas, setAreas] = useState([])

  const fetchAreas = async cityIds => {
    const allAreas = []
    for (const cityId of cityIds) {
      try {
        const response = await axios.get(`${baseUrl}/api/cities/${cityId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (response?.data?.data?.areas) {
          allAreas.push(...response?.data?.data?.areas)
        }
      } catch (error) {
        console.error('Error fetching areas:', error)
      }
    }
    setAreas(allAreas)
  }

  useEffect(() => {
    if (selectedCityIds.length > 0) {
      fetchAreas(selectedCityIds)
    }
  }, [selectedCityIds])

  const handleCityChange = (event, newValue) => {
    const newCityIds = newValue?.map(city => city?.id)
    setSelectedCityIds(newCityIds)
  }

  return (
    <React.Fragment>
      <Grid item xs={12} sm={5}>
        <Typography sx={{ color: '#0D0E10' }}>Address</Typography>
        <Controller
          name={`address${index}`}
          control={control}
          rules={{ required: index === 0 }}
          defaultValue={addresses[index]?.address || ''}
          render={({ field: { value, onChange }, fieldState }) => (
            <TextField
              fullWidth
              value={value}
              sx={{ mb: 1 }}
              onChange={onChange}
              placeholder='Enter address'
              error={Boolean(fieldState?.error)}
              helperText={fieldState?.error?.message}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={3}>
        <Typography sx={{ color: '#0D0E10' }}>Cities</Typography>
        <Controller
          name={`cities${index}`}
          control={control}
          rules={{ required: index === 0 }}
          defaultValue={addresses[index]?.cities || []}
          render={({ field: { value, onChange }, fieldState }) => (
            <Autocomplete
              multiple
              options={cities || []}
              getOptionLabel={option => option?.name?.ar || ''}
              onChange={(event, newValue) => {
                onChange(newValue.map(city => city?.id))
                handleCityChange(event, newValue)
              }}
              value={value ? cities?.filter(city => value?.includes(city?.id)) : []}
              renderInput={params => (
                <TextField
                  {...params}
                  sx={{ mb: 4 }}
                  fullWidth
                  error={Boolean(fieldState?.error)}
                  helperText={fieldState?.error?.message}
                />
              )}
              renderOption={(props, option) => (
                <MenuItem {...props} key={option?.id}>
                  {option?.name?.ar}
                </MenuItem>
              )}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={3}>
        <Typography sx={{ color: '#0D0E10' }}>Areas</Typography>
        <Controller
          name={`areas${index}`}
          control={control}
          rules={{ required: index === 0 }}
          defaultValue={addresses[index]?.areas || []}
          render={({ field: { value, onChange }, fieldState }) => (
            <Autocomplete
              multiple
              options={areas || []}
              getOptionLabel={option => option?.name?.ar || ''}
              onChange={(event, newValue) => {
                onChange(newValue.map(area => area.id))
              }}
              value={value ? areas?.filter(area => value?.includes(area?.id)) : []}
              renderInput={params => (
                <TextField
                  {...params}
                  sx={{ mb: 4 }}
                  fullWidth
                  error={Boolean(fieldState?.error)}
                  helperText={fieldState?.error?.message}
                />
              )}
              renderOption={(props, option) => (
                <MenuItem {...props} key={option?.id}>
                  {option.name.ar}
                </MenuItem>
              )}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {index === 0 ? (
          <Button
            onClick={addNewAddress}
            variant='outlined'
            sx={{ padding: '1rem !important', borderColor: '#D3D3D3', mt: '1rem' }}
          >
            <Icon icon='ic:sharp-plus' fontSize='1rem' color='#1068A8' />
          </Button>
        ) : (
          <Button
            onClick={() => removeAddress(index)}
            variant='outlined'
            sx={{ padding: '1rem !important', borderColor: '#D3D3D3' }}
          >
            <Icon icon='ic:sharp-minus' fontSize='1rem' color='#FF0000' />
          </Button>
        )}
      </Grid>
    </React.Fragment>
  )
}

export default UpdateLocations
