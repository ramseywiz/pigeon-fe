import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Navbar } from '../../components/navbar';
import styles from './page.module.css';
import { LeftNav } from '../../components/leftnav';
import { EventGrid } from '../../components/eventgrid/eventgrid';
import { AddEventDialog } from '../../components/addeventdialog/addeventdialog';
import type { EventDto } from '../../api/events/eventDto';
import { deleteEvents } from '../../store/eventSlice';
import { useAppDispatch } from '../../store/hooks';

export const AppPage = () => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [navOpen, setNavOpen] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<EventDto[]>([]);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const ids = selectedRows.map((r) => r.id);
      await dispatch(deleteEvents(ids)).unwrap();
      setSelectedRows([]);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!isAuthed) return <Navigate to="/" replace />;

  return (
    <>
      <Navbar onHamburger={() => setNavOpen((o) => !o)} />
      <AddEventDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
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
              <div className={styles.headerActions}>
                {selectedRows.length > 0 && (
                  <button className={styles.deleteBtn} onClick={handleDelete} disabled={deleting}>
                    {deleting ? 'DELETING...' : `DELETE (${selectedRows.length})`}
                  </button>
                )}
                <button className={styles.addBtn} onClick={() => setDialogOpen(true)}>
                  ADD EVENT
                </button>
              </div>
            </div>
            <div className={styles.cardBody}>
              <EventGrid onSelectionChanged={setSelectedRows} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
