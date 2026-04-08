import { useState } from 'react';
import { Dialog } from '../dialog/dialog';
import { Button } from '../ui/button';
import { useAppDispatch } from '../../store/hooks';
import { addEvent } from '../../store/eventSlice';
import { defaultFormState, EventForm, type EventFormState } from '../eventform/eventform';
import { getEventFormErrors } from '../../lib/eventValidation';

interface AddEventDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AddEventDialog = ({ open, onClose }: AddEventDialogProps) => {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<EventFormState>(defaultFormState);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const errors = getEventFormErrors(form);

  const handleClose = () => {
    onClose();
    setForm(defaultFormState);
    setSubmitAttempted(false);
  };

  const handleSubmit = async () => {
    try {
      setSubmitAttempted(true);
      if (Object.keys(errors).length > 0) return;

      handleClose();
      await dispatch(addEvent(form)).unwrap();
    } catch (err) {
      console.error('Failed to create event:', err);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Add Event"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Add Event
          </Button>
        </>
      }
    >
      <EventForm form={form} onChange={setForm} errors={errors} submitAttempted={submitAttempted} />
    </Dialog>
  );
};
