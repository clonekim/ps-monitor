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
} from '@mui/material';
import { useProcess, useSetting } from '../store';

function ProcessTable({ rows }) {
  const [select, setSelect] = React.useState();
  const { toggle, setToggle } = useSetting();
  const { content, setContent } = useProcess();

  const onRowClick = row => {
    setSelect(row.name);
    setContent(row);
    setToggle(toggle && (content || {}).label === row.label ? !toggle : true);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 850 }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">PID</TableCell>
            <TableCell>User</TableCell>
            <TableCell>TTY</TableCell>
            <TableCell>Stat</TableCell>
            <TableCell align="right">CPU</TableCell>
            <TableCell align="right">MEM</TableCell>
            <TableCell align="right">Created Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow
              onClick={() => onRowClick(row)}
              key={row.name}
              hover={true}
              selected={row.name === select}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.name}
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
              <TableCell align="right">{row.createTime}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ProcessTable;
