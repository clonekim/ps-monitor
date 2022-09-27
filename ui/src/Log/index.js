import React from 'react';
import {
  Box,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  styled,
  Stack,
} from '@mui/material';

import RefreshIcon from '@mui/icons-material/Refresh';
import Layout from '../components/Layout';
import Grid from '../components/Grid';
import Column from '../components/Column';
import axios from 'axios';
import { useAlert } from '../store';

const columns = [{ headerName: 'log', field: 'value', width: 800 }];

const sizes = [100, 200, 300, 400, 500, 800, 1000];

const DisplayBox = styled(Stack)`
  position: absolute;
  right: 26px;
  top: 10px;
  z-index: 9;
  background: trasparent;
`;

function Log() {
  const [logpath, setLogpath] = React.useState([]);
  const [logs, setLogs] = React.useState({});
  const [logSize, setLogSize] = React.useState(200);
  const { setAlert } = useAlert();

  const fetchLog = filepath => {
    console.log('fetch ->', filepath);
    axios
      .get('/log', { params: { filepath, size: logSize } })
      .then(res => {
        setLogs(state => ({
          ...state,
          [filepath]: res.data.map(i => ({ value: i })),
        }));
      })
      .catch(err => {
        setAlert({ text: err.message, type: 'error' });
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

  const changeSize = e => {
    setLogSize(e.target.value);
  };

  return (
    <>
      <DisplayBox>
        <FormControl>
          <Select label="Log Size" onChange={changeSize}>
            {sizes.map(num => (
              <MenuItem value={num} key={num}>
                {num}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>log size </FormHelperText>
        </FormControl>
      </DisplayBox>
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
                <Grid
                  rowData={logs[value] || []}
                  columns={columns}
                  height={300}
                />
              </Column>
            </>
          }
        />
      ))}
    </>
  );
}

export default Log;
