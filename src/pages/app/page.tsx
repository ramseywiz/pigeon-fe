import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Navbar } from '../../components/navbar';
import styles from './page.module.css';
import { LeftNav } from '../../components/leftnav';
import { EventGrid } from '../../components/eventgrid';

export const AppPage = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [navOpen, setNavOpen] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setIsAuthed(!!session);
      setLoading(false);
    };

    checkUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!isAuthed) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navbar onHamburger={() => setNavOpen((o) => !o)} />
      <div className={styles.pageBody}>
        <LeftNav
          open={navOpen}
          links={[
            { label: 'Event List', to: '/app' },
            { label: 'Archive', to: '/app/archive' },
          ]}
        />
        <div className={styles.appContainer}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h1 className={styles.cardTitle}>Event List</h1>
              <button className={styles.addBtn}>+ ADD</button>
            </div>
            <div className={styles.cardBody}>
              <EventGrid />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
