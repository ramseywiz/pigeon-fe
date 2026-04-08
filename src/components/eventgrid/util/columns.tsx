import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { useMemo } from 'react';
import type { EventDto } from '../../../api/events/eventDto';

export const useColumns = (onEdit?: (event: EventDto) => void) => {
  const columns: ColDef<EventDto>[] = useMemo(
    () => [
      {
        field: 'eventName',
        headerName: 'Event Name',
        flex: 1,
        filter: true,
        cellRenderer: (params: ICellRendererParams<EventDto>) =>
          onEdit ? (
            <button
              onClick={() => params.data && onEdit(params.data)}
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
          ) : (
            <span>{params.value}</span>
          ),
      },
      {
        field: 'startDate',
        headerName: 'Start Date & Time',
        flex: 1,
        sortable: true,
        sort: 'asc',
        valueFormatter: (params) => {
          if (!params.value) return '';
          return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          }).format(new Date(`${params.value}T${params.data?.startTime}Z`));
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
      {
        field: 'food',
        headerName: 'Food',
        flex: 0.5,
      },
    ],
    [onEdit],
  );

  return columns;
};
