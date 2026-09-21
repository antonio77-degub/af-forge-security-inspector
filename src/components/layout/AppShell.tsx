import type { PropsWithChildren } from 'react';
import { NavLink } from 'react-router-dom';
import { AccountControl } from '../../features/auth/AccountControl';

const nav = [
  ['/', 'Overview'], ['/scan', 'Scan'], ['/fix', 'Fix Center'], ['/assets', 'Assets'], ['/exposure', 'Exposure'],
  ['/vulnerabilities', 'Vulnerabilities'], ['/tools', 'Tools'], ['/history', 'History'], ['/monitoring', 'Monitoring'],
  ['/alerts', 'Alerts'], ['/reports', 'Reports'],
];

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Navegação principal">
        <div className="brand"><span className="brand-mark">AF</span><div><strong>SECURITY</strong><small>INSPECTOR</small></div></div>
        <nav>{nav.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>{label}</NavLink>)}</nav>
        <div className="sidebar-account"><AccountControl /></div>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
