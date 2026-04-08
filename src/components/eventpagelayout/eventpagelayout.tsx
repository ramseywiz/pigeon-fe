import { useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import { Navbar } from '../navbar';
import { LeftNav } from '../leftnav';
import styles from './eventpagelayout.module.css';

const NAV_LINKS = [
  { label: 'Event List', to: '/app' },
  { label: 'Archive', to: '/app/archive' },
];

interface EventPageLayoutProps {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}

export const EventPageLayout = ({ title, actions, children }: EventPageLayoutProps) => {
  const { loading, isAuthed } = useAuthGuard();
  const [navOpen, setNavOpen] = useState(true);

  if (loading) return <p>Loading...</p>;
  if (!isAuthed) return <Navigate to="/" replace />;

  return (
    <>
      <Navbar onHamburger={() => setNavOpen((o) => !o)} />
      <div className={styles.pageBody}>
        <LeftNav open={navOpen} links={NAV_LINKS} />
        <div className={styles.appContainer}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h1 className={styles.cardTitle}>{title}</h1>
              {actions && <div className={styles.headerActions}>{actions}</div>}
            </div>
            <div className={styles.cardBody}>{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};
