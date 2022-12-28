import { Box, LinearProgress, Typography } from '@mui/material';

function ProgressHelper({ show }) {
  if (show)
    return (
      <Box
        sx={{
          zIndex: 99999,
          width: '100%',
          display: 'inline',
          position: 'fixed',
          margin: 'auto',
          bottom: 10,
        }}>
        <LinearProgress color="secondary" />
      </Box>
    );
}

export default ProgressHelper;
