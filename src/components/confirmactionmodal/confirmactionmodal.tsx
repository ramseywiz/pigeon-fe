import { Dialog } from '../dialog/dialog';
import { Button } from '../ui/button';
import styles from './confirmactionmodal.module.css';

interface ConfirmActionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: 'primary' | 'danger' | 'ghost';
  loading?: boolean;
}

export const ConfirmActionModal = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'primary',
  loading = false,
}: ConfirmActionModalProps) => {
  const footer = (
    <>
      <Button variant="ghost" onClick={onClose} disabled={loading}>
        {cancelLabel}
      </Button>
      <Button variant={confirmVariant} onClick={onConfirm} disabled={loading}>
        {loading ? 'Loading...' : confirmLabel}
      </Button>
    </>
  );

  return (
    <Dialog open={open} onClose={loading ? () => {} : onClose} title={title} footer={footer}>
      <p className={styles.message}>{message}</p>
    </Dialog>
  );
};
