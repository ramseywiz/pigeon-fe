import styles from './imageviewer.module.css';

interface ImageViewerProps {
  open: boolean;
  onClose: () => void;
  src: string;
  alt?: string;
}

export const ImageViewer = ({ open, onClose, src, alt = 'Image preview' }: ImageViewerProps) => {
  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          ✕
        </button>
        <img src={src} alt={alt} className={styles.image} />
      </div>
    </div>
  );
};
