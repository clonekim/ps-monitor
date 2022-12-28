import React from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Paper,
  Typography,
  IconButton,
  TextField,
  Grid as GridLayout,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BoltIcon from '@mui/icons-material/Bolt';
import Layout from '../components/Layout';
import Column from '../components/Column';
import Grid from '../components/Grid';
import { useProcess, useAlert } from '../store';

const columns = [{ headerName: 'value', field: 'value', width: 400 }];

const columns0 = [
  { headerName: 'key', field: 'key', width: 150 },
  { headerName: 'value', field: 'value', width: 300 },
];

const columns1 = [
  { headerName: 'fd', field: 'fd', width: 50 },
  { headerName: 'family', field: 'family', width: 70 },
  { headerName: 'type', field: 'type', width: 60 },
  {
    headerName: 'local',
    field: 'localaddr',
    width: 150,
    valueFormatter: ({ data }) => `${data.localaddr.ip}:${data.localaddr.port}`,
  },
  {
    headerName: 'remort',
    field: 'remoteaddr',
    width: 150,
    valueFormatter: ({ data }) =>
      `${data.remoteaddr.ip}:${data.remoteaddr.port}`,
  },
  { headerName: 'status', field: 'status', width: 120 },
];

const columns2 = [
  { headerName: 'fd', field: 'fd', width: 50 },
  { headerName: 'path', field: 'path', width: 360 },
];

function ProcessContent({ cmdline, environment, connection, openFile, touch }) {
  const { setAlert } = useAlert();
  const [cmd, setCmd] = React.useState(touch);
  const { label } = useProcess();

  if (!label) return null;

  const sendTouch = () => {
    if (cmd) {
      axios
        .post('/touch', { cmd })
        .then(res => console.log(res))
        .catch(err => {
          setAlert({
            text: err.response.data.message || err.message,
            type: 'error',
          });
        });
    } else {
      alert('명령어를 입력하세요');
    }
  };

  const handleText = e => {
    setCmd(e.target.value);
  };

  return (
    <>
      <GridLayout container>
        <GridLayout item xs={6} sm={6} md={6}>
          <Layout
            center={
              <Column title="Cmdline">
                <Grid
                  rowData={cmdline.map(i => ({ value: i }))}
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
                <Grid rowData={environment} columns={columns0} height={200} />
              </Column>
            }
          />
        </GridLayout>

        <GridLayout item xs={6} sm={6} md={6}>
          <Layout
            center={
              <Column title="Connection">
                <Grid rowData={connection} columns={columns1} height={200} />
              </Column>
            }
          />
        </GridLayout>

        <GridLayout item xs={6} sm={6} md={6}>
          <Layout
            center={
              <Column title="Open File">
                <Grid rowData={openFile} columns={columns2} height={200} />
              </Column>
            }
          />
        </GridLayout>
      </GridLayout>

      {touch && (
        <Box display="flex" justifyContent="flex-end" sx={{ p: 2 }}>
          <TextField
            fullWidth
            label="Touch"
            variant="outlined"
            value={cmd}
            onChange={handleText}
          />
          <IconButton onClick={sendTouch} variant="outlined">
            <BoltIcon />
          </IconButton>
        </Box>
      )}
    </>
  );
}

export default ProcessContent;
