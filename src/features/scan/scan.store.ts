import { create } from 'zustand';
import type { ScanMode } from './scan.types';

type ScanState = {
  mode: ScanMode;
  target: string;
  setMode: (mode: ScanMode) => void;
  setTarget: (target: string) => void;
};

export const useScanStore = create<ScanState>((set) => ({
  mode: 'quick',
  target: '',
  setMode: (mode) => set({ mode }),
  setTarget: (target) => set({ target }),
}));
