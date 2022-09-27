import React, { useMemo } from 'react';
import { ThemeProvider } from '@emotion/react';
import { Box, CssBaseline, Tab, Tabs } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useLoading, useTheme } from './store';
import themeConfig from './theme';
import ProgressHelper from './components/ProcessHelper';
import Toaster from './components/Toaster';

function Layout() {
  const [value, setValue] = React.useState('1');
  const { mode } = useTheme();
  const theme = useMemo(() => themeConfig(mode), [mode]);
  const { show } = useLoading();
  const navigate = useNavigate();
  const location = useLocation();

  const onClick = (path, idx) => {
    navigate(path);
    setValue(idx);
  };

  React.useEffect(() => {
    const { pathname } = location;
    if (pathname === '/Log') setValue('2');
  }, [location]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ProgressHelper show={show} />
      <Toaster />
      <Box>
        <Tabs value={value}>
          <Tab label="프로세스" value="1" onClick={() => onClick('/', '1')} />
          <Tab label="로그" value="2" onClick={() => onClick('/Log', '2')} />
        </Tabs>
      </Box>

      <Box sx={{ p: 1 }}>
        <Outlet />
      </Box>
    </ThemeProvider>
  );
}

export default Layout;
