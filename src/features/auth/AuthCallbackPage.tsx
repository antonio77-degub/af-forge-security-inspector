import type { EmailOtpType } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const emailOtpTypes = new Set<EmailOtpType>([
  'email',
  'signup',
  'invite',
  'magiclink',
  'recovery',
  'email_change',
]);

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
      const tokenHash = params.get('token_hash');
      const rawType = params.get('type');
      const next = params.get('next') || '/';

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setMessage(`Falha ao validar acesso: ${error.message}`);
          return;
        }
      } else if (tokenHash && rawType && emailOtpTypes.has(rawType as EmailOtpType)) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: rawType as EmailOtpType,
        });
        if (error) {
          setMessage(`Falha ao validar acesso: ${error.message}`);
          return;
        }
      }

      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setMessage(`Falha ao carregar sessão: ${error.message}`);
        return;
      }

      if (data.session) navigate(next, { replace: true });
      else setMessage('Sessão não encontrada. Solicite um novo link de acesso.');
    };

    void run();
  }, [navigate, params]);

  return (
    <div className="page">
      <div className="eyebrow">AUTH CALLBACK</div>
      <h1>Acesso seguro</h1>
      <p>{message}</p>
    </div>
  );
}
