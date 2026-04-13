import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventPageLayout } from '../../components/eventpagelayout/eventpagelayout';
import { EventGrid } from '../../components/eventgrid/eventgrid';
import { ConfirmActionModal } from '../../components/confirmactionmodal/confirmactionmodal';
import { Button } from '../../components/ui/button';
import type { EventDto } from '../../api/events/eventDto';
import { deleteEvents } from '../../store/eventSlice';
import { useAppDispatch } from '../../store/hooks';
import { useNotification } from '../../notifications/useNotification';

export const AppPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { notify } = useNotification();

  const filterActive = useCallback((e: EventDto) => !e.archived, []);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<EventDto[]>([]);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    const count = selectedRows.length;
    const label = count === 1 ? `"${selectedRows[0].eventName}"` : `${count} events`;

    const resolve = notify(`Deleting ${label}...`);
    try {
      setConfirmDeleteOpen(false);
      await dispatch(deleteEvents(selectedRows.map((r) => r.id))).unwrap();
      setSelectedRows([]);
      resolve('success', `Deleted ${label} successfully!`);
    } catch {
      resolve('error', `Failed to delete ${label}.`);
    } finally {
      setDeleting(false);
    }
  };

  const deleteLabel =
    selectedRows.length === 1 ? `"${selectedRows[0].eventName}"` : `${selectedRows.length} events`;

  const actions = (
    <>
      {selectedRows.length === 1 && (
        <Button variant="warning" onClick={() => navigate(`/events/${selectedRows[0].id}`)}>
          EDIT
        </Button>
      )}
      {selectedRows.length > 0 && (
        <Button variant="danger" onClick={() => setConfirmDeleteOpen(true)}>
          {`DELETE (${selectedRows.length})`}
        </Button>
      )}
      <Button onClick={() => navigate('/events/new')}>ADD EVENT</Button>
    </>
  );

  return (
    <EventPageLayout title="Event List" actions={actions}>
      <ConfirmActionModal
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Event"
        message={`Are you sure you want to delete ${deleteLabel}? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        loading={deleting}
      />
      <EventGrid onSelectionChanged={setSelectedRows} filterFn={filterActive} />
    </EventPageLayout>
  );
};
