import { useState } from 'react';
import { EventPageLayout } from '../../components/eventpagelayout/eventpagelayout';
import { EventGrid } from '../../components/eventgrid/eventgrid';
import { AddEventDialog } from '../../components/addeventdialog/addeventdialog';
import { Button } from '../../components/ui/button';
import type { EventDto } from '../../api/events/eventDto';
import { deleteEvents } from '../../store/eventSlice';
import { useAppDispatch } from '../../store/hooks';

export const AppPage = () => {
  const dispatch = useAppDispatch();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<EventDto[]>([]);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteEvents(selectedRows.map((r) => r.id))).unwrap();
      setSelectedRows([]);
    } finally {
      setDeleting(false);
    }
  };

  const actions = (
    <>
      {selectedRows.length > 0 && (
        <Button variant="danger" onClick={handleDelete} disabled={deleting}>
          {deleting ? 'DELETING...' : `DELETE (${selectedRows.length})`}
        </Button>
      )}
      <Button onClick={() => setDialogOpen(true)}>ADD EVENT</Button>
    </>
  );

  return (
    <EventPageLayout title="Event List" actions={actions}>
      <AddEventDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
      <EventGrid onSelectionChanged={setSelectedRows} filterFn={(e) => !e.archived} />
    </EventPageLayout>
  );
};
