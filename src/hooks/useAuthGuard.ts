import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface AuthGuardState {
  loading: boolean;
  isAuthed: boolean;
}

export const useAuthGuard = (): AuthGuardState => {
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

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

  return { loading, isAuthed };
};
