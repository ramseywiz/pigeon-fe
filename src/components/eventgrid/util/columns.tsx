import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { useMemo } from 'react';
import type { EventListRow } from '../models/models';

export const useColumns = () => {
  const columns: ColDef<EventListRow>[] = useMemo(
    () => [
      {
        field: 'eventName',
        headerName: 'Event Name',
        flex: 1,
        filter: true,
        cellRenderer: (params: ICellRendererParams<EventListRow>) => {
          return (
            <button
              onClick={() => console.log('open dialog for', params.data)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: '#4a3526',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: 'inherit',
                fontFamily: 'inherit',
                fontWeight: 'inherit',
              }}
            >
              {params.value}
            </button>
          );
        },
      },
      {
        field: 'date',
        headerName: 'Date & Time',
        flex: 1,
        cellDataType: 'dateTime',
        valueFormatter: (params) => {
          if (!params.value) return '';
          return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          }).format(params.value);
        },
      },
      {
        field: 'location',
        headerName: 'Location',
        flex: 1,
        filter: true,
      },
      {
        field: 'branch',
        headerName: 'Branch',
        flex: 1,
        filter: true,
      },
    ],
    [],
  );

  return columns;
};
