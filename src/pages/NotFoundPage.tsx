import { Link } from 'react-router-dom';
export function NotFoundPage() {
  return <div className="page"><h1>404</h1><p className="muted">Página não encontrada.</p><Link to="/">Voltar ao Overview</Link></div>;
}
