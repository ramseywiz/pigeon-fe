import { useState, useEffect } from 'react';
import styles from './addeventdialog/addeventdialog.module.css';
import { useAppDispatch } from '../store/hooks';
import {
  defaultFormState,
  EventForm,
  formStateFromDto,
  type EventFormState,
} from './eventform/eventform';
import { updateEvent } from '../store/eventSlice';
import type { EventDto } from '../api/events/eventDto';
import { getEventFormErrors } from '../lib/eventValidation';

interface EditEventDialogProps {
  open: boolean;
  onClose: () => void;
  event: EventDto;
}

export const EditEventDialog = ({ open, onClose, event }: EditEventDialogProps) => {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<EventFormState>(formStateFromDto(event));
  const errors = getEventFormErrors(form);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    setForm(formStateFromDto(event));
  }, [event]);

  const hasChanges = (form: EventFormState, event: EventDto): boolean => {
    const original = formStateFromDto(event);
    return (Object.keys(original) as (keyof EventFormState)[]).some(
      (key) => form[key] !== original[key],
    );
  };

  const handleSubmit = async () => {
    try {
      if (!hasChanges(form, event)) {
        onClose();
        return;
      }
      setSubmitAttempted(true);
      if (Object.keys(errors).length > 0) return;
      await dispatch(updateEvent({ id: event.id, form })).unwrap();
      onClose();
      setForm(defaultFormState);
    } catch (err) {
      console.error('Failed to update event:', err);
    }
  };

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.dialogHeader}>
          <h2 className={styles.title}>View/Edit Event</h2>
        </div>
        <div className={styles.dialogBody}>
          <EventForm
            form={form}
            onChange={setForm}
            errors={errors}
            submitAttempted={submitAttempted}
          />
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
