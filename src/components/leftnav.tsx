import styles from './leftnav.module.css';
import { NavLink } from 'react-router-dom';

type LeftNavProps = {
  links: { label: string; to: string }[];
  open: boolean;
};

export const LeftNav = ({ links, open }: LeftNavProps) => {
  return (
    <nav className={`${styles.leftnav} ${open ? styles.open : styles.closed}`}>
      {links.map(({ label, to }, i) => (
        <>
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            {label}
          </NavLink>
          {i < links.length - 1 && <hr className={styles.separator} />}
        </>
      ))}
    </nav>
  );
};
