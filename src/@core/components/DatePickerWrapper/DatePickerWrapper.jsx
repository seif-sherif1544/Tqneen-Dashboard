import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Controller } from 'react-hook-form';
import CustomTextField from '../mui/text-field';

const DatePickerWrapper = ({ display, name, control, startDate, endDate, setStartDate, setEndDate, label }) => {
  const CustomInput = forwardRef(({ ...props }, ref) => {
    return <CustomTextField inputRef={ref} {...props} />;
  });

  return (
    <div style={{ display }}>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange } }) => (
          <DatePicker
            selected={name === 'startDate' ? startDate : endDate}
            onChange={data => (name === 'startDate' ? setStartDate(date) : setEndDate(date), onChange(date))}
            id={name}
            autoComplete='off'
            customInput={<CustomInput label={label} />}
          />
        )}
      />
    </div>
  );
};

export default DatePickerWrapper;
