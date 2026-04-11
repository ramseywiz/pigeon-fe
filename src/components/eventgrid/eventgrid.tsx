import { useCallback, useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { themeQuartz } from 'ag-grid-community';
import styles from './eventgrid.module.css';
import { useColumns } from './util/columns';
import {
  fetchEvents,
  selectEvents,
  selectEventsLoading,
  selectEventsError,
} from '../../store/eventSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { EventDto } from '../../api/events/eventDto';
import { EditEventDialog } from '../editeventdialog/editeventdialog';
import { useEventPolling } from '../../hooks/useEventPolling';

const myTheme = themeQuartz.withParams({
  borderColor: '#D9D9D9',
  rowBorder: true,
  borderRadius: 0,
  wrapperBorderRadius: 0,
  backgroundColor: '#FFFFFF',
  headerBackgroundColor: '#F0F0F0',
  oddRowBackgroundColor: '#FAFAFA',
  rowHoverColor: '#E8E8E8',
  foregroundColor: '#131313',
  headerTextColor: '#840B1F',
  fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
  fontSize: 15,
  inputBorder: '#D9D9D9',
  iconColor: '#C80F2E',
  headerColumnResizeHandleColor: '#C80F2E',
});

interface EventGridProps {
  onSelectionChanged?: (rows: EventDto[]) => void;
  filterFn?: (event: EventDto) => boolean;
  readonly?: boolean;
}

export const EventGrid = ({ onSelectionChanged, filterFn, readonly = false }: EventGridProps) => {
  const dispatch = useAppDispatch();
  const allEvents = useAppSelector(selectEvents);
  const loading = useAppSelector(selectEventsLoading);
  const error = useAppSelector(selectEventsError);

  const [selectedEvent, setSelectedEvent] = useState<EventDto | null>(null);

  useEventPolling();

  const handleEdit = useCallback((event: EventDto) => setSelectedEvent(event), []);
  const columns = useColumns(readonly ? undefined : handleEdit);

  const events = useMemo(
    () => (filterFn ? allEvents.filter(filterFn) : allEvents),
    [allEvents, filterFn],
  );

  useEffect(() => {
    if (allEvents.length === 0) {
      dispatch(fetchEvents());
    }
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className={styles.grid}>
        <AgGridReact
          theme={myTheme}
          rowData={events}
          getRowId={(params) => params.data.id}
          columnDefs={columns}
          defaultColDef={{ cellStyle: { textAlign: 'left' } }}
          rowSelection={readonly ? undefined : { mode: 'multiRow' }}
          onSelectionChanged={(e) => onSelectionChanged?.(e.api.getSelectedRows())}
        />
      </div>
      {!readonly && selectedEvent && (
        <EditEventDialog
          open={selectedEvent !== null}
          onClose={() => setSelectedEvent(null)}
          event={selectedEvent}
        />
      )}
    </>
  );
};
