import { Link } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export function AccountControl() {
  const { user, signOut, loading } = useAuth();
  if (loading) return <span className="account-status">…</span>;
  if (!user) return <Link className="account-button" to="/login">Entrar</Link>;
  return (
    <div className="account-control">
      <span title={user.email ?? undefined}>{user.email?.split('@')[0] ?? 'Conta'}</span>
      <button type="button" onClick={() => void signOut()}>Sair</button>
    </div>
  );
}
