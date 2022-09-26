import React, { useMemo } from 'react';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';

const gridCss = 'ag-theme-balham';

function GridWrapper({
  width = '100%',
  height,
  rowData,
  columns,
  gridOptions = {},
}) {
  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
    }),
    []
  );

  const columnsDefs = useMemo(() => {
    return columns.map(col =>
      Object.assign(col, {
        suppressMovable: true,
      })
    );
  }, []);

  return (
    <div className={gridCss} style={{ width, height }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnsDefs}
        defaultColDef={defaultColDef}
        gridOptions={gridOptions}
      />
    </div>
  );
}

const Grid = React.memo(GridWrapper);

export default Grid;
