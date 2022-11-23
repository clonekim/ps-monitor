import React from 'react';
import { Box, IconButton } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTheme } from '../store';

function ThemeToggle() {
  const { mode, setMode, setTimeout } = useTheme();
  const themeToggle = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  };

  const showPrompt = () => {
    const result = prompt('input value for setInterval');

    const num = isNaN(result) ? 10 : parseInt(result, 10);
    setTimeout(num * 1000);
  };
  return (
    <Box>
      <IconButton onClick={showPrompt}>
        <SettingsIcon />
      </IconButton>
      <IconButton onClick={themeToggle}>
        {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Box>
  );
}

export default ThemeToggle;
