import React from 'react';
import { Box } from '@mui/material';
import ProcessCard from './ProcessCard';
import { useAlert, useLoading, useProcess, useTheme } from '../store';
import useApi from '../api/useApi';

function ProcessIndex() {
  const { list } = useProcess();
  const { setAlert } = useAlert();
  const { psCommand } = useApi();
  const { timeout } = useTheme();

  React.useEffect(() => {
    psCommand();

    const timer = setInterval(() => psCommand(), timeout || 10000);

    setAlert({ text: `Timeout setting: ${timeout} `, type: 'info' });

    return () => {
      clearInterval(timer);
    };
  }, [timeout]);

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', p: 2 }}>
      {list.map(item => (
        <ProcessCard {...item} key={item.name} />
      ))}
    </Box>
  );
}

export default ProcessIndex;
