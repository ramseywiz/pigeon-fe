import { Route, Routes, useNavigate } from 'react-router';
import { LoginPage } from './pages/login/page';
import { AppPage } from './pages/app/page';
import { useEffect } from 'react';
import { supabase } from './lib/supabase';

export const AuthListener = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate('/app');
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return null;
};

function App() {
  return (
    <>
      <AuthListener />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/app" element={<AppPage />} />
      </Routes>
    </>
  );
}

export default App;
