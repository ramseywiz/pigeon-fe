import { useState, useEffect } from 'react';
import styles from './addeventdialog.module.css';

interface AddEventDialogProps {
  open: boolean;
  onClose: () => void;
}

interface FormState {
  eventName: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location: string;
  branch: string;
  description: string;
  food: boolean;
  image: File | null;
}

export const AddEventDialog = ({ open, onClose }: AddEventDialogProps) => {
  const [form, setForm] = useState<FormState>({
    eventName: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    branch: '',
    description: '',
    food: false,
    image: null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!form.image) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(form.image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [form.image]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = () => {
    console.log('submit', form);
    onClose();
  };

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <div className={styles.dialogHeader}>
          <h2 className={styles.title}>Add Event</h2>
        </div>

        <div className={styles.dialogBody}>
          <div className={styles.field}>
            <label className={styles.label}>Event Name</label>
            <input
              className={styles.input}
              name="eventName"
              value={form.eventName}
              onChange={handleChange}
              placeholder="e.g. Nvidia Info Session"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Start Date</label>
              <input
                className={styles.input}
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Start Time</label>
              <input
                className={styles.input}
                name="startTime"
                type="time"
                value={form.startTime}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>End Date</label>
              <input
                className={styles.input}
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>End Time</label>
              <input
                className={styles.input}
                name="endTime"
                type="time"
                value={form.endTime}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Location</label>
              <input
                className={styles.input}
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. PGH 232"
              />
            </div>
            <div className={styles.checkboxField}>
              <input
                className={styles.checkbox}
                type="checkbox"
                name="food"
                id="food"
                checked={form.food}
                onChange={handleCheckbox}
              />
              <label htmlFor="food" className={styles.label}>
                Food Provided
              </label>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Branch</label>
            <select
              className={styles.input}
              name="branch"
              value={form.branch}
              onChange={handleChange}
            >
              <option value="">Select a branch</option>
              <option value="Main">Main</option>
              <option value="WebDev">WebDev</option>
              <option value="InfoSec">InfoSec</option>
              <option value="Tutoring">Tutoring</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="This will show up in the announcement!"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Event Flyer</label>
            <label className={styles.uploadArea}>
              {previewUrl ? (
                <div className={styles.uploadPreview}>
                  <img src={previewUrl} alt="preview" className={styles.previewImg} />
                  <span className={styles.uploadFileName}>{form.image?.name}</span>
                </div>
              ) : (
                <div className={styles.uploadPlaceholder}>
                  <span>Click to upload an image</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                className={styles.hiddenInput}
              />
            </label>
          </div>
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
