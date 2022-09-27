import React from 'react';
import { Box, IconButton } from '@mui/material';

import RefreshIcon from '@mui/icons-material/Refresh';
import Layout from '../components/Layout';
import Grid from '../components/Grid';
import Column from '../components/Column';
import axios from 'axios';
import { useAlert } from '../store';

const columns = [{ headerName: 'log', field: 'value', width: 800 }];

function Log() {
  const [logpath, setLogpath] = React.useState([]);
  const [logs, setLogs] = React.useState({});
  const { setAlert } = useAlert();

  const fetchLog = filepath => {
    console.log('fetch ->', filepath);
    axios.get('/log', { params: { filepath } }).then(res => {
      setLogs(state => ({
        ...state,
        [filepath]: res.data.map(i => ({ value: i })),
      }));
    });
  };

  React.useEffect(() => {
    axios
      .get('/config')
      .then(({ data }) => {
        setLogpath(data.Logs);
      })
      .catch(err => {
        setAlert({ text: err.message, type: 'error' });
      });
  }, []);

  React.useEffect(() => {
    logpath.forEach(v => fetchLog(v));
  }, [logpath]);

  return (
    <>
      {logpath.map(value => (
        <Layout
          key={value}
          center={
            <>
              <Box display="flex" justifyContent="flex-end">
                <IconButton onClick={() => fetchLog(value)}>
                  <RefreshIcon />
                </IconButton>
              </Box>

              <Column title={value} head>
                <Grid rowData={logs[value]} columns={columns} height={300} />
              </Column>
            </>
          }
        />
      ))}
    </>
  );
}

export default Log;
