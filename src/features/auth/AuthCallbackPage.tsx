import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { safeNextPath } from './safeNextPath';

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

      const authError = params.get('error_description') || params.get('error');
      if (authError) {
        setMessage(`Falha ao validar acesso: ${authError}`);
        return;
      }

      const mode = params.get('mode');
      const next = safeNextPath(params.get('next'));

      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setMessage(`Falha ao verificar sessão: ${error.message}`);
        return;
      }

      if (data.session) {
        if (mode === 'recovery') {
          navigate(`/reset-password?next=${encodeURIComponent(next)}`, { replace: true });
          return;
        }

        navigate(next, { replace: true });
        return;
      }

      if (params.get('code')) {
        setMessage('Este link pertence ao fluxo antigo. Volte para Entrar e solicite um novo acesso ou recuperação de senha.');
        return;
      }

      setMessage('Sessão não encontrada. Volte para Entrar e tente novamente.');
    };

    void run();
  }, [navigate, params]);

  return (
    <div className="page auth-page">
      <section className="auth-card">
        <div className="eyebrow">AUTH CALLBACK</div>
        <h1>Acesso seguro</h1>
        <p>{message}</p>
      </section>
    </div>
  );
}
