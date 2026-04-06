import { useState } from 'react';
import styles from './addeventdialog.module.css';
import { useAppDispatch } from '../../store/hooks';
import { addEvent } from '../../store/eventSlice';
import { defaultFormState, EventForm, type EventFormState } from '../eventform/eventform';

interface AddEventDialogProps {
  open: boolean;
  onClose: () => void;
}

export const AddEventDialog = ({ open, onClose }: AddEventDialogProps) => {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<EventFormState>(defaultFormState);

  const handleSubmit = async () => {
    try {
      await dispatch(addEvent(form)).unwrap();
      onClose();
    } catch (err) {
      console.error('Failed to create event:', err);
    }
  };

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <div className={styles.dialogHeader}>
          <h2 className={styles.title}>Add Event</h2>
        </div>
        <div className={styles.dialogBody}>
          <EventForm form={form} onChange={setForm} />
        </div>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>
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
