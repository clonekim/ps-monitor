import React from 'react';
import { IconButton } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useTheme } from '../store';

function ThemeToggle() {
  const { mode, setMode } = useTheme();
  const themeToggle = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  };

  return (
    <IconButton onClick={themeToggle}>
      {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  );
}

export default ThemeToggle;
