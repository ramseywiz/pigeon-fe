import { AgGridReact } from 'ag-grid-react';
import { type ColDef, themeQuartz } from 'ag-grid-community';
import styles from './eventgrid.module.css';

const myTheme = themeQuartz.withParams({
  borderColor: '#d4cdc2',
  rowBorder: true,
  borderRadius: 0,
  wrapperBorderRadius: 0,
  backgroundColor: '#ffffff',
  headerBackgroundColor: '#f5f2eb',
  oddRowBackgroundColor: '#faf8f4',
  rowHoverColor: '#f0ece3',
  foregroundColor: '#4a3526',
  headerTextColor: '#4a3526',
  fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
  fontSize: 15,
  inputBorder: '#d4cdc2',
  iconColor: '#755540',
  headerColumnResizeHandleColor: '#755540',
});

type Event = {
  name: string;
  date: string;
  location: string;
};

const colDefs: ColDef<Event>[] = [
  { field: 'name', headerName: 'Event Name', flex: 1.5, sortable: true, filter: true },
  { field: 'date', headerName: 'Date', flex: 1, sortable: true },
  { field: 'location', headerName: 'Location', flex: 1, sortable: true, filter: true },
];

const placeholderRows: Event[] = [
  { name: 'teachhouston', date: '2025-04-12', location: 'PGH 232' },
  { name: 'nvidia', date: '2025-05-03', location: 'PGH 563' },
];

export const EventGrid = () => {
  return (
    <div className={styles.grid}>
      <AgGridReact
        theme={myTheme}
        rowData={placeholderRows}
        columnDefs={colDefs}
        defaultColDef={{ resizable: true, cellStyle: { textAlign: 'left' } }}
      />
    </div>
  );
};
