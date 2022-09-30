import React from 'react';
import Layout from '../components/Layout';
import Column from '../components/Column';
import Grid from '../components/Grid';
import { Grid as GridLayout } from '@mui/material'
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
// import { Button, Box } from '@mui/material';
// import axios from 'axios';

const cmdColumns = [{ headerName: 'Value', field: 'value', width: 450 }];

const environColumns = [
  { headerName: 'Key', field: 'Key', width: 200 },
  { headerName: 'Value', field: 'Value', width: 300 },
];

const openFilecolumns = [
  { headerName: 'Path', field: 'path', width: 250 },
  { headerName: 'Fd', field: 'fd' },
];

const connectionColumns = [
  { headerName: 'Fd', field: 'fd', width: 50 },
  { headerName: 'Family', field: 'family', width: 80 },
  {
    headerName: 'Localaddr',
    field: 'localaddr',
    width: 130,
    valueFormatter: ({ data }) => `${data.localaddr.ip}:${data.localaddr.port}`,
  },
  {
    headerName: 'Remortladdr',
    field: 'remoteaddr',
    width: 130,
    valueFormatter: ({ data }) =>
      `${data.remoteaddr.ip}:${data.remoteaddr.port}`,
  },
  { headerName: 'Status', field: 'status', width: 110 },
  {
    headerName: 'uids',
    field: 'uids',
    width: 150,
    valueFormatter: params => (params.data.uids || []).join(', '),
  },
  { headerName: 'pid', field: 'pid', width: 80 },
];

function ProcessContent({
  Cmdline = [],
  Environment = [],
  OpenFileState = [],
  Connection = [],
  Id,
  Children = [],
  Ppid,
}) {
  // const kill = () => {
  //   if (window.confirm('해당 프로세스를 kill 하겠습니까?')) {
  //     axios.delete(`/kill/${Id}`).then(res => {});
  //   }
  // };

  return (
    <>
      {/* <Box display="flex" justifyContent="flex-end">
        <Button
          onClick={kill}
          startIcon={<DeleteForeverIcon />}
          variant="outlined">
          {`kill ${Id}`}
        </Button>
      </Box> */}

      <GridLayout container>
        <GridLayout item xs={6} sm={6} md={12}>
          <Layout
            center={
              <Column title="Cmdline">
                <Grid
                  rowData={Cmdline.map(i => ({ value: i }))}
                  columns={cmdColumns}
                  height={200}
                />
              </Column>
            }
          />

        </GridLayout>

        <GridLayout item xs={6} sm={6} md={12}>

          <Layout
            center={
              <Column title="Environments">
                <Grid rowData={Environment} columns={environColumns} height={200} />
              </Column>
            }
          />
        </GridLayout>

        <GridLayout item xs={6} sm={6} md={12}>
          <Layout
            center={
              <Column title="Open File Stat">
                <Grid
                  rowData={OpenFileState}
                  columns={openFilecolumns}
                  height={200}
                />
              </Column>
            }
          />

        </GridLayout>
        <GridLayout item xs={6} sm={6} md={12}>

          <Layout
            center={
              <Column title="Connection">
                <Grid
                  rowData={Connection}
                  columns={connectionColumns}
                  height={200}
                />
              </Column>
            }
          />
        </GridLayout>
      </GridLayout>



    </>
  );
}

export default ProcessContent;
