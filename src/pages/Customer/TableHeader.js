// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { convertJsonToExcel } from 'src/@core/utils/convertToExcelFile'
import { MenuItem, Select, Typography } from '@mui/material'

const TableHeader = props => {
  // ** Props
  const { handleFilter, toggle, value, data } = props

  const changeRowDataKeys = (data) => {
    const newArr = data?.map((obj) => {
      const newObj = {};

      //You have to add a condition on the Object key name and perform your actions

      Object.keys(obj).forEach((key) => {
        if (key === "_id") {
          newObj._id = obj._id;
        } else if (key === "first_name") {
          newObj.first_name = obj.first_name;
        } else if (key === "last_name") {
          newObj.last_name = obj.last_name;
        } else if (key === "gender") {
          newObj.gender = obj.gender;
        } else if (key === "type") {
          newObj.type = obj.type;
        } else if (key === "address") {
          newObj.address = obj.address;
        } else if (key === "phone") {
          newObj.phone = obj.phone;
        } else if (key === "area") {
          newObj.area = obj?.area?.name?.ar;
          newObj.city = obj?.area?.city?.name?.ar;
        }
        else {
          newObj[key] = obj[key];
        }
      });
      let keys = [];
      Object.keys(newObj).forEach((key) => {
        keys.push(key);
      });
      const order = ["_id", "first_name", "last_name", "gender", "type", "address", "phone", "area"];

      const newOrderdObj = order.reduce((obj, key) => {

        if (!newObj[key]) {
          obj[key] = "N/A";
        } else {
          obj[key] = newObj[key];
        }

        return obj;

      }, {});

      return newOrderdObj;
    });

    return newArr;
  };
  const onBtnExport = () => convertJsonToExcel(changeRowDataKeys(data), "Customer");

  return (
    <Box
      sx={{
        py: 4,
        px: 6,
        rowGap: 2,
        columnGap: 4,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography variant='h1' sx={{ fontSize: '2rem', fontWeight: 400, color: '#000' }}>All Customers</Typography>

      </Box>
      <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <CustomTextField
          value={value}
          sx={{ mr: 4 }}
          InputProps={{
            startAdornment: (
              <Icon icon={"mynaui:search"} color={"#64656980"}
                fontSize={'1.6rem'} />
            )
          }}
          placeholder='Search'
          onChange={e => handleFilter(e.target.value)}
        />
        <Button color='secondary' variant='outlined' sx={{
          paddingY: "0.9rem",
          borderColor: '#64656980',
          color: "#64656980",
          marginRight: 2
        }} startIcon={<Icon icon='tabler:upload' />} onClick={() => onBtnExport()}>
          Export
        </Button>
        <Select
          IconComponent={"span"}
          displayEmpty
          sx={{

            paddingRight: 0,
            marginRight: 4,

            '& .MuiSelect-select': {
              display: 'flex',
              justifyContent: 'flex-end',
            },

            '& .MuiSelect-select-MuiInputBase-input-MuiInputBase-input.MuiSelect-select': {
              minWidth: '4rem !important',
              padding: "14.5px 14px"
            },


            // '& .MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select': {

            // },

          }}
          onChange={(e) => handleFilter('', e?.target?.value)}
          defaultValue={"Filter"}
          renderValue={(value) => {
            return (
              <Box sx={{ display: "flex", gap: 1, paddingLeft: '0px', color: "#64656980" }}>
                <Icon icon='hugeicons:menu-08' />
                {value}
              </Box>
            );
          }}
        >

          <MenuItem value='true'>True</MenuItem>
          <MenuItem value='false'>False</MenuItem>
        </Select>
        <Button onClick={toggle} variant='contained' sx={{
          '& svg': { mr: 2 }, py: "13.2px",
          px: "34.5px",
          fontSize: "18px",
          fontWeight: 700,
          color: "#fff",
          backgroundColor: "#1068A8",
          '&:hover': {
            backgroundColor: "#1174bb"
          }
        }}>
          <Icon fontSize='1.125rem' icon='tabler:plus' />
          Add Customer
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeader
