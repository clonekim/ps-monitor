import { Box, CircularProgress, Typography } from '@mui/material';

function ProgressHelper({ show }) {
  if (show)
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          zIndex: 1000000,
          position: 'fixed',
          top: 0,
          left: 0,
        }}>
        <Box
          sx={{
            display: 'inline',
            position: 'fixed',
            margin: 'auto',
            right: 10,
            bottom: 10,
          }}>
          <CircularProgress />
          <Typography>로딩 중 입니다. </Typography>
        </Box>
      </Box>
    );
}

export default ProgressHelper;
