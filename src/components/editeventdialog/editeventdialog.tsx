import { useState, useEffect } from 'react';
import { Dialog } from '../dialog/dialog';
import { Button } from '../ui/button';
import { useAppDispatch } from '../../store/hooks';
import {
  defaultFormState,
  EventForm,
  formStateFromDto,
  type EventFormState,
} from '../eventform/eventform';
import { updateEvent } from '../../store/eventSlice';
import type { EventDto } from '../../api/events/eventDto';
import { getEventFormErrors } from '../../lib/eventValidation';
import { useNotification } from '../../notifications/useNotification';

interface EditEventDialogProps {
  open: boolean;
  onClose: () => void;
  event: EventDto;
}

const hasChanges = (form: EventFormState, event: EventDto): boolean => {
  const original = formStateFromDto(event);
  return (Object.keys(original) as (keyof EventFormState)[]).some(
    (key) => form[key] !== original[key],
  );
};

export const EditEventDialog = ({ open, onClose, event }: EditEventDialogProps) => {
  const dispatch = useAppDispatch();
  const { notify } = useNotification();
  const [form, setForm] = useState<EventFormState>(formStateFromDto(event));
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const errors = getEventFormErrors(form);

  useEffect(() => {
    setForm(formStateFromDto(event));
  }, [event]);

  const handleSubmit = async () => {
    if (!hasChanges(form, event)) {
      onClose();
      return;
    }
    setSubmitAttempted(true);
    if (Object.keys(errors).length > 0) return;

    const name = event.eventName;
    onClose();

    const resolve = notify(`Saving "${name}"...`);
    try {
      await dispatch(updateEvent({ id: event.id, form })).unwrap();
      setForm(defaultFormState);
      setSubmitAttempted(false);
      resolve('success', `Saved "${name}" successfully!`);
    } catch {
      resolve('error', `Failed to save "${name}".`);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="View/Edit Event"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Save Changes
          </Button>
        </>
      }
    >
      <EventForm form={form} onChange={setForm} errors={errors} submitAttempted={submitAttempted} />
    </Dialog>
  );
};
