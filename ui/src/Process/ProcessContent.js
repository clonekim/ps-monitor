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
import { useProcess } from '../store';

const columns = [{ headerName: 'value', field: 'value', width: 400 }];

const columns0 = [
  { headerName: 'key', field: 'key', width: 200 },
  { headerName: 'value', field: 'value', width: 300 },
];

const columns1 = [
  { headerName: 'fd', field: 'fd', width: 50 },
  { headerName: 'family', field: 'family', width: 70 },
  { headerName: 'type', field: 'type', width: 60 },
  {
    headerName: 'local',
    field: 'localaddr',
    width: 180,
    valueFormatter: ({ data }) => `${data.localaddr.ip}:${data.localaddr.port}`,
  },
  {
    headerName: 'remort',
    field: 'remoteaddr',
    width: 180,
    valueFormatter: ({ data }) =>
      `${data.remoteaddr.ip}:${data.remoteaddr.port}`,
  },
  { headerName: 'status', field: 'status', width: 120 },
];

const columns2 = [
  { headerName: 'fd', field: 'fd', width: 50 },
  { headerName: 'path', field: 'path' },
];

function ProcessContent() {
  const { content } = useProcess();

  if (!content || content.id === 0) return null;

  const kill = () => {
    alert("not working(it's demo)");
    return;
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
                <Grid
                  rowData={content.cmdline.map(i => ({ value: i }))}
                  columns={columns}
                  height={200}
                />
              </Column>
            }
          />
        </GridLayout>

        <GridLayout item xs={6} sm={6} md={6}>
          <Layout
            center={
              <Column title="Environments">
                <Grid
                  rowData={content.environment}
                  columns={columns0}
                  height={200}
                />
              </Column>
            }
          />
        </GridLayout>

        <GridLayout item xs={6} sm={6} md={6}>
          <Layout
            center={
              <Column title="Connection">
                <Grid
                  rowData={content.connection}
                  columns={columns1}
                  height={200}
                />
              </Column>
            }
          />
        </GridLayout>

        <GridLayout item xs={6} sm={6} md={6}>
          <Layout
            center={
              <Column title="Open File">
                <Grid
                  rowData={content.openFile}
                  columns={columns2}
                  height={200}
                />
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
          {`kill ${content.id}`}
        </Button>
      </Box>
    </>
  );
}

export default ProcessContent;
