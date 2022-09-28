import React from 'react';
import { Box, Stack, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ProcessGrid from './ProcessGrid';
import ProcessContent from './ProcessContent';
import ThemeToggle from '../components/ThemeToggle';
import axios from 'axios';
import { useAlert, useLoading, useProcess } from '../store';

function ProcessIndex() {
  const { list, content, setList } = useProcess();
  const { setLoading } = useLoading();
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

  React.useEffect(() => {
    clickHandler();
  }, []);

  return (
    <>
      <Box display="flex" justifyContent="flex-end">
        <IconButton onClick={clickHandler}>
          <RefreshIcon />
        </IconButton>

        <ThemeToggle />
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
