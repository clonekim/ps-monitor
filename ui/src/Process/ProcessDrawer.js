import React from 'react';
import { Box, IconButton, Grid, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSetting, useProcess } from '../store';
import ProcessContent from './ProcessContent';

function NoContent() {
  return (
    <Box sx={{ height: 300, p: 2, textAlign: 'center' }}>
      <Typography variant="h3">No Data</Typography>
    </Box>
  );
}

function ProcessDrawer() {
  const { toggle, setToggle } = useSetting();
  const { content } = useProcess();

  if (toggle) {
    return (
      <Box sx={{ p: 1, m: 2 }}>
        <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
          <IconButton onClick={() => setToggle(false)}>
            <CloseIcon color="primary" />
          </IconButton>
        </Box>

        {content && content.label && (
          <Box sx={{ paddingTop: 1, paddingLeft: 1 }}>
            <Typography variant="h5" component="span">
              {content.label}
            </Typography>
          </Box>
        )}

        {content && content.id > 0 && <ProcessContent {...content} />}

        {!content && <NoContent />}
        {content && content.id === 0 && <NoContent />}
      </Box>
    );
  } else {
    return null;
  }
}

export default ProcessDrawer;
