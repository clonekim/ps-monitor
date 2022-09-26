import React, { useMemo } from 'react';
import { ThemeProvider } from '@emotion/react';
import { Box, CssBaseline, Tab, Tabs } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import { useTheme } from './store';

import themeConfig from './theme';

function Layout() {
  const [value, setValue] = React.useState('1');
  const { mode } = useTheme();
  const theme = useMemo(() => themeConfig(mode), [mode]);
  const navigate = useNavigate();

  const onClick = (path) => {
    navigate(path)
    setValue(path)
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box>
        <Tabs value={value}>
          <Tab label='프로세스' value={'/process'} onClick={() => onClick('/process') } />
          <Tab label='로그' value={'/log'} onClick={() => onClick('/log')} />
        </Tabs>
      </Box>

      <Outlet />
    </ThemeProvider>
  );
}

export default Layout;
