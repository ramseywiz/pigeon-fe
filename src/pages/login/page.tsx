import styles from './page.module.css';
import logo from '../../assets/pigeon_dark.png';
import google from '../../assets/google.png';
import { supabase } from '../../lib/supabase';
import { useEffect, useState } from 'react';

export const LoginPage = () => {
  const [isLogging, setIsLogging] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    const hashString = window.location.hash.startsWith('#')
      ? window.location.hash.substring(1)
      : window.location.hash;

    const hashParams = new URLSearchParams(hashString);

    const errorDescription =
      searchParams.get('error_description') || hashParams.get('error_description');

    if (!errorDescription) return;

    if (errorDescription?.includes('403')) {
      setLoginError('Only CougarCS Google accounts are allowed.');
    } else {
      setLoginError(errorDescription);
    }

    window.history.replaceState({}, document.title, window.location.pathname);
  }, []);

  const handleLogin = async () => {
    setIsLogging(true);
    setLoginError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      setLoginError(error.message);
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

        {loginError && <p className={styles.errorMessage}>{loginError}</p>}
      </main>

      <footer className={styles.loginFooter}>
        <a href="https://cougarcs.com/" target="_blank">
          A tool made for CougarCS. <span>Learn more here.</span>
        </a>
      </footer>
    </div>
  );
};
