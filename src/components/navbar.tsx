import styles from './navbar.module.css';
import logo from '../assets/pigeon.png';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <img src={logo} alt="Pigeon" className={styles.logo} />
        <Link to="/app">Home</Link>
        <Link to="/app/add">Add</Link>
        <Link to="/app/archive">Archive</Link>
      </div>

      <div className={styles.right}>
        <button onClick={handleLogout} className={styles.logout}>
          Logout
        </button>
      </div>
    </nav>
  );
};
