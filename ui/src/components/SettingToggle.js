import React from 'react';
import { Box, IconButton } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsIcon from '@mui/icons-material/Settings';
import { useSetting } from '../store';

function SettingToggle() {
  const { mode, setMode, setTimeout } = useSetting();
  const themeToggle = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  };

  const showPrompt = () => {
    const result = prompt('새로고침 시간을 수정합니다(초단위로 입력하시오)');
    setTimeout(result);
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

export default SettingToggle;
