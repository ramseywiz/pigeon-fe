import styles from './navbar.module.css';
import logo from '../assets/pigeon.png';
import { supabase } from '../lib/supabase';

type NavbarProps = {
  onHamburger: () => void;
};

export const Navbar = ({ onHamburger }: NavbarProps) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <button onClick={onHamburger} className={styles.hamburger}>
          <span />
          <span />
          <span />
        </button>
        <img src={logo} alt="Pigeon" className={styles.logo} />
        Pigeon
      </div>

      <div className={styles.right}>
        <button onClick={handleLogout} className={styles.logout}>
          Logout
        </button>
      </div>
    </nav>
  );
};
