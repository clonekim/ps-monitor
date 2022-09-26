import React from 'react';
import Layout from '../components/Layout';
import Column from '../components/Column';
import Grid from '../components/Grid';

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
  Status,
  Owner,
  Terminal,
  OpenFileState,
  Connection,
  Children,
  Ppid,
}) {
  console.log('content render!');
  return (
    <>
      <Layout
        left={
          <Column title="Status" head divider value={Status.join(', ')} />
        }
        right={<Column title="Ppid" head divider value={Ppid} />}
      />

      <Layout
        left={<Column title="Owner" head divider value={Owner} />}
        right={<Column title="Terminal" head divider value={Terminal} />}
      />

      <Layout
        center={<Column title="Cmdline" head divider value={Cmdline} />}
      />

      <Layout
        center={
          <Column title="Environments">
            <Grid
              rowData={(Environment || []).map(i => ({ value: i }))}
              columns={environColumns}
              height={300}
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
              height={300}
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
              height={300}
            />
          </Column>
        }
      />
    </>
  );
}

export default ProcessContent;
