import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from './AuthProvider';
import { safeNextPath } from './safeNextPath';
import { MIN_PASSWORD_LENGTH, validatePassword } from './passwordPolicy';

export function ResetPasswordPage() {
  const { configured, loading, user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeNextPath(params.get('next'));
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  if (!configured) return <Navigate to="/login" replace />;
  if (loading) return <div className="page"><p className="muted">Verificando recuperação…</p></div>;
  if (!user) return <Navigate to="/login" replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase || busy) return;

    const validation = validatePassword(password);
    if (validation) {
      setStatus(validation);
      return;
    }

    if (password !== confirmPassword) {
      setStatus('As senhas não coincidem.');
      return;
    }

    setBusy(true);
    setStatus('Salvando nova senha…');

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setStatus(`Não foi possível salvar a senha: ${error.message}`);
      setBusy(false);
      return;
    }

    setStatus('Senha definida com sucesso.');
    navigate(next, { replace: true });
  };

  return (
    <div className="page auth-page">
      <section className="auth-card">
        <div className="eyebrow">PASSWORD RECOVERY</div>
        <h1>Definir senha</h1>
        <p>Crie uma senha para usar o login normal por e-mail e senha.</p>
        <form onSubmit={submit} className="auth-form">
          <label>
            <span>Nova senha</span>
            <input
              required
              minLength={MIN_PASSWORD_LENGTH}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
            />
          </label>
          <label>
            <span>Confirmar senha</span>
            <input
              required
              minLength={MIN_PASSWORD_LENGTH}
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
            />
          </label>
          <button className="primary-action" type="submit" disabled={busy}>
            {busy ? 'SALVANDO…' : 'SALVAR NOVA SENHA'}
          </button>
        </form>
        {status && <p role="status" className="form-note">{status}</p>}
      </section>
    </div>
  );
}
