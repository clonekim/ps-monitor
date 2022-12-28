import React from 'react';
import {
  Grid,
  Typography,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Box,
  Button,
  Stack,
  IconButton,
} from '@mui/material';

import PowerIcon from '@mui/icons-material/Power';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useSetting, useProcess } from '../store';

function ProcessCard(item) {
  const { toggle, setToggle } = useSetting();
  const { label, setLabel } = useProcess();
  const clickHandler = item => {
    setLabel(item.label);
    setToggle(toggle && label === item.label ? !toggle : true);
  };

  let style = {
    width: 320,
    margin: '6px',
    border: 1,
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <Card sx={style}>
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <Box sx={{ display: 'flex' }}>
          {item.id === 0 ? (
            <PowerOffIcon fontSize="large" color="disabled" />
          ) : (
            <PowerIcon fontSize="large" color="success" />
          )}
        </Box>

        <Box
          sx={{
            width: 0.85,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Typography variant="h5">{item.label}</Typography>
          <Typography variant="body2" color="red">
            {item.id}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          width: 0.9,
          m: 1,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Box sx={{ width: 0.5 }}>
          <Typography variant="body2">User: {item.user}</Typography>
          <Typography variant="body2">TTY: {item.tty}</Typography>
        </Box>
        <Box sx={{ width: 0.4 }}>
          <Typography variant="body2">CPU: {item.cpuPercent}</Typography>
          <Typography variant="body2">MEM: {item.memPercent}</Typography>
        </Box>
      </Box>

      <CardActions
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}>
        <Box sx={{ width: 0.9, display: 'flex' }}>
          <Typography sx={{ p: 1, color: 'green', fontWeight: 580 }}>
            {item.status || 'none'}
          </Typography>
          <Typography sx={{ p: 1 }}>{item.createTime || ''}</Typography>
        </Box>

        <IconButton size="small" onClick={() => clickHandler(item)}>
          {toggle && label === item.label ? (
            <KeyboardArrowUpIcon />
          ) : (
            <KeyboardArrowDownIcon />
          )}
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default ProcessCard;
