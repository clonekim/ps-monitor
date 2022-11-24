import React, { useMemo } from 'react';
import { ThemeProvider } from '@emotion/react';
import { Box, CssBaseline, Tab, Tabs, Drawer } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useLoading, useSetting, useProcess } from './store';

import themeConfig from './theme';
import ProgressHelper from './components/ProcessHelper';
import ProcessDrawer from './Process/ProcessDrawer';
import SettingToggle from './components/SettingToggle';
import Toaster from './components/Toaster';

function Layout() {
  const [tab, setTab] = React.useState('1');
  const { toggle, mode, setToggle } = useSetting();
  const theme = useMemo(() => themeConfig(mode), [mode]);
  const { content } = useProcess();
  const { show } = useLoading();
  const navigate = useNavigate();
  const location = useLocation();

  const onClick = (path, idx) => {
    navigate(path);
    setTab(idx);
    if (idx === '2') setToggle(false);
  };

  React.useEffect(() => {
    const { pathname } = location;
    if (pathname === '/Log') setTab('2');
  }, [location]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ProgressHelper show={show} />
      <Toaster />
      <Box p={1}>
        <Tabs value={tab}>
          <Tab label="프로세스" value="1" onClick={() => onClick('/', '1')} />
          <Tab label="로그" value="2" onClick={() => onClick('/Log', '2')} />
        </Tabs>
      </Box>

      <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
        <SettingToggle />
      </Box>

      <Drawer
        anchor="bottom"
        variant="persistent"
        open={toggle}
        onClose={() => setToggle(false)}>
        <ProcessDrawer />
      </Drawer>

      <Box sx={{ p: 1 }}>
        <Outlet />
      </Box>
    </ThemeProvider>
  );
}

export default Layout;
