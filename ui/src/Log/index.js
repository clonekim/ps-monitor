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
import ThemeToggle from '../components/ThemeToggle';
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
  top: 20px;
  z-index: 9;
  background: trasparent;
`;

function Log() {
  const gridRef = React.useRef({});
  const [logpath, setLogpath] = React.useState([]);
  const [logs, setLogs] = React.useState({});
  const [logSize, setLogSize] = React.useState(200);
  const { setAlert } = useAlert();

  const fetchLog = filepath => {
    axios
      .get('/log', { params: { filepath, size: logSize } })
      .then(res => {
        setLogs(state => ({
          ...state,
          [filepath]: (res.data || []).map(i => ({ value: i })),
        }));

        if (gridRef.current && gridRef.current[filepath] && res.data.length > 2)
          gridRef.current[filepath].ensureIndexVisible(res.data.length - 1);
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
          <Select
            label="Log Size"
            sx={{ p: 0 }}
            onChange={changeSize}
            value={logSize}>
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
                <ThemeToggle />
              </Box>

              <Column title={value} head>
                <Grid
                  rowData={logs[value] || []}
                  columns={columns}
                  height={300}
                  gridOptions={{
                    onGridReady: ({ api }) => {
                      gridRef.current[value] = api;
                    },
                  }}
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
