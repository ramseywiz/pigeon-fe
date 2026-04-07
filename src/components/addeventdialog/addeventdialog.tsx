import { useState } from 'react';
import styles from './addeventdialog.module.css';
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
  const errors = getEventFormErrors(form);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const handleSubmit = async () => {
    try {
      setSubmitAttempted(true);
      if (Object.keys(errors).length > 0) return;

      await dispatch(addEvent(form)).unwrap();
      onClose();
    } catch (err) {
      console.error('Failed to create event:', err);
    }
  };

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.dialogHeader}>
          <h2 className={styles.title}>Add Event</h2>
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
          <button
            className={styles.cancelBtn}
            onClick={() => {
              onClose();
              setForm(defaultFormState);
              setSubmitAttempted(false);
            }}
          >
            Cancel
          </button>
          <button className={styles.submitBtn} onClick={handleSubmit}>
            Add Event
          </button>
        </div>
      </div>
    </div>
  );
};
