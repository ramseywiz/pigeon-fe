import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import { useMemo } from 'react';
import type { EventDto } from '../../../api/events/eventDto';

// Branch pill colors — tinted from the CougarCS brand palette (index.css)
const BRANCH_STYLES: Record<string, { background: string; color: string }> = {
  Main: { background: 'rgba(200, 15, 46, 0.12)', color: '#840B1F' },
  InfoSec: { background: 'rgba(0, 178, 255, 0.12)', color: '#0D74A0' },
  WebDev: { background: 'rgba(117, 84, 246, 0.12)', color: '#3F2C8C' },
  Tutoring: { background: 'rgba(19, 206, 103, 0.12)', color: '#0D743B' },
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
        ...(onEdit && {
          onCellClicked: (params) => params.data && onEdit(params.data),
          cellStyle: { cursor: 'pointer', color: '#840B1F', textDecoration: 'underline' },
        }),
        cellRenderer: (params: ICellRendererParams<EventDto>) => <span>{params.value}</span>,
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
