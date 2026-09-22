import { useState, type FormEvent } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from './AuthProvider';
import { safeNextPath } from './safeNextPath';

export function SignInPage() {
  const { configured, user } = useAuth();
  const [params] = useSearchParams();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const next = safeNextPath(params.get('next'));

  if (user) return <Navigate to={next} replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setStatus('Enviando link seguro…');
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        shouldCreateUser: true,
      },
    });
    setStatus(error ? `Não foi possível enviar o link: ${error.message}` : 'Link enviado. Verifique seu e-mail para entrar.');
  };

  return (
    <div className="page auth-page">
      <section className="auth-card">
        <div className="eyebrow">SECURE ACCESS</div>
        <h1>Entrar</h1>
        <p>Scans públicos continuam disponíveis sem conta. Login é necessário para salvar histórico, monitorar ativos, receber alertas e guardar relatórios.</p>
        {!configured ? (
          <div className="notice warning">Supabase ainda não está conectado a este ambiente. B1 está preparado, mas o projeto e as chaves públicas precisam ser configurados.</div>
        ) : (
          <form onSubmit={submit} className="auth-form">
            <label>
              <span>E-mail</span>
              <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@exemplo.com" autoComplete="email" />
            </label>
            <button className="primary-action" type="submit">ENVIAR LINK DE ACESSO</button>
          </form>
        )}
        {status && <p role="status" className="form-note">{status}</p>}
      </section>
    </div>
  );
}
