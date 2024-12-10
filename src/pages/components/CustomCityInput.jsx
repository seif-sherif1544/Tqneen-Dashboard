import { Autocomplete, Grid } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'
import baseUrl from 'src/API/apiConfig'
import { useAsync } from 'src/hooks/useAsync'

const CustomCityInput = ({ cities, control, errors, smArea, smCity, handleFieldChange, fieldId }) => {
  const [cityId, setCityId] = useState('')
  const [searchArea, setSearchArea] = useState('')
  const [searchCity, setSearchCity] = useState('')

  const {
    data: areas,
    execute: fetchAreasData,
    status: statusArea,
    loading: AreaLoading
  } = useAsync(
    () =>
      axios.get(`${baseUrl}/api/cities/${cityId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
    { immediate: true }
  )

  useEffect(() => {
    if (cityId !== null && cityId !== undefined && cityId !== '') {
      fetchAreasData()
    }
  }, [cityId])

  const handleCityChange = newValue => {
    setCityId(newValue?.id)
    handleFieldChange(fieldId, { cityId: newValue?.id })
  }

  const handleAreaChange = newValue => {
    handleFieldChange(fieldId, { areaId: newValue?.id })
  }

  return (
    <>
      <Grid
        item
        sx={{
          marginTop: '0.5rem'
        }}
        xs={12}
        sm={smCity}
      >
        <Controller
          name='cityId'
          control={control}
          render={({ field }) => (
            <Autocomplete
              options={cities?.data?.map(city => city) || []}
              getOptionLabel={option => option?.name?.en}
              filter={Autocomplete.caseInsensitive}
              onChange={
                (event, newValue) => handleCityChange(newValue)

                // if (newValue) {
                //   // setCityId(newValue?.id)
                //   handleCityChange(newValue)
                //   // handleFieldChange({ cityIds: [...formValues.cityIds, newValue?.id] })
                //   field.onChange(newValue?.id)
                // }
              }
              renderInput={params => (
                <CustomTextField
                  {...params}
                  label='Select City'
                  placeholder='Search City...'
                  error={!!errors?.cityId}
                  helperText={errors?.cityId?.message}
                  required
                  sx={{
                    backgroundColor: '#fff !important',
                    '& .Mui-selected': {
                      backgroundColor: '#fff !important',
                      paddingY: '1rem !important'
                    },
                    '&:hover .Mui-selected': {
                      backgroundColor: '#fff !important'
                    },
                    '& .MuiAutocomplete-inputRoot.MuiInputBase-sizeSmall': {
                      padding: '10px 0 !important' // Add padding to the input itself
                    }
                  }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option?.id}>
                  {option?.name?.en}
                </li>
              )}
              inputValue={searchCity}
              onInputChange={(event, newInputValue) => {
                setSearchCity(newInputValue)
              }}
              noOptionsText='No cities found'
              fullWidth
            />
          )}
        />
      </Grid>
      <Grid
        item
        sx={{
          marginTop: '0.5rem'
        }}
        xs={12}
        sm={smArea}
      >
        <Controller
          name='areaId'
          control={control}
          render={({ field }) => {
            return (
              <Autocomplete
                options={areas?.data?.areas?.map(area => area) || []}
                getOptionLabel={option => option?.name?.en}
                filter={Autocomplete.caseInsensitive}
                onChange={
                  (event, newValue) => handleAreaChange(newValue)

                  // if (newValue) {
                  //   handleFieldChange({ areaIds: [...formValues.areaIds, newValue?.id] })
                  //   field.onChange(newValue?.id)
                  // }
                }
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    label='Select Area'
                    placeholder='Search area...'
                    error={!!errors?.areaId}
                    helperText={errors?.areaId?.message}
                    required
                    sx={{
                      backgroundColor: '#fff !important',
                      '& .Mui-selected': {
                        backgroundColor: '#fff !important',
                        paddingY: '1rem !important'
                      },
                      '&:hover .Mui-selected': {
                        backgroundColor: '#fff !important'
                      },
                      '& .MuiAutocomplete-inputRoot.MuiInputBase-sizeSmall': {
                        padding: '10px 0 !important' // Add padding to the input itself
                      }
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option?.id}>
                    {option?.name?.en}
                  </li>
                )}
                inputValue={searchArea}
                onInputChange={(event, newInputValue) => {
                  setSearchArea(newInputValue)
                }}
                noOptionsText='No areas found'
                fullWidth
              />
            )
          }}
        />
      </Grid>
    </>
  )
}

export default CustomCityInput
