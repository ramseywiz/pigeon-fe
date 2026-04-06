import { useState, useEffect } from 'react';
import styles from './addeventdialog/addeventdialog.module.css';
import { useAppDispatch } from '../store/hooks';
import { EventForm, formStateFromDto, type EventFormState } from './eventform/eventform';
import { updateEvent } from '../store/eventSlice';
import type { EventDto } from '../api/events/eventDto';

interface EditEventDialogProps {
  open: boolean;
  onClose: () => void;
  event: EventDto;
}

export const EditEventDialog = ({ open, onClose, event }: EditEventDialogProps) => {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<EventFormState>(formStateFromDto(event));

  useEffect(() => {
    setForm(formStateFromDto(event));
  }, [event]);

  const handleSubmit = async () => {
    try {
      await dispatch(updateEvent({ id: event.id, form })).unwrap();
      onClose();
    } catch (err) {
      console.error('Failed to update event:', err);
    }
  };

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <div className={styles.dialogHeader}>
          <h2 className={styles.title}>Edit Event</h2>
        </div>
        <div className={styles.dialogBody}>
          <EventForm form={form} onChange={setForm} />
        </div>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.submitBtn} onClick={handleSubmit}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
