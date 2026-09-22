import { Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { AuthCallbackPage } from '../features/auth/AuthCallbackPage';
import { ProtectedRoute } from '../features/auth/ProtectedRoute';
import { ResetPasswordPage } from '../features/auth/ResetPasswordPage';
import { SignInPage } from '../features/auth/SignInPage';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { PlaceholderPage } from '../pages/PlaceholderPage';

const publicModules = [
  ['scan', 'Scan'], ['fix', 'Fix Center'], ['exposure', 'Exposure'], ['vulnerabilities', 'Vulnerabilities'],
  ['web', 'Web'], ['dns', 'DNS'], ['tls', 'TLS'], ['email', 'Email'], ['browser', 'Browser'], ['tools', 'Tools'],
] as const;

const protectedModules = [
  ['assets', 'Assets'], ['history', 'History'], ['monitoring', 'Monitoring'], ['alerts', 'Alerts'],
  ['reports', 'Reports'], ['status', 'Status'],
] as const;

export function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        {publicModules.map(([path, title]) => <Route key={path} path={`/${path}`} element={<PlaceholderPage title={title} />} />)}
        {protectedModules.map(([path, title]) => (
          <Route key={path} path={`/${path}`} element={<ProtectedRoute><PlaceholderPage title={title} /></ProtectedRoute>} />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
}
