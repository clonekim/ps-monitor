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
  const [data, setData] = React.useState(null);
  const { toggle, setToggle } = useSetting();
  const { setLabel, label, list } = useProcess();

  const close = () => {
    setToggle(false);
    setLabel(null);
  };

  React.useEffect(() => {
    if (toggle) {
      const [i] = list.filter(i => i.label === label);
      setData(i);
    }
  }, [toggle]);

  if (toggle) {
    return (
      <Box sx={{ p: 1, m: 2 }}>
        <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
          <IconButton onClick={close}>
            <CloseIcon color="primary" />
          </IconButton>
        </Box>

        {data && data.label && (
          <Box sx={{ paddingTop: 1, paddingLeft: 1 }}>
            <Typography variant="h5" component="span">
              {data.label} {data.id > 0 ? ` (${data.id})` : ''}
            </Typography>
          </Box>
        )}

        {data && data.id > 0 && <ProcessContent {...data} />}

        {!data && <NoContent />}
        {data && data.id === 0 && <NoContent />}
      </Box>
    );
  } else {
    return null;
  }
}

export default ProcessDrawer;
