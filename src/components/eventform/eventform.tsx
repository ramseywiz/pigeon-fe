import { useState, useEffect } from 'react';
import styles from './eventform.module.css';
import type { EventDto } from '../../api/events/eventDto';

export interface EventFormState {
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
  imageUrl: string | null;
}

export const defaultFormState: EventFormState = {
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
  imageUrl: null,
};

export const formStateFromDto = (event: EventDto): EventFormState => ({
  eventName: event.eventName,
  startDate: event.startDate,
  startTime: event.startTime,
  endDate: event.endDate,
  endTime: event.endTime,
  location: event.location,
  branch: event.branch,
  description: event.description,
  food: event.food,
  image: null,
  imageUrl: event.imageUrl,
});

interface EventFormProps {
  form: EventFormState;
  onChange: (form: EventFormState) => void;
}

export const EventForm = ({ form, onChange }: EventFormProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!form.image) {
      setPreviewUrl(form.imageUrl);
      return;
    }
    const url = URL.createObjectURL(form.image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [form.image, form.imageUrl]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    onChange({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...form, [e.target.name]: e.target.checked });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onChange({ ...form, image: file });
  };

  return (
    <>
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
        <select className={styles.input} name="branch" value={form.branch} onChange={handleChange}>
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
              <span className={styles.uploadFileName}>{form.image?.name ?? 'Current flyer'}</span>
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
    </>
  );
};
