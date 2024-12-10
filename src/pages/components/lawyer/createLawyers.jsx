// import { Autocomplete, Button, Grid, MenuItem, TextField, Typography } from '@mui/material'
// import axios from 'axios'
// import React, { useEffect, useState } from 'react'
// import { Controller } from 'react-hook-form'
// import Icon from 'src/@core/components/icon'
// import baseUrl from 'src/API/apiConfig'

// const CreateLocations = ({ addresses, cities, addNewAddress, removeAddress, errors, control, index }) => {
//   // const [selectedCityId, setSelectedCityId] = useState('')
//   // const [areas, setAreas] = useState([])
//   // const [selectedAreas, setSelectedAreas] = useState([])
//   // const [selectMainCity, setSelectMainCity] = useState('')

//   // // const fetchAreas = async () => {
//   // //   try {
//   // //     const response = await axios.get(`${baseUrl}/api/cities/` + selectMainCity, {
//   // //       headers: {
//   // //         Authorization: `Bearer ${localStorage.getItem('token')}`
//   // //       }
//   // //     })

//   // //     // Assuming the areas API returns an array of areas for the specified cityId
//   // //     setAreas(response?.data?.data?.areas)
//   // //   } catch (error) {
//   // //     console.error('Error fetching areas:', error)

//   // //     return []
//   // //   }
//   // // }

//   // // useEffect(() => {
//   // //   if (selectMainCity !== '' && selectMainCity !== undefined && selectMainCity !== null) {
//   // //     fetchAreas()
//   // //   }
//   // // }, [selectMainCity])

//   // const fetchSelectedAreas = async cityId => {
//   //   try {
//   //     const response = await axios.get(`${baseUrl}/api/cities/` + cityId, {
//   //       headers: {
//   //         Authorization: `Bearer ${localStorage.getItem('token')}`
//   //       }
//   //     })

//   //     // Assuming the areas API returns an array of areas for the specified cityId
//   //     if (response?.status === 200) {
//   //       setSelectedAreas(prev => [...prev, ...response?.data?.data?.areas])
//   //     }
//   //   } catch (error) {
//   //     console.error('Error fetching areas:', error)
//   //     toast.error(error?.response?.data?.message)

//   //     return []
//   //   }
//   // }

//   // useEffect(() => {
//   //   if (selectedCityId !== null && selectedCityId !== undefined && selectedCityId !== '') {
//   //     fetchSelectedAreas(selectedCityId)
//   //   }
//   // }, [selectedCityId])

//   const [selectedCityIds, setSelectedCityIds] = useState([])
//   const [areas, setAreas] = useState([])
//   const [selectedAreas, setSelectedAreas] = useState([])

//   const fetchAreas = async cityIds => {
//     const allAreas = []
//     for (const cityId of cityIds) {
//       try {
//         const response = await axios.get(`${baseUrl}/api/cities/` + cityId, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         })

//         allAreas.push(...response.data.data.areas)
//       } catch (error) {
//         console.error('Error fetching areas:', error)
//       }
//     }
//     setAreas(allAreas)
//   }
//   console.log(areas)

//   useEffect(() => {
//     fetchAreas(selectedCityIds)
//   }, [selectedCityIds])

//   const handleCityChange = (event, newValue) => {
//     const newCityIds = newValue.map(city => city.id)
//     setSelectedCityIds(newCityIds)
//   }

//   const handleRemoveCity = cityId => {
//     setSelectedCityIds(prev => prev.filter(id => id !== cityId))
//     setSelectedAreas(prev => prev.filter(area => !areas.some(a => a.id === area && a.cityId === cityId)))
//   }

//   return (
//     <React.Fragment>
//       <Grid item xs={12} sm={5}>
//         <Typography
//           sx={{
//             color: '#0D0E10'
//           }}
//         >
//           Address
//         </Typography>
//         <Controller
//           name={`address${index}`}
//           control={control}
//           rules={{ required: index === 0 }}
//           render={({ field: { value, onChange }, fieldState }) => (
//             <TextField
//               fullWidth
//               value={value}
//               sx={{ mb: 1 }}
//               onChange={onChange}
//               placeholder=''
//               error={Boolean(fieldState?.error)}
//               {...(fieldState?.error && { helperText: fieldState?.error?.message })}
//             />
//           )}
//         />
//       </Grid>
//       {/* <Grid item xs={12} sm={3}>
//         <Typography
//           sx={{
//             color: '#0D0E10'
//           }}
//         >
//           City
//         </Typography>
//         <Controller
//           name={`city${index}`}
//           control={control}
//           rules={{ required: index === 0 }}
//           defaultValue=''
//           render={({ field: { value, onChange }, fieldState }) => {
//             console.log(fieldState)
//             return (
//               <TextField
//                 select
//                 sx={{ mb: 1 }}
//                 fullWidth
//                 SelectProps={{
//                   value: value,
//                   onChange: e => {
//                     onChange(e)
//                     setSelectMainCity(e.target.value)
//                   }
//                 }}
//                 error={Boolean(fieldState?.error)}
//                 aria-describedby='validation-area-select'
//                 {...(fieldState?.error && { helperText: fieldState?.error?.message })}
//               >
//                 <MenuItem value='' disabled>
//                   Select an cities
//                 </MenuItem>
//                 {cities.map(city => (
//                   <MenuItem key={city?.id} value={city?.id}>
//                     {city?.name?.en}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             )
//           }}
//         />
//       </Grid>

