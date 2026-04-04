import styles from './navbar.module.css';
import logo from '../assets/pigeon.png';
import { supabase } from '../lib/supabase';

export const Navbar = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <img src={logo} alt="Pigeon" className={styles.logo} />
        <a href="/app">Home</a>
        <a href="/app/add">Add</a>
        <a href="/app/archive">Archive</a>
      </div>

      <div className={styles.right}>
        <button onClick={handleLogout} className={styles.logout}>
          Logout
        </button>
      </div>
    </nav>
  );
};
