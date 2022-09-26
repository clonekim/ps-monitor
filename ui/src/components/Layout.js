import React from 'react';
import { Box, Stack } from '@mui/material';

function Layout({ left, right, center }) {
  if (center) {
    return <Box sx={{ py: 2, px: 2 }}>{center}</Box>;
  }
  return (
    <Stack direction='row' sx={{ py: 2, px: 5 }} spacing={5}>
      <Box sx={{ width: 0.5 }}>{left}</Box>
      <Box sx={{ width: 0.5 }}>{right}</Box>
    </Stack>
  );
}

export default Layout;
