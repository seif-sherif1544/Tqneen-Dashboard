import { yupResolver } from "@hookform/resolvers/yup";
import { Autocomplete, Box, Button, Card, CircularProgress, Grid, MenuItem, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import CustomTextField from "src/@core/components/mui/text-field";
import baseUrl from "src/API/apiConfig";
import { useAsync } from "src/hooks/useAsync";
import UpdateLocations from "src/pages/components/lawyer/updateLocations";
import FileUploaderMultiple from 'src/views/forms/form-elements/file-uploader/FileUploaderMultiple'
import * as Yup from 'yup';

const lawyerValidation = Yup.object().shape({
  first_name: Yup.string().optional().nullable().matches(/^[\p{L}\s]+$/u, "special characters are not allowed"),
  last_name: Yup.string().optional().nullable().matches(/^[\p{L}\s]+$/u, "special characters are not allowed"),
  title: Yup.string().optional().nullable().matches(/^[\p{L}\s]+$/u, "special characters are not allowed"),
  email: Yup.string().optional().nullable().email(),
  address: Yup.string().optional().nullable().matches(/^[\p{L}\s]+$/u, "special characters are not allowed"),
  phone: Yup.string().optional().nullable().matches(/^01\d{9}$/, 'Should be egyption number'),
  walletNumber: Yup.string().optional().nullable().matches(/^01\d{9}$/, 'Should be egyption number'),
  city: Yup.string().optional().nullable(),
  area_id: Yup.string().optional().nullable(),
  specializations: Yup.array().optional().nullable().of(Yup.string()),
  gender: Yup.string().optional().nullable(),
  topics: Yup.array().optional().nullable().of(Yup.number()).required("Topics are required"),
  numOfExperience: Yup.number().optional().nullable(),
  password: Yup.string().optional().nullable().min(6, "password length minimum is 6 characters").max(32, "password should be less than 32 characters"),
  fees: Yup.number().optional().nullable(),
  bio: Yup.string().optional().nullable(),
  is_active: Yup.boolean().optional().nullable(),
  avatar: Yup.mixed().optional().nullable()
  , // Validation for avatar
  idImages: Yup.array().optional().nullable()
    .of(Yup.string().url('Must be a valid URL')) // Assuming the IDs are URLs
  , // Validation for ID images
  cardImages: Yup.array().optional().nullable()
    .of(Yup.string().url('Must be a valid URL')) // Assuming the cards are URLs

})


const fakeData = {
  id: '1',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  gender: 'male',
  is_active: true,
  numOfExperience: 5,
  bio: 'Experienced lawyer specializing in corporate law',
  walletNumber: 'W123456',
  walletBalance: 1000,
  fees: 500,
  title: 'Senior Corporate Lawyer',
  avatar: 'https://example.com/avatar.jpg',
  idImages: ['https://example.com/id1.jpg', 'https://example.com/id2.jpg'],
  cardImages: ['https://example.com/card1.jpg', 'https://example.com/card2.jpg'],
  locations: [
    {
      id: 'loc1',
      address: '123 Main Street',
      city: {
        id: 'city1',
        name: {
          en: 'Cairo',
          ar: 'القاهرة'
        }
      },
      area: {
        id: 'area1',
        name: {
          en: 'Maadi',
          ar: 'المعادي'
        }
      }
    },
    {
      id: 'loc2',
      address: '456 Side Street',
      city: {
        id: 'city2',
        name: {
          en: 'Alexandria',
          ar: 'الإسكندرية'
        }
      },
      area: {
        id: 'area2',
        name: {
          en: 'Miami',
          ar: 'ميامي'
        }
      }
    }
  ]
}

const UpdateLawyerData = ({ lawyerId }) => {
  const router = useRouter();
  const [lawyerData, setLawyerData] = useState({})
  if (!lawyerId) {
    router.push("/Lawyer")
  }
  const { data, loading, execute: fetchLawyerData } = useAsync(() => axios.get(`${baseUrl}/api/customer/lawyers/${lawyerId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }), { immediate: false })

  const [addresses, setAddresses] = useState(() => {
    // Initialize with existing locations if available
    return fakeData?.locations?.map(location => ({
      address: location.address,
      cities: [location.city.id], // Initialize as array
      areas: [location.area.id]   // Initialize as array
    })) || [{
      address: '',
      cities: [],
      areas: []
    }];
  });
  console.log("address ", addresses)

  const addNewAddress = () => {
    if (addresses.length < 2) {
      setAddresses(prevAddresses => [
        ...prevAddresses,
        {
          address: '',
          cities: [],
          areas: []
        }
      ]);
    }
  };

  const removeAddress = (index) => {
    setAddresses((prevAddresses) => {
      const updatedAddresses = prevAddresses.filter((_, i) => i !== index);
      reset({
        ...getValues(),
        [`address${index}`]: '',
        [`cities${index}`]: [],
        [`areas${index}`]: []
      });
      return updatedAddresses;
    });
  };


  // const getLawyer = async () => {
  //   try {
  //     const response = await axios.get(`${baseUrl}/api/customer/lawyers/${lawyerId}`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem('token')}`
  //       }
  //     })
  //     if(response?.status === 200){
  //       setLawyerData(response?.data)
  //     }
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message);
  //   }
  // }

  const { data: TopicData, execute: fetchTopicData, status, loading: topicLoading, error: TopicError } = useAsync(() => axios.get(`${baseUrl}/api/topics?limit=1000000`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }), { immediate: true })


  useEffect(() => {
    fetchLawyerData()
  }, [lawyerId])



  const { data: cities, execute: fetchCities } = useAsync(() => axios.get(`${baseUrl}/api/cities`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }), { immediate: true })

  const { data: specializations, execute: fetchSpecialization } = useAsync(() => axios.get(`${baseUrl}/api/specializations?limit=1000000`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }), { immediate: true })

  useEffect(() => {
    fetchCities();
    fetchSpecialization();
    fetchTopicData()
  }, [])

  const fileUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    return await axios.post('https://tqneen-prod-rlyoguxn5a-uc.a.run.app/images', formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,

      }
    })
  }

  const {
    reset,
    control,
    setValue,
    setError,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },

  } = useForm({
    // defaultValues: { "city": 2 },
    mode: 'onChange',

    // resolver: yupResolver(lawyerValidation)
  })





  const handleIdImageUpload = async (fieldName, files) => {
    const filesUrls = []
    for (const file of files) {
      try {
        const response = await fileUpload(file)
        filesUrls.push(response?.data?.url)
      } catch (e) { }
    }
    setValue(fieldName, filesUrls, { shouldValidate: true })
  }

  const handleAvatarImageUpload = async (fieldName, files) => {
    const filesUrls = [];
    try {
      for (const file of files) {
        const response = await fileUpload(file);
        filesUrls.push(String(response?.data?.url));
      }
      setValue(fieldName, filesUrls.join(''), { shouldValidate: true });
    } catch (error) {
      console.error("Error handling avatar image upload:", error);
    }
  };

  const onSubmit = async (values) => {
    const locations = addresses.map((_, index) => ({
      address: formData[`address${index}`],
      cities: formData[`cities${index}`],
      areas: formData[`areas${index}`]
    }));
    console.log(values)
  }


  const handleEditClose = () => {
    router.push("/Lawyer")
  }
  return (
    <>
      {loading ? (
        <Box sx={{
          display: "flex",
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          height: '100vh'
        }}>
          <CircularProgress size={40} />
        </Box>
      ) : (
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card sx={{
              padding: "2rem"
            }}>
              <Typography sx={{
                color: "#000",
                py: "1rem",
                fontSize: '1.5rem',
                textAlign: 'center'
              }}>
                Create Lawyer
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Controller
                      name='first_name'
                      control={control}
                      rules={{ required: true }}
                      defaultValue={data?.first_name}
                      render={({ field: { value, onChange } }) => {
                        console.log(value)
                        return (
                          <CustomTextField
                            fullWidth
                            value={value}
                            sx={{ mb: 4 }}
                            label='First Name'
                            onChange={onChange}
                            placeholder=''
                            error={Boolean(errors?.first_name)}
                            {...(errors?.first_name && { helperText: errors?.first_name?.message })}
                          />
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Controller
                      name='last_name'
                      control={control}
                      rules={{ required: true }}
                      defaultValue={data?.last_name}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          sx={{ mb: 4 }}
                          label='Last Name'
                          onChange={onChange}
                          placeholder=''
                          error={Boolean(errors.last_name)}
                          {...(errors.last_name && { helperText: errors.last_name.message })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Controller
                      name='phone'
                      control={control}
                      defaultValue={data?.phone}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          sx={{ mb: 4 }}
                          label='phone'
                          onChange={onChange}
                          placeholder=''
                          error={Boolean(errors.phone)}
                          {...(errors?.phone && { helperText: errors?.phone?.message })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Controller
                      name='gender'
                      control={control}
                      rules={{ required: true }}
                      defaultValue={data?.gender === "أنثي" ? "female" : data?.gender === "ذكر" ? "male" : data?.gender}
                      render={({ field: { value, onChange, ...rest } }) => {
                        console.log("value", value)
                        return (
                          <CustomTextField
                            select
                            fullWidth
                            sx={{ mb: 4 }}
                            label='gender'
                            id='validation-gender-select'
                            error={Boolean(errors.gender)}
                            aria-describedby='validation-gender-select'
                            {...(errors?.gender && { helperText: errors?.gender?.message })}
                            defaultValue={data?.gender?.toLowerCase()}
                            SelectProps={{ value: value, onChange: e => onChange(e) }}
                            {...rest}
                          >
                            <MenuItem value=''>Select</MenuItem>
                            <MenuItem value={'male'}>Male</MenuItem>
                            <MenuItem value='female'>Fmale</MenuItem>
                          </CustomTextField>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}>

                    <Controller
                      name='is_active'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          select
                          fullWidth
                          sx={{ mb: 4 }}
                          label='Status'
                          id='validation-is_active-select'
                          error={Boolean(errors?.is_active)}
                          aria-describedby='validation-is_active-select'
                          {...(errors?.is_active && { helperText: errors?.is_active?.message })}
                          SelectProps={{ value: value, onChange: e => onChange(e) }}
                        >
                          <MenuItem value=''>is active</MenuItem>
                          <MenuItem value='true'>True</MenuItem>
                          <MenuItem value='false'>False</MenuItem>
                        </CustomTextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Controller
                      name='numOfExperience'
                      control={control}
                      rules={{
                        required: true, pattern: {
                          value: /^[0-9]+$/,
                          message: 'Please enter a number',
                        },
                      }}
                      defaultValue={data?.numOfExperience}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          sx={{ mb: 4 }}
                          label='numOfExperience'
                          onChange={onChange}
                          placeholder=''
                          error={Boolean(errors.numOfExperience)}
                          {...(errors.numOfExperience && { helperText: errors.numOfExperience.message })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Controller
                      name='email'
                      control={control}
                      defaultValue={data?.email}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          type='email'
                          label='Email'
                          value={value}
                          sx={{ mb: 4 }}
                          onChange={onChange}
                          error={Boolean(errors.email)}
                          placeholder=''
                          {...(errors.email && { helperText: errors.email.message })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Typography
                      sx={{
                        color: '#0D0E10',
                        fontSize: '1.025rem',
                        mb: '0.2rem'
                      }}
                    >
                      Password
                    </Typography>
                    <Controller
                      name='password'
                      control={control}
                      rules={{ required: false }}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          fullWidth
                          value={value}
                          sx={{ mb: 4 }}
                          label='password'
                          onChange={onChange}
                          placeholder=''
                          error={Boolean(errors.password)}
                          {...(errors.password && { helperText: errors.password.message })}
                        />

                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Controller
                      name='walletNumber'
                      control={control}
                      defaultValue={data?.walletNumber}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          sx={{ mb: 4 }}
                          label='walletNumber'
                          onChange={onChange}
                          placeholder=''
                          {...(errors?.walletNumber && { helperText: errors?.walletNumber?.message })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Typography
                      sx={{
                        color: '#0D0E10',
                        fontSize: '1.025rem',
                        mb: '0.2rem'
                      }}
                    >
                      Fees
                    </Typography>
                    <Controller
                      name='fees'
                      control={control}
                      rules={{ required: true }}
                      defaultValue={data?.fees}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          fullWidth
                          value={value}
                          sx={{ mb: 4 }}
                          label='fees'
                          onChange={onChange}
                          placeholder=''
                          error={Boolean(errors?.fees)}
                          {...(errors?.fees && { helperText: errors?.fees?.message })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Typography
                      sx={{
                        color: '#0D0E10',
                        fontSize: '1.025rem',
                        mb: '0.2rem'
                      }}
                    >
                      Specializations
                    </Typography>
                    <Controller
                      name="specializations"
                      control={control}
                      render={({ field: { value, ...restFieldOptions } }) => (
                        <TextField
                          select
                          value={value || []}
                          sx={{ mb: 4 }}
                          fullWidth
                          label="specializations"
                          SelectProps={{ multiple: true }}
                          {...restFieldOptions}
                        >
                          <MenuItem value="" disabled>
                            Select an specializations
                          </MenuItem>
                          {specializations?.data?.docs?.map((specialization) => (
                            <MenuItem key={specialization?.id} value={specialization?.id} selected>
                              {specialization?.name?.en}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                      rules={{ required: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Typography
                      sx={{
                        color: '#0D0E10',
                        fontSize: '1.025rem',
                        mb: '0.2rem'
                      }}
                    >
                      Topics
                    </Typography>
                    <Controller
                      name="topics"
                      control={control}
                      rules={{ required: "Required" }}
                      render={({ field: { value, onChange }, fieldState }) => {
                        return (
                          <Autocomplete
                            multiple
                            options={TopicData?.data?.docs || []} // Assuming TopicData contains an array of topics
                            getOptionLabel={(option) => option?.name?.ar || ""}
                            onChange={(event, newValue) => {
                              // Handle change
                              onChange(newValue.map(topic => topic.id));
                            }}
                            value={value ? TopicData?.data?.docs.filter(topic => value.includes(topic.id)) : []}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Topics"
                                sx={{ mb: 4 }}
                                fullWidth
                                error={Boolean(fieldState?.error)}
                                helperText={fieldState?.error?.message}
                              />
                            )}
                            renderOption={(props, option) => (
                              <MenuItem {...props} key={option.id}>
                                {option?.name?.ar}
                              </MenuItem>
                            )}
                          />
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Typography
                      sx={{
                        color: '#0D0E10',
                        fontSize: '1.025rem',
                        mb: '0.2rem'
                      }}
                    >
                      Details
                    </Typography>
                    <Controller
                      name='bio'
                      control={control}
                      rules={{ required: true }}
                      defaultValue={data?.bio}

                      render={({ field: { value, onChange } }) => (
                        <TextField
                          multiline
                          fullWidth
                          rows={4}
                          value={value}
                          sx={{ mb: 4 }}
                          label='bio'
                          onChange={onChange}
                          placeholder=''
                          error={Boolean(errors?.bio)}
                          {...(errors?.title && { helperText: errors?.bio?.message })}
                        />

                      )}
                    />
                  </Grid>
                  {addresses?.map((item, index) => (
                    <UpdateLocations
                      key={index}
                      index={index}
                      cities={cities?.data}
                      addNewAddress={addNewAddress}
                      removeAddress={removeAddress}
                      control={control}
                      errors={errors}
                      addresses={addresses}
                    />
                  ))}
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Controller
                      name='address'
                      control={control}
                      defaultValue={data?.address}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          sx={{ mb: 4 }}
                          label='address'
                          onChange={onChange}
                          placeholder=''
                          error={Boolean(errors.address)}
                          {...(errors.address && { helperText: errors.address.message })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Controller
                      name='walletBalance'
                      control={control}
                      defaultValue={data?.walletBalance}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          value={value}
                          sx={{ mb: 4 }}
                          label='Wallet Balance'
                          onChange={onChange}
                          placeholder=''
                          error={Boolean(errors?.walletBalance)}
                          {...(errors?.walletBalance && { helperText: errors?.walletBalance?.message })}
                        />
                      )}
                    />
                  </Grid>


                  {/* .. City. */}
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Typography
                      sx={{
                        color: '#0D0E10',
                        fontSize: '1.025rem',
                        mb: '0.2rem'
                      }}
                    >
                      City
                    </Typography>
                    <Controller
                      name="city"
                      control={control}
                      defaultValue={data?.city?.toLowerCase()}
                      render={({ field: { onChange, ...rest } }) => (
                        <TextField
                          select
                          sx={{ mb: 4 }}
                          fullWidth
                          label={data?.area.city?.name?.en}
                          onChange={(e) => {
                            console.log(e.target.value);
                          }}
                          defaultValue={data?.city?.id}

                          {...rest}
                        >
                          <MenuItem value="" disabled>
                            Select an cities
                          </MenuItem>
                          {cities?.data?.map((city) => (
                            <MenuItem key={city?.id} value={city?.id}>
                              {city?.name?.en}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}

                    // rules={{ required: true }}

                    />
                  </Grid>
                  {/* <Controller
                  name="area"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      select
                      sx={{ mb: 4 }}
                      fullWidth
                      label={data?.area.name?.en}
                      defaultValue={areas}
                      {...field}
                    >
                      <MenuItem value="" disabled>
                        Select an Area
                      </MenuItem>
                      {selectedCity?.data.areas.map((area) => (
                        <MenuItem key={area.id} value={area?.id}>
                          {area?.name?.en}
                        </MenuItem>
                      ))}

                    </TextField>
                  )}

                /> */}






                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Typography
                      sx={{
                        color: '#0D0E10',
                        fontSize: '1.025rem',
                        mb: '0.2rem'
                      }}
                    >
                      Title
                    </Typography>
                    <Controller
                      name='title'
                      control={control}
                      rules={{ required: true }}
                      defaultValue={data?.title}
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          fullWidth
                          value={value}
                          sx={{ mb: 4 }}
                          label='title'
                          onChange={onChange}
                          placeholder=''
                          error={Boolean(errors?.title)}
                          {...(errors?.title && { helperText: errors?.title?.message })}
                        />

                      )}
                    />
                  </Grid>


                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <Controller
                      name='avatar'

                      control={control}
                      render={({ field: { name } }) =>
                        <FileUploaderMultiple
                          defaultValues={[`${data?.avatar}` || '']}
                          onUploadCallback={handleAvatarImageUpload}
                          name={name} label={"Avatar Images"}
                          helperText={errors?.idImages?.message && errors?.idImages?.message}
                          error={errors?.idImages?.message ? true : false}

                        // helperText={errors?.avatar?.message && errors?.avatar?.message}
                        // error={errors?.avatar?.message ? true : false}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <Controller
                      name='idImages'
                      control={control}
                      defaultValue={data?.idImages}
                      render={({ field: { name } }) =>
                        <FileUploaderMultiple
                          defaultValues={data?.idImages}
                          onUploadCallback={handleIdImageUpload}
                          name={name} label={"Id Images"}
                          helperText={errors?.idImages?.message && errors?.idImages?.message}
                          error={errors?.idImages?.message ? true : false} />
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <Controller
                      name='cardImages'
                      control={control}
                      defaultValue={data?.cardImages}
                      rules={{ required: "shoule be not empty" }}
                      render={({ field: { name } }) =>
                        <FileUploaderMultiple
                          defaultValues={data?.cardImages}
                          onUploadCallback={handleIdImageUpload}
                          name={name}
                          label={"Card Images"}
                          helperText={errors?.cardImages?.message && errors?.cardImages?.message}
                          error={errors?.cardImages?.message ? true : false} />
                      }
                    />
                  </Grid>

                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button type='submit' variant='contained' sx={{
                      mr: 3, color: 'white', '&:hover': {
                        backgroundColor: '#1174bb',
                        color: 'white'
                      }
                    }} disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                    <Button variant='tonal' color='secondary' onClick={handleEditClose}>
                      Cancel
                    </Button>
                  </Box>

                </Grid>

              </form>

            </Card>
          </Grid>
        </Grid >
      )}
    </>
  )
}

export default UpdateLawyerData

export async function getServerSideProps(context) {
  const { params } = context;
  const { lawyerId } = params;

  return {
    props: {
      lawyerId
    }
  }
}
