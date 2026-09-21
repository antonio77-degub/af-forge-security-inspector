import { ScanLauncher } from '../features/scan/ScanLauncher';

const pillars = [
  ['Scan', 'Quick, Deep e Custom em um único fluxo.'],
  ['Understand', 'Resultados explicados em linguagem humana.'],
  ['Fix', 'Correção guiada e reteste direcionado.'],
  ['Monitor', 'Histórico, mudanças, uptime e alertas.'],
];

export function HomePage() {
  return (
    <div className="page home-page">
      <ScanLauncher />
      <section className="pillar-grid" aria-label="Fluxo do produto">
        {pillars.map(([title, text]) => <article className="pillar" key={title}><strong>{title}</strong><span>{text}</span></article>)}
      </section>
      <section className="coverage-strip">
        <span>WEB</span><span>TLS</span><span>DNS</span><span>EMAIL</span><span>ASSETS</span><span>EXPOSURE</span><span>VULNERABILITIES</span><span>THREATS</span>
      </section>
    </div>
  );
}
