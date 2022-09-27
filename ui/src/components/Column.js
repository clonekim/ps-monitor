import React from 'react';
import { Divider, FormControl, Typography, Box } from '@mui/material';

function Column({
  title,
  value,
  children,
  border = false,
  head = false,
  divider = false,
}) {
  return (
    <>
      {head ? (
        <Typography variant="div">{title}</Typography>
      ) : (
        <Typography>{title}</Typography>
      )}

      {divider && <Divider />}

      <Box sx={border ? { border: 1, p: 0 } : {}}>
        <FormControl fullWidth>
          {children ? children : <Typography padding={1}>{value}</Typography>}
        </FormControl>
      </Box>
    </>
  );
}

export default Column;
