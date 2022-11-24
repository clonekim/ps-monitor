import React from 'react';
import { IconButton, Box, styled } from '@mui/material';
import ProcessCard from './ProcessCard';
import ProcessTable from './ProcessTable';
import { useAlert, useLoading, useProcess, useSetting } from '../store';
import useApi from '../api/useApi';

import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';

const DisplayBox = styled(Box)`
  position: absolute;
  right: 106px;
  top: 20px;
  z-index: 9;
  background: trasparent;
`;

function ProcessIndex() {
  const { list } = useProcess();
  const { setAlert } = useAlert();
  const { psCommand } = useApi();
  const { timeout, grid, setGrid } = useSetting();

  React.useEffect(() => {
    psCommand();
    const timer = setInterval(() => psCommand(), timeout);
    return () => {
      clearInterval(timer);
    };
  }, [timeout]);

  return (
    <>
      <DisplayBox>
        <IconButton onClick={() => setGrid(!grid)}>
          {grid ? <ViewListIcon /> : <GridViewIcon />}
        </IconButton>
      </DisplayBox>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', p: 2 }}>
        {!grid && <ProcessTable rows={list} />}
        {grid && list.map(item => <ProcessCard {...item} key={item.name} />)}
      </Box>
    </>
  );
}

export default ProcessIndex;
