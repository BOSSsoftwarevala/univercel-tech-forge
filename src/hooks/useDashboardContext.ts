import { create } from 'zustand';

// Types for selected dashboard context
export interface SelectedControlCard {
  id: string;
  label: string;
  value: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  subValues: string[];
  lastUpdate: string;
  actions: string[];
}

interface DashboardContextState {
  selectedCard: SelectedControlCard | null;
  setSelectedCard: (card: SelectedControlCard | null) => void;
  clearSelection: () => void;
}

// Zustand store for global dashboard context
export const useDashboardContext = create<DashboardContextState>((set) => ({
  selectedCard: null,
  setSelectedCard: (card) => set({ selectedCard: card }),
  clearSelection: () => set({ selectedCard: null }),
}));
