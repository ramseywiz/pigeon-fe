import { AgGridReact } from 'ag-grid-react';
import { themeQuartz } from 'ag-grid-community';
import styles from './eventgrid.module.css';
import type { EventListRow } from './models/models';
import { useColumns } from './util/columns';

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

const placeholderRows: EventListRow[] = [
  {
    id: '1',
    eventName: 'teachhouston Info Session',
    date: new Date('2025-05-03T10:00:00'),
    location: 'PGH 232',
    branch: 'Main',
  },
  {
    id: '2',
    eventName: 'Nvidia Info Session',
    date: new Date('2025-05-03T10:00:00'),
    location: 'PGH 563',
    branch: 'Main',
  },
];

export const EventGrid = () => {
  const columns = useColumns();
  const rows = placeholderRows; // in the future, we will replace this with an API call. or maybe even Redux store? maybe redux so we can cache it and not have to worry about refetching every time we navigate away from the page, as well as share the data with the calendar. we'll see
  return (
    <div className={styles.grid}>
      <AgGridReact
        theme={myTheme}
        rowData={rows}
        columnDefs={columns}
        defaultColDef={{ cellStyle: { textAlign: 'left' } }}
      />
    </div>
  );
};
