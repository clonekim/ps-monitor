import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Box,
} from '@mui/material';

import PowerIcon from '@mui/icons-material/Power';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import { useProcess, useSetting } from '../store';

function ProcessTable({ rows }) {
  const [select, setSelect] = React.useState();
  const { toggle, setToggle } = useSetting();
  const { content, setContent } = useProcess();

  const onRowClick = row => {
    setSelect(row.label);
    setContent(row);
    setToggle(toggle && (content || {}).label === row.label ? !toggle : true);
  };

  return (
    <TableContainer component={Paper} sx={{ border: 1 }}>
      <Table sx={{ minWidth: 850 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">PID</TableCell>
            <TableCell>User</TableCell>
            <TableCell>TTY</TableCell>
            <TableCell>Stat</TableCell>
            <TableCell align="right">CPU</TableCell>
            <TableCell align="right">MEM</TableCell>
            <TableCell>Created Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow
              onClick={() => onRowClick(row)}
              key={row.label}
              hover={true}
              selected={row.label === select}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                  {row.id === 0 ? (
                    <PowerOffIcon fontSize="large" color="disabled" />
                  ) : (
                    <PowerIcon fontSize="large" color="success" />
                  )}

                  <Typography variant="h6">{row.label}</Typography>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" color="red">
                  {row.id}
                </Typography>
              </TableCell>
              <TableCell>{row.user}</TableCell>
              <TableCell>{row.tty}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell align="right">{row.cpuPercent}</TableCell>
              <TableCell align="right">{row.memPercent}</TableCell>
              <TableCell>{row.createTime}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ProcessTable;