//       <Grid item xs={12} sm={3}>
//         <Typography
//           sx={{
//             color: '#0D0E10'
//           }}
//         >
//           Area
//         </Typography>
//         <Controller
//           name={`area_id${index}`}
//           control={control}
//           rules={{ required: index === 0 }}
//           defaultValue=''
//           render={({ field: { value, onChange }, fieldState }) => (
//             <TextField
//               select
//               sx={{ mb: 1 }}
//               fullWidth
//               id='validation-area-select'
//               error={Boolean(fieldState?.error)}
//               aria-describedby='validation-area-select'
//               {...(fieldState?.error && { helperText: fieldState?.error?.message })}
//               SelectProps={{ value: value, onChange: e => onChange(e) }}
//             >
//               <MenuItem value='' disabled>
//                 Select an Area
//               </MenuItem>
//               {areas.map(area => (
//                 <MenuItem key={area?.id} value={area?.id}>
//                   {area?.name?.en}
//                 </MenuItem>
//               ))}
//             </TextField>
//           )}
//         />
//       </Grid> */}
//       <Grid item xs={12} sm={3}>
//         <Typography
//           sx={{
//             color: '#0D0E10'
//           }}
//         >
//           City
//         </Typography>
//         <Controller
//           name={`cities${index}`}
//           control={control}
//           rules={{ required: index === 0 }}
//           defaultValue=''
//           render={({ field: { value, onChange }, fieldState }) => (
//             <Autocomplete
//               multiple
//               options={cities || []}
//               sx={{
//                 '& .MuiAutocomplete-option': {
//                   backgroundColor: '#000 !important'
//                 }
//               }}
//               getOptionLabel={option => option?.name?.ar || ''}
//               onChange={handleCityChange}

//               // onChange={(event, newValue) => {
//               //   // Handle change
//               //   onChange(
//               //     newValue?.map(item => {
//               //       setSelectedCityId(item?.id)

//               //       return item?.id
//               //     })
//               //   ) // Store selected IDs
//               // }}
//               value={value ? cities?.filter(topic => value?.includes(topic?.id)) : []} // Set selected topics
//               renderInput={params => (
//                 <TextField
//                   {...params}
//                   sx={{ mb: 4 }}
//                   fullWidth
//                   error={Boolean(fieldState?.error)}
//                   helperText={fieldState?.error?.message}
//                 />
//               )}
//               renderOption={(props, option) => (
//                 <MenuItem
//                   onClick={e => {
//                     e.stopPropagation() // Prevent triggering onChange
//                     handleRemoveCity(option.id)
//                   }}
//                   {...props}
//                   key={option.id}
//                 >
//                   {option?.name?.ar}
//                 </MenuItem>
//               )}
//             />
//           )}
//         />
//       </Grid>

//       <Grid item xs={12} sm={3}>
//         <Typography
//           sx={{
//             color: '#0D0E10'
//           }}
//         >
//           Area
//         </Typography>
//         <Controller
//           name={`areas${index}`}
//           control={control}
//           rules={{ required: index === 0 }}
//           defaultValue=''
//           render={({ field: { value, onChange }, fieldState }) => (
//             <Autocomplete
//               multiple
//               options={selectedAreas || []}
//               getOptionLabel={option => option?.name?.ar || ''}
//               onChange={(event, newValue) => {
//                 onChange(newValue.map(area => area.id))
//                 setSelectedAreas(newValue)
//               }}

