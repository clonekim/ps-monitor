import React from 'react';
import { Box } from '@mui/material';
import Grid from '../components/Grid';
import Column from '../components/Column';

const columns = [
  {
    headerName: '',
    field: 'row',
    width: 800,
  },
];

function Pstree({ id, rowData }) {
  return (
    <Box sx={{ py: 2, px: 2 }}>
      <Column title={`Pstree ${id}`}>
        <Grid rowData={rowData} columns={columns} height={160} />
      </Column>
    </Box>
  );
}

export default Pstree;
