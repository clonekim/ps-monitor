import React from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  IconButton,
  Grid as GridLayout,
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CloseIcon from '@mui/icons-material/Close';
import Layout from '../components/Layout';
import Column from '../components/Column';
import Grid from '../components/Grid';

const columns0 = [
  { headerName: 'key', field: 'key', width: 200 },
  { headerName: 'value', field: 'value', width: 300 },
];

const columns1 = [
  { headerName: 'fd', field: 'fd', width: 50 },
  { headerName: 'family', field: 'family', width: 70 },
  {
    headerName: 'local',
    field: 'localaddr',
    width: 200,
    valueFormatter: ({ data }) => `${data.localaddr.ip}:${data.localaddr.port}`,
  },
  {
    headerName: 'remort',
    field: 'remoteaddr',
    width: 200,
    valueFormatter: ({ data }) =>
      `${data.remoteaddr.ip}:${data.remoteaddr.port}`,
  },
  { headerName: 'status', field: 'status', width: 120 },
];

function ProcessContent({
  cmdline,
  environment = [],
  connection = [],
  id,
  ppid,
}) {
  const kill = () => {
    if (window.confirm('해당 프로세스를 kill 하겠습니까?')) {
      //axios.delete(`/kill/${Id}`).then(res => {});
    }
  };

  return (
    <>
      <GridLayout container>
        <GridLayout item xs={6} sm={6} md={6}>
          <Layout
            center={
              <Column title="Cmdline">
                <Paper variant="outlined" sx={{ height: 200, p: 1 }}>
                  <Typography variant="body1">{cmdline}</Typography>
                </Paper>
              </Column>
            }
          />
        </GridLayout>

        <GridLayout item xs={6} sm={6} md={6}>
          <Layout
            center={
              <Column title="Environments">
                <Grid rowData={environment} columns={columns0} height={200} />
              </Column>
            }
          />
        </GridLayout>

        <GridLayout item xs={12} sm={12} md={12}>
          <Layout
            center={
              <Column title="Connection">
                <Grid rowData={connection} columns={columns1} height={200} />
              </Column>
            }
          />
        </GridLayout>
      </GridLayout>

      <Box
        display="flex"
        justifyContent="flex-end"
        sx={{ paddingBottom: 2, paddingRight: 2 }}>
        <Button
          onClick={kill}
          startIcon={<DeleteForeverIcon />}
          variant="outlined">
          {`kill ${id}`}
        </Button>
      </Box>
    </>
  );
}

export default ProcessContent;
