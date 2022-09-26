import React, { useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import ProcessCard from './ProcessCard';
import ProcessContent from './ProcessContent';
import axios from 'axios';
import { useProcess } from '../store';

function ProcessIndex() {
  const { list, content, setList } = useProcess();

  useEffect(() => {
    axios
      .get('/getpid', {
        params: {
          name: 'Emacs,Microsoft',
        },
      })
      .then(res => {
        setList(res.data);
      });

    return () => {};
  }, []);

  return (
    <Grid container rowSpacing={2}>
      <Grid item md={4} xs={12}>
        {list.map(i => (
          <Box sx={{ p: 1 }} key={i.Id}>
            <ProcessCard {...i} />
          </Box>
        ))}
      </Grid>

      <Grid item md={6}>
        {content && <ProcessContent {...content} />}
      </Grid>
    </Grid>
  );
}

export default ProcessIndex;
