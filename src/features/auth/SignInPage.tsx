import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from './AuthProvider';
import { safeNextPath } from './safeNextPath';
import { MIN_PASSWORD_LENGTH, validatePassword } from './passwordPolicy';

export function SignInPage() {
  const { configured, user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const next = safeNextPath(params.get('next'));

  if (user) return <Navigate to={next} replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase || busy) return;

    const passwordError = validatePassword(password);
    if (passwordError) {
      setStatus(passwordError);
      return;
    }

    setBusy(true);
    setStatus('Entrando…');
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setStatus('Não foi possível entrar. Confira o e-mail e a senha.');
      setBusy(false);
      return;
    }

    navigate(next, { replace: true });
  };

  const requestPasswordReset = async () => {
    if (!supabase || busy) return;
    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setStatus('Digite seu e-mail primeiro.');
      return;
    }

    setBusy(true);
    setStatus('Enviando recuperação de senha…');
    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: `${window.location.origin}/auth/callback?mode=recovery&next=${encodeURIComponent(next)}`,
    });

    setStatus(
      error
        ? `Não foi possível enviar a recuperação: ${error.message}`
        : 'E-mail de recuperação enviado. Abra o link para definir uma nova senha.',
    );
    setBusy(false);
  };

  return (
    <div className="page auth-page">
      <section className="auth-card">
        <div className="eyebrow">OWNER ACCESS</div>
        <h1>Entrar</h1>
        <p>Ambiente privado. Apenas a conta proprietária autorizada pode abrir o Security Inspector.</p>

        {!configured ? (
          <div className="notice warning">Supabase não está configurado neste ambiente.</div>
        ) : (
          <form onSubmit={submit} className="auth-form">
            <label>
              <span>E-mail</span>
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="E-mail"
                autoComplete="email"
              />
            </label>
            <label>
              <span>Senha</span>
              <input
                required
                minLength={MIN_PASSWORD_LENGTH}
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                placeholder={`Mínimo de ${MIN_PASSWORD_LENGTH} caracteres`}
              />
            </label>
            <button className="primary-action" type="submit" disabled={busy}>
              {busy ? 'PROCESSANDO…' : 'ENTRAR'}
            </button>
            <button className="link-button" type="button" onClick={() => void requestPasswordReset()} disabled={busy}>
              Recuperar senha
            </button>
          </form>
        )}

        {status && <p role="status" className="form-note">{status}</p>}
      </section>
    </div>
  );
}
