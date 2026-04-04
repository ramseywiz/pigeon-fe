import styles from './page.module.css';
import logo from '../../assets/pigeon_dark.png';
import google from '../../assets/google.png';
import { supabase } from '../../lib/supabase';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogging, setIsLogging] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        navigate('/app', { replace: true });
      }
    };

    checkSession();

    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));

    const errorDescription =
      searchParams.get('error_description') || hashParams.get('error_description');

    if (errorDescription) {
      setAuthError('You must sign in with a CougarCS Google account.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/app', { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogin = async () => {
    setIsLogging(true);
    setAuthError('');

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      setAuthError(error.message);
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

        {authError && <p className={styles.errorMessage}>{authError}</p>}
      </main>

      <footer className={styles.loginFooter}>
        <a href="https://cougarcs.com/" target="_blank">
          A tool made for CougarCS. <span>Learn more here.</span>
        </a>
      </footer>
    </div>
  );
};
