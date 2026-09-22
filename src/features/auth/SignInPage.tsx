import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from './AuthProvider';
import { safeNextPath } from './safeNextPath';
import { MIN_PASSWORD_LENGTH, validatePassword } from './passwordPolicy';

type AuthMode = 'sign-in' | 'sign-up';

export function SignInPage() {
  const { configured, user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>('sign-in');
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
    setStatus(mode === 'sign-in' ? 'Entrando…' : 'Criando conta…');

    if (mode === 'sign-in') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setStatus('Não foi possível entrar. Confira o e-mail e a senha.');
        setBusy(false);
        return;
      }

      navigate(next, { replace: true });
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?mode=signup&next=${encodeURIComponent(next)}`,
      },
    });

    if (error) {
      setStatus(`Não foi possível criar a conta: ${error.message}`);
      setBusy(false);
      return;
    }

    if (data.session) {
      navigate(next, { replace: true });
      return;
    }

    setStatus('Conta criada. Abra o e-mail de confirmação e depois volte para entrar com sua senha.');
    setBusy(false);
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
        <div className="eyebrow">SECURE ACCESS</div>
        <h1>{mode === 'sign-in' ? 'Entrar' : 'Criar conta'}</h1>
        <p>
          Use e-mail e senha. O login continua salvo neste navegador até você sair.
        </p>

        <div className="auth-switch" role="tablist" aria-label="Modo de autenticação">
          <button
            type="button"
            className={mode === 'sign-in' ? 'active' : ''}
            onClick={() => {
              setMode('sign-in');
              setStatus(null);
            }}
          >
            Entrar
          </button>
          <button
            type="button"
            className={mode === 'sign-up' ? 'active' : ''}
            onClick={() => {
              setMode('sign-up');
              setStatus(null);
            }}
          >
            Criar conta
          </button>
        </div>

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
                placeholder="voce@exemplo.com"
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
                autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
                placeholder={`Mínimo de ${MIN_PASSWORD_LENGTH} caracteres`}
              />
            </label>
            <button className="primary-action" type="submit" disabled={busy}>
              {busy ? 'PROCESSANDO…' : mode === 'sign-in' ? 'ENTRAR' : 'CRIAR CONTA'}
            </button>
            <button className="link-button" type="button" onClick={() => void requestPasswordReset()} disabled={busy}>
              Criar ou recuperar senha
            </button>
          </form>
        )}

        {status && <p role="status" className="form-note">{status}</p>}
      </section>
    </div>
  );
}
