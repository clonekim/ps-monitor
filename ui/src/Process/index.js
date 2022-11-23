import React from 'react';
import { Box } from '@mui/material';
import ProcessCard from './ProcessCard';
import { useAlert, useLoading, useProcess } from '../store';
import useApi from '../api/useApi';

function ProcessIndex() {
  const { list } = useProcess();
  const { psCommand } = useApi();

  React.useEffect(() => {
    psCommand();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', p: 2 }}>
      {list.map(item => (
        <ProcessCard {...item} key={item.name} />
      ))}
    </Box>
  );
}

export default ProcessIndex;
