import React from 'react';
import Layout from './components/Layout';
import Column from './components/Column';
import Grid from './components/Grid';

const environColumns = [{ headerName: 'value', field: 'value', width: 250 }];
const openFilecolumns = [
  { headerName: 'Path', field: 'path', width: 250 },
  { headerName: 'Fd', field: 'fd' },
];

const connectionColumns = [
  { headerName: 'Fd', field: 'fd' },
  { headerName: 'Family', field: 'family', width: 50 },
  { headerName: 'Localaddr', field: 'localaddr.port', width: 150 },
  { headerName: 'Remortladdr', field: 'remoteaddr.port', width: 150 },
  { headerName: 'Status', field: 'status', width: 150 },
  {
    headerName: 'uids',
    field: 'uids',
    valueFormatter: params => params.data.uids.join(', '),
  },
  { headerName: 'pid', field: 'pid' },
];

function ProcessContent({
  Cmdline,
  Environments,
  Status,
  Owner,
  Terminal,
  OpenFileState,
  Connection,
  Children,
  Ppid,
}) {
  return (
    <>
      <Layout
        left={
          <Column title='Status' header divider value={Status.join(', ')} />
        }
        right={<Column title='Ppid' header divider value={Ppid} />}
      />

      <Layout
        left={<Column title='Owner' header divider value={Owner} />}
        right={<Column title='Terminal' header divider value={Terminal} />}
      />

      <Layout
        center={<Column title='Cmdline' header divider value={Cmdline} />}
      />

      <Layout
        center={
          <Column title='Environments'>
            <Grid
              rowData={Environments.map(i => ({ value: i }))}
              columns={environColumns}
            />
          </Column>
        }
      />

      <Layout
        center={
          <Column title='Open File Stat'>
            <Grid rowData={OpenFileState} columns={openFilecolumns} />
          </Column>
        }
      />

      <Layout
        center={
          <Column title='Connection'>
            <Grid rowData={Connection} columns={connectionColumns} />
          </Column>
        }
      />
    </>
  );
}

export default ProcessContent;
