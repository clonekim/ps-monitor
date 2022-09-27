import React from 'react';
import { Box } from '@mui/material';
import { useProcess } from '../store';
import Grid from '../components/Grid';
import Column from '../components/Column';

const columns = [
  { headerName: 'Name', field: 'Name' },
  { headerName: 'Pid', field: 'Id', width: 100 },
  { headerName: 'Ppid', field: 'Ppid', width: 100 },
  { headerName: 'Owner', field: 'Owner', width: 100 },
  {
    headerName: 'Status',
    field: 'status',
    width: 120,
    valueFormatter: ({ data }) => data.Status.join(', '),
  },
  { headerName: 'Terminal', field: 'Terminal', width: 80 },
  { headerName: 'CreateTime', field: 'CreateTime', width: 190 },
  {
    headerName: 'Children',
    valueFormatter: ({ data }) => (data.Children || []).length,
  },
];

function ProcessGrid({ rowData }) {
  const { setContent } = useProcess();
  const [children, setChildren] = React.useState([]);

  const gridOptions = {
    rowSelection: 'single',
    onGridReady: event => {},

    onRowClicked: ({ data }) => {
      setContent(data);
      setChildren((data || {}).Children || []);
    },
  };

  const gridOptions2 = {
    rowSelection: 'single',

    onRowClicked: ({ data }) => {
      setContent(data);
    },
  };

  return (
    <>
      <Grid
        rowData={rowData}
        columns={columns}
        gridOptions={gridOptions}
        height={300}
      />
      {children.length > 0 && (
        <Box sx={{ py: 2 }}>
          <Column title='Children'>
            <Grid
              rowData={children}
              columns={columns}
              height={180}
              gridOptions={gridOptions2}
            />
          </Column>
        </Box>
      )}
    </>
  );
}

export default ProcessGrid;
