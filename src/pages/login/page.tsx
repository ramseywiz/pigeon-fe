import styles from './page.module.css';
import logo from '../../assets/pigeon_dark.png';
import google from '../../assets/google.png';
import { supabase } from '../../lib/supabase';
import { useState } from 'react';

export const LoginPage = () => {
  const [isLogging, setIsLogging] = useState<boolean>(false);

  const handleLogin = async () => {
    setIsLogging(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `window.location.origin`,
      },
    });

    if (error) {
      console.error('Error during login:', error.message);
      setIsLogging(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <main className={styles.loginMain}>
        <img src={logo} alt="Pigeon logo" className={styles.loginLogo} />

        <h1 className={styles.loginTitle}>Welcome to Pigeon</h1>

        <p className={styles.loginSubtext}>You must sign in with a CougarCS account.</p>

        <button className={styles.googleBtn} onClick={handleLogin} disabled={isLogging}>
          <img src={google} alt="Google logo" className={styles.googleIcon} />
          Continue with Google
        </button>
      </main>

      <footer className={styles.loginFooter}>
        <a href="https://cougarcs.com/" target="_blank">
          A tool made for CougarCS. <span>Learn more here.</span>
        </a>
      </footer>
    </div>
  );
};
