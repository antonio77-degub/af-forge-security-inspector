import type { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { loading, user, configured } = useAuth();
  const location = useLocation();

  if (loading) return <div className="page"><p className="muted">Verificando sessão…</p></div>;
  if (!configured || !user) {
    const next = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  return children;
}
