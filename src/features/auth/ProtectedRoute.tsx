import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute(_props: PropsWithChildren) {
  return <Navigate to="/login" replace />;
}
