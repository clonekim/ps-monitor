import React from 'react';
import { Divider, FormControl, Typography } from '@mui/material';

function Column({ title, value, children, head = false, divider = false }) {
  return (
    <>
      {head ? (
        <Typography variant='h6'>{title}</Typography>
      ) : (
        <Typography>{title}</Typography>
      )}

      {divider && <Divider />}

      <FormControl fullWidth>
        {children ? children : <Typography padding={1}>{value}</Typography>}
      </FormControl>
    </>
  );
}

export default Column;
