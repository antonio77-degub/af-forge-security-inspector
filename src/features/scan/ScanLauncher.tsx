import { useState } from 'react';
import { ModeCard } from '../../components/ui/ModeCard';
import { scanRequestSchema } from './scan.schemas';
import { useScanStore } from './scan.store';

export function ScanLauncher() {
  const { mode, target, setMode, setTarget } = useScanStore();
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const parsed = scanRequestSchema.safeParse({ target, mode });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Entrada inválida.');
      return;
    }
    setError('B0: interface pronta. Execução de scan entra no B3.');
  };

  return (
    <section className="scanner-card" aria-labelledby="scanner-title">
      <div className="eyebrow">EXTERNAL SECURITY POSTURE</div>
      <h1 id="scanner-title">Entenda a segurança externa do seu site.</h1>
      <p>Uma URL. Explicação simples para qualquer pessoa. Evidência técnica quando você precisar.</p>
      <label className="target-field">
        <span>Site ou domínio</span>
        <input value={target} onChange={(event) => setTarget(event.target.value)} placeholder="https://example.com" inputMode="url" autoComplete="url" />
      </label>
      <div className="mode-grid" aria-label="Modo de scan">
        <ModeCard mode="quick" title="⚡ Rápido" description="Principais verificações." selected={mode === 'quick'} onSelect={setMode} />
        <ModeCard mode="deep" title="🔬 Profundo" description="Cobertura completa disponível." selected={mode === 'deep'} onSelect={setMode} />
        <ModeCard mode="custom" title="⚙ Personalizado" description="Você escolhe o que analisar." selected={mode === 'custom'} onSelect={setMode} />
      </div>
      <button className="primary-action" type="button" onClick={submit}>ANALISAR SITE</button>
      {error && <p className="form-note" role="status">{error}</p>}
    </section>
  );
}
