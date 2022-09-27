import React from 'react';
import Layout from '../components/Layout';
import Column from '../components/Column';
import Grid from '../components/Grid';
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
// import { Button, Box } from '@mui/material';
// import axios from 'axios';

const environColumns = [{ headerName: 'value', field: 'value', width: 450 }];
const openFilecolumns = [
  { headerName: 'Path', field: 'path', width: 250 },
  { headerName: 'Fd', field: 'fd' },
];

const connectionColumns = [
  { headerName: 'Fd', field: 'fd', width: 50 },
  { headerName: 'Family', field: 'family', width: 80 },
  { headerName: 'Localaddr', field: 'localaddr.port', width: 100 },
  { headerName: 'Remortladdr', field: 'remoteaddr.port', width: 100 },
  { headerName: 'Status', field: 'status', width: 150 },
  {
    headerName: 'uids',
    field: 'uids',
    width: 150,
    valueFormatter: params => (params.data.uids || []).join(', '),
  },
  { headerName: 'pid', field: 'pid', width: 80 },
];

function ProcessContent({
  Cmdline,
  Environment,
  OpenFileState,
  Connection,
  Id,
  Children,
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

      <Layout center={<Column title="Cmdline" border value={Cmdline} />} />

      <Layout
        center={
          <Column title="Environments">
            <Grid
              rowData={(Environment || []).map(i => ({ value: i }))}
              columns={environColumns}
              height={200}
            />
          </Column>
        }
      />

      <Layout
        center={
          <Column title="Open File Stat">
            <Grid
              rowData={OpenFileState || []}
              columns={openFilecolumns}
              height={200}
            />
          </Column>
        }
      />

      <Layout
        center={
          <Column title="Connection">
            <Grid
              rowData={Connection || []}
              columns={connectionColumns}
              height={200}
            />
          </Column>
        }
      />
    </>
  );
}

export default ProcessContent;
