import styles from './navbar.module.css';
import logo from '../assets/pigeon.png';
import logout from '../assets/logout.svg';
import { supabase } from '../lib/supabase';
import hamburger from '../assets/hamburger.svg';

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
        <img src={logo} alt="Pigeon" className={styles.logo} />
        <button onClick={onHamburger} className={styles.hamburger}>
          <img src={hamburger} alt="Menu" className={styles.hamburgerIcon} />
        </button>
      </div>

      <div className={styles.right}>
        <button onClick={handleLogout} className={styles.logout}>
          <img src={logout} className={styles.logoutIcon} alt="Logout" />
        </button>
      </div>
    </nav>
  );
};
