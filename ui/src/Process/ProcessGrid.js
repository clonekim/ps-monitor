import { useCallback } from 'react';
import { useProcess } from '../store';
import Grid from '../components/Grid';

const columns = [
  { headerName: 'Name', field: 'Name' },
  { headerName: 'Pid', field: 'Id', width: 100 },
  { headerName: 'Ppid', field: 'Ppid', width: 100 },
  { headerName: 'Owner', field: 'Owner', width: 100 },
  {
    headerName: 'Status',
    field: 'status',
    valueFormatter: ({ data }) => data.Status.join(', '),
  },
  { headerName: 'CreateTime', field: 'CreateTime' },
  {
    headerName: 'Children',
    valueFormatter: ({ data }) => (data.Children || []).length,
  },
];

function ProcessGrid({ rowData }) {
  const { setContent } = useProcess();

  const gridOptions = {
    rowSelection: 'single',
    onGridReady: event => {},

    onRowClicked: ({ data }) => {
      setContent(data);
    },
  };

  return (
    <Grid
      rowData={rowData}
      columns={columns}
      gridOptions={gridOptions}
      height={300}
    />
  );
}

export default ProcessGrid;
