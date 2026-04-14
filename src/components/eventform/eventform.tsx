import { useState, useEffect } from 'react';
import styles from './eventform.module.css';
import { ImageViewer } from '../imageviewer/imageviewer';
import type { EventDto } from '../../api/events/eventDto';
import type { EventFormErrors } from '../../lib/eventValidation';

const ExpandIcon = () => (
  // i copied this svg's text and then never saved it. i cannot find the svg so this will have to do.
  <svg
    width="13"
    height="13"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9" />
  </svg>
);

const UploadIcon = () => (
  <svg
    width="34"
    height="34"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

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

const toLocalTime = (date: string, time: string): { date: string; time: string } => {
  const normalizedTime = time.length === 8 ? time : `${time}:00`;
  const utc = new Date(`${date}T${normalizedTime}Z`);
  const localDate = utc.toLocaleDateString('en-CA'); // YYYY-MM-DD
  const localTime = utc.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); // HH:MM
  return { date: localDate, time: localTime };
};

export const formStateFromDto = (event: EventDto): EventFormState => {
  const start = toLocalTime(event.startDate, event.startTime);
  const end = toLocalTime(event.endDate, event.endTime);

  return {
    eventName: event.eventName,
    startDate: start.date,
    startTime: start.time,
    endDate: end.date,
    endTime: end.time,
    location: event.location,
    branch: event.branch,
    description: event.description,
    food: event.food,
    image: null,
    imageUrl: event.imageUrl,
  };
};

type TouchedFields = Partial<Record<keyof EventFormState, boolean>>;

interface EventFormProps {
  form: EventFormState;
  onChange: (form: EventFormState) => void;
  errors?: EventFormErrors;
  submitAttempted?: boolean;
}

const pushTimeBy90Minutes = (time: string): string => {
  if (!time) return '';
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + 90;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
};

export const EventForm = ({
  form,
  onChange,
  errors = {},
  submitAttempted = false,
}: EventFormProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [touched, setTouched] = useState<TouchedFields>({});
  const [imageViewerOpen, setImageViewerOpen] = useState(false);

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
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };

    if (name === 'startDate') {
      updated.endDate = value;
    }

    if (name === 'startTime') {
      updated.endTime = pushTimeBy90Minutes(value);
    }

    onChange(updated);
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...form, [e.target.name]: e.target.checked });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onChange({ ...form, image: file });
  };

  const handleBlur = (field: keyof EventFormState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const errorFor = (field: keyof EventFormErrors): string | undefined => {
    if (submitAttempted || touched[field]) return errors[field];
  };

  const inputClass = (field: keyof EventFormErrors) =>
    [styles.input, errorFor(field) ? styles.inputError : ''].filter(Boolean).join(' ');

  /**
   * Handles image pasting from clipboard.
   * @param e `ClipboardEvent` originating from the form's container div.
   */
  const handleImgPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const img = e.clipboardData?.files[0];
    if (img && img.type.startsWith('image/')) {
      e.preventDefault();
      onChange({ ...form, image: img });
    }
  };

  return (
    <div className={styles.layout} onPaste={handleImgPaste}>
      <div className={styles.imagePanel}>
        <span className={styles.imagePanelLabel}>Event Flyer</span>
        <label className={styles.uploadFull}>
          {previewUrl ? (
            <img src={previewUrl} alt="flyer preview" className={styles.uploadFullImg} />
          ) : (
            <div className={styles.uploadPlaceholder}>
              <UploadIcon />
              <span>Click to upload flyer</span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className={styles.hiddenInput}
          />
          {previewUrl && (
            <button
              type="button"
              className={styles.expandBtn}
              onClick={(e) => {
                e.preventDefault();
                setImageViewerOpen(true);
              }}
              title="View full image"
            >
              <ExpandIcon />
            </button>
          )}
        </label>

        {errorFor('image') && <span className={styles.imagePanelError}>{errorFor('image')}</span>}
      </div>
      <div className={styles.fieldsPanel}>
        <div className={styles.field}>
          <label className={styles.label}>Event Name</label>
          <input
            className={inputClass('eventName')}
            name="eventName"
            value={form.eventName}
            onChange={handleChange}
            onBlur={() => handleBlur('eventName')}
            placeholder="e.g. Nvidia Info Session"
          />
          {errorFor('eventName') && (
            <span className={styles.errorText}>{errorFor('eventName')}</span>
          )}
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Start Date</label>
            <input
              className={inputClass('startDate')}
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
              onBlur={() => handleBlur('startDate')}
            />
            {errorFor('startDate') && (
              <span className={styles.errorText}>{errorFor('startDate')}</span>
            )}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Start Time</label>
            <input
              className={inputClass('startTime')}
              name="startTime"
              type="time"
              value={form.startTime}
              onChange={handleChange}
              onBlur={() => handleBlur('startTime')}
            />
            {errorFor('startTime') && (
              <span className={styles.errorText}>{errorFor('startTime')}</span>
            )}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>End Date</label>
            <input
              className={inputClass('endDate')}
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={handleChange}
              onBlur={() => handleBlur('endDate')}
            />
            {errorFor('endDate') && <span className={styles.errorText}>{errorFor('endDate')}</span>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>End Time</label>
            <input
              className={inputClass('endTime')}
              name="endTime"
              type="time"
              value={form.endTime}
              onChange={handleChange}
              onBlur={() => handleBlur('endTime')}
            />
            {errorFor('endTime') && <span className={styles.errorText}>{errorFor('endTime')}</span>}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Location</label>
            <input
              className={inputClass('location')}
              name="location"
              value={form.location}
              onChange={handleChange}
              onBlur={() => handleBlur('location')}
              placeholder="e.g. PGH 232"
            />
            {errorFor('location') && (
              <span className={styles.errorText}>{errorFor('location')}</span>
            )}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Branch</label>
            <select
              className={inputClass('branch')}
              name="branch"
              value={form.branch}
              onChange={handleChange}
              onBlur={() => handleBlur('branch')}
            >
              <option value="">Select a branch</option>
              <option value="Main">Main</option>
              <option value="WebDev">WebDev</option>
              <option value="InfoSec">InfoSec</option>
              <option value="Tutoring">Tutoring</option>
            </select>
            {errorFor('branch') && <span className={styles.errorText}>{errorFor('branch')}</span>}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <textarea
            className={`${inputClass('description')} ${styles.textarea}`}
            name="description"
            value={form.description}
            onChange={handleChange}
            onBlur={() => handleBlur('description')}
            placeholder="This will show up in the announcement!"
          />
          {errorFor('description') && (
            <span className={styles.errorText}>{errorFor('description')}</span>
          )}
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

      {previewUrl && (
        <ImageViewer
          open={imageViewerOpen}
          onClose={() => setImageViewerOpen(false)}
          src={previewUrl}
          alt={form.image?.name ?? 'Event flyer'}
        />
      )}
    </div>
  );
};