//               // onChange={(event, newValue) => {
//               //   // Handle change
//               //   onChange(
//               //     newValue?.map(item => {
//               //       return item?.id
//               //     })
//               //   ) // Store selected IDs
//               // }}
//               value={value ? selectedAreas?.filter(topic => value?.includes(topic?.id)) : []} // Set selected topics
//               renderInput={params => (
//                 <TextField
//                   {...params}
//                   sx={{ mb: 4 }}
//                   fullWidth
//                   error={Boolean(fieldState?.error)}
//                   helperText={fieldState?.error?.message}
//                 />
//               )}
//               renderOption={(props, option) => (
//                 <MenuItem {...props} key={option.id}>
//                   {option?.name?.ar}
//                 </MenuItem>
//               )}
//             />
//           )}
//         />
//       </Grid>
//       <Grid
//         item
//         xs={12}
//         sm={1}
//         sx={{
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center'
//         }}
//       >
//         {index === 0 ? (
//           <Button
//             onClick={addNewAddress}
//             variant='outlined'
//             sx={{
//               padding: '1rem !important',
//               borderColor: '#D3D3D3',
//               display: 'flex',
//               justifyContent: 'flex-end',
//               alignItems: 'flex-end',
//               mt: '1rem'
//             }}
//           >
//             <Icon icon='ic:sharp-plus' fontSize='1rem' color='#1068A8' />
//           </Button>
//         ) : (
//           <Button
//             onClick={() => removeAddress(index)}
//             variant='outlined'
//             sx={{ padding: '1rem !important', borderColor: '#D3D3D3' }}
//           >
//             <Icon icon='ic:sharp-minus' fontSize='1rem' color='#FF0000' />
//           </Button>
//         )}
//       </Grid>
//     </React.Fragment>
//   )
// }

// export default CreateLocations
import { Autocomplete, Button, Grid, MenuItem, TextField, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import baseUrl from 'src/API/apiConfig'

const CreateLocations = ({ addresses, cities, addNewAddress, removeAddress, errors, control, index }) => {
  const [selectedCityIds, setSelectedCityIds] = useState([])
  const [areas, setAreas] = useState([])
  const [selectedAreas, setSelectedAreas] = useState([])

  const fetchAreas = async cityIds => {
    const allAreas = []
    for (const cityId of cityIds) {
      try {
        const response = await axios.get(`${baseUrl}/api/cities/` + cityId, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        allAreas.push(...response?.data?.data?.areas)
      } catch (error) {
        console.error('Error fetching areas:', error)
      }
    }
    setAreas(allAreas)
  }

  useEffect(() => {
    fetchAreas(selectedCityIds)
  }, [selectedCityIds])

  const handleCityChange = (event, newValue) => {
    const newCityIds = newValue.map(city => city.id)
    setSelectedCityIds(newCityIds)
  }

  const handleRemoveCity = cityId => {
    setSelectedCityIds(prev => prev.filter(id => id !== cityId))
    setSelectedAreas(prev => prev.filter(area => !areas.some(a => a.id === area && a.cityId === cityId)))
  }

  return (
    <React.Fragment>
      <Grid item xs={12} sm={5}>
        <Typography sx={{ color: '#0D0E10' }}>Address</Typography>
        <Controller
          name={`address${index}`}
          control={control}
          rules={{ required: index === 0 }}
          render={({ field: { value, onChange }, fieldState }) => (
            <TextField
              fullWidth
              value={value}
              sx={{ mb: 1 }}
              onChange={onChange}
              placeholder=''
              error={Boolean(fieldState?.error)}
              helperText={fieldState?.error?.message}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={3}>
        <Typography sx={{ color: '#0D0E10' }}>City</Typography>
        <Controller
          name={`cities${index}`}
          control={control}
          rules={{ required: index === 0 }}
          render={({ field: { value, onChange }, fieldState }) => (
            <Autocomplete
              multiple
              options={cities || []}
              getOptionLabel={option => option?.name?.ar || ''}
              onChange={(event, newValue) => {
                onChange(newValue.map(city => city.id)) // Store selected IDs
                handleCityChange(event, newValue)
              }}
              value={value ? cities.filter(city => value.includes(city.id)) : []} // Set selected cities
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
                <MenuItem
                  onClick={e => {
                    e.stopPropagation() // Prevent triggering onChange
                    handleRemoveCity(option.id)
                  }}
                  {...props}
                  key={option.id}
                >
                  {option.name.ar}
                </MenuItem>
              )}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} sm={3}>
        <Typography sx={{ color: '#0D0E10' }}>Area</Typography>
        <Controller
          name={`areas${index}`}
          control={control}
          rules={{ required: index === 0 }}
          render={({ field: { value, onChange }, fieldState }) => (
            <Autocomplete
              multiple
              options={areas || []}
              getOptionLabel={option => option?.name?.ar || ''}
              onChange={(event, newValue) => {
                onChange(newValue.map(area => area.id))
                setSelectedAreas(newValue)
              }}
              value={value ? areas.filter(area => value.includes(area.id)) : []} // Set selected areas
              renderInput={params => (
                <TextField
                  {...params}
                  sx={{ mb: 4 }}
                  fullWidth
                  error={Boolean(fieldState?.error)}
                  helperText={fieldState?.error?.message}
                />
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

export default CreateLocations
