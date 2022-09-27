import React from 'react';
import { Box, Stack, IconButton } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import RefreshIcon from '@mui/icons-material/Refresh';
import ProcessGrid from './ProcessGrid';
import ProcessContent from './ProcessContent';
import axios from 'axios';
import { useAlert, useLoading, useProcess, useTheme } from '../store';

function ProcessIndex() {
  const { list, content, setList } = useProcess();
  const { setLoading } = useLoading();
  const { mode, setMode } = useTheme();
  const { setAlert } = useAlert();

  const clickHandler = () => {
    setLoading(true);
    axios
      .get('/pid', {
        params: {},
      })
      .then(res => {
        setList(res.data || []);
      })
      .catch(err => {
        setAlert({ text: err.message, type: 'error' });
      })
      .finally(() => setLoading(false));
  };

  const themeToggle = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  };

  React.useEffect(() => {
    clickHandler();
  }, []);

  return (
    <>
      <Box display="flex" justifyContent="flex-end">
        <IconButton onClick={clickHandler}>
          <RefreshIcon />
        </IconButton>

        <IconButton onClick={themeToggle}>
          {mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </Box>
      <Stack direction="column" sx={{ py: 2, px: 5 }} spacing={5}>
        <Box sx={{ py: 1, px: 2 }}>
          <ProcessGrid rowData={list} />
        </Box>

        <Box sx={{ width: '100%' }}>
          {content && <ProcessContent {...content} />}
        </Box>
      </Stack>
    </>
  );
}

export default ProcessIndex;
