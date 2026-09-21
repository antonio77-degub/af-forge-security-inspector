import type { ScanMode } from '../../features/scan/scan.types';

type Props = {
  mode: ScanMode;
  title: string;
  description: string;
  selected: boolean;
  onSelect: (mode: ScanMode) => void;
};

export function ModeCard({ mode, title, description, selected, onSelect }: Props) {
  return (
    <button type="button" className={`mode-card ${selected ? 'selected' : ''}`} onClick={() => onSelect(mode)} aria-pressed={selected}>
      <strong>{title}</strong>
      <span>{description}</span>
    </button>
  );
}
