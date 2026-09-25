import type { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const OWNER_USER_ID = '127bcdcf-0f0d-4226-99f2-3cc2a0b28508';

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { loading, user, configured, signOut } = useAuth();
  const location = useLocation();

  if (loading) return <div className="page"><p className="muted">Verificando sessão…</p></div>;
  if (!configured || !user) {
    const next = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  if (user.id !== OWNER_USER_ID) {
    void signOut();
    return <Navigate to="/login" replace />;
  }

  return children;
}
