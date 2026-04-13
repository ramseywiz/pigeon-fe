import { useState, useEffect } from 'react';
import { Dialog } from '../dialog/dialog';
import { Button } from '../ui/button';
import styles from './announcementpreview.module.css';
import type { EventFormState } from '../eventform/eventform';

function formatTime(hhmm: string): string {
  if (!hhmm) return '–';
  const [h, m] = hhmm.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

function renderInline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part || null;
  });
}

interface AnnouncementPreviewProps {
  open: boolean;
  onClose: () => void;
  form: EventFormState;
}

export const AnnouncementPreview = ({ open, onClose, form }: AnnouncementPreviewProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (form.image) {
      const url = URL.createObjectURL(form.image);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setImageUrl(form.imageUrl);
  }, [form.image, form.imageUrl, open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Announcement Preview"
      footer={
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className={styles.content}>
        <p className={styles.h1}>📣 Announcement Preview!</p>

        <p className={styles.h2}>{form.eventName || 'Untitled Event'}</p>

        {form.description && <p className={styles.line}>{form.description}</p>}

        <p className={styles.line}>
          {renderInline(`🕐 **When:** ${formatTime(form.startTime)} – ${formatTime(form.endTime)}`)}
        </p>
        <p className={styles.line}>{renderInline(`📍 **Where:** ${form.location || 'TBD'}`)}</p>
        {form.food && <p className={styles.line}>🍕 Food will be provided!</p>}

        <p className={styles.line}>{"We'll see you guys there! 🪶"}</p>

        {imageUrl && <img src={imageUrl} alt="Event flyer" className={styles.flyerImg} />}
      </div>
    </Dialog>
  );
};
