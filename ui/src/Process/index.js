import React from 'react';
import { Box, Stack, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ProcessGrid from './ProcessGrid';
import ProcessContent from './ProcessContent';
import Pstree from './Pstree';
import ThemeToggle from '../components/ThemeToggle';
import axios from 'axios';
import { useAlert, useLoading, useProcess } from '../store';

function ProcessIndex() {
  const { list, content, setList } = useProcess();
  const { setLoading } = useLoading();
  const { setAlert } = useAlert();
  const pstree = React.useState([]);

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

  React.useEffect(() => {
    if (content) {
      axios.get(`/pstree/${content.Ppid}`).then(res => {
        pstree[1](res.data);
      });
    }
  }, [content]);

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

        {content && <ProcessContent {...content} />}

        {content && pstree[0] && (
          <Pstree id={content.Ppid} rowData={pstree[0]} />
        )}
      </Stack>
    </>
  );
}

export default ProcessIndex;
