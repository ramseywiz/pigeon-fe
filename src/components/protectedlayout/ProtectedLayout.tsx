import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import { Navbar } from '../navbar/navbar';
import { LeftNav } from '../leftnav/leftnav';
import styles from './ProtectedLayout.module.css';

const NAV_LINKS = [
  { label: 'Event List', to: '/events' },
  { label: 'Archive', to: '/archive' },
];

export const ProtectedLayout = () => {
  const { loading, isAuthed } = useAuthGuard();
  const [navOpen, setNavOpen] = useState(true);

  if (loading) return <p>Loading...</p>;
  if (!isAuthed) return <Navigate to="/" replace />;

  return (
    <>
      <Navbar onHamburger={() => setNavOpen((o) => !o)} />
      <div className={styles.pageBody}>
        <LeftNav open={navOpen} links={NAV_LINKS} />
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </>
  );
};
