import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [message, setMessage] = useState('Validando acesso…');

  useEffect(() => {
    const run = async () => {
      if (!supabase) {
        setMessage('Supabase não configurado.');
        return;
      }
      const code = params.get('code');
      const next = params.get('next') || '/';
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setMessage(`Falha ao validar acesso: ${error.message}`);
          return;
        }
      }
      const { data } = await supabase.auth.getSession();
      if (data.session) navigate(next, { replace: true });
      else setMessage('Sessão não encontrada. Solicite um novo link de acesso.');
    };
    void run();
  }, [navigate, params]);

  return <div className="page"><div className="eyebrow">AUTH CALLBACK</div><h1>Acesso seguro</h1><p>{message}</p></div>;
}
