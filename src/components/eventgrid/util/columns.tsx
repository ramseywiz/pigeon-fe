import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { useMemo } from 'react';
import type { EventDto } from '../../../api/events/eventDto';

const BRANCH_STYLES: Record<string, { background: string; color: string }> = {
  Main: { background: '#fde8e8', color: '#a93226' },
  InfoSec: { background: '#e8f0fd', color: '#1a56a0' },
  WebDev: { background: '#f2e8fd', color: '#6c3aad' },
  Tutoring: { background: '#e8fdf0', color: '#1e7e46' },
};

const formatDuration = (
  startDate: string,
  startTime: string,
  endDate: string,
  endTime: string,
): string => {
  const start = new Date(`${startDate}T${startTime}Z`);
  const end = new Date(`${endDate}T${endTime}Z`);
  const mins = Math.round((end.getTime() - start.getTime()) / 60_000);
  if (mins <= 0) return '';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
};

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
        headerName: 'Start Date & Time, Event Length',
        flex: 1.3,
        sortable: true,
        sort: 'asc',
        cellRenderer: (params: ICellRendererParams<EventDto>) => {
          if (!params.value || !params.data) return '';
          const { startDate, startTime, endDate, endTime } = params.data;
          const dateLabel = new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          }).format(new Date(`${startDate}T${startTime}Z`));
          const duration =
            endDate && endTime ? formatDuration(startDate, startTime, endDate, endTime) : '';
          return (
            <span>
              {dateLabel}
              {duration && (
                <span style={{ marginLeft: 7, opacity: 0.7, fontSize: '12px' }}>{duration}</span>
              )}
            </span>
          );
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
        flex: 0.8,
        filter: true,
        cellStyle: (params) => {
          const style = BRANCH_STYLES[params.value as string];
          if (!style) return null;
          return { background: style.background, color: style.color };
        },
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
