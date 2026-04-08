import type { ReactNode } from 'react';
import styles from './eventpagelayout.module.css';

interface EventPageLayoutProps {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}

export const EventPageLayout = ({ title, actions, children }: EventPageLayoutProps) => (
  <div className={styles.card}>
    <div className={styles.cardHeader}>
      <h1 className={styles.cardTitle}>{title}</h1>
      {actions && <div className={styles.headerActions}>{actions}</div>}
    </div>
    <div className={styles.cardBody}>{children}</div>
  </div>
);
