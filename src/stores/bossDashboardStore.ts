/**
 * Boss Dashboard State Management Hook
 * STEP 12: Global state for Boss Dashboard navigation & active module
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type BossModule = 
  | 'dashboard'
  | 'server'
  | 'development'
  | 'franchise'
  | 'reseller'
  | 'leads'
  | 'marketing'
  | 'product-demo'
  | 'finance'
  | 'security'
  | 'ai-ceo'
  | 'support'
  | 'settings';

export type BossScreen = string;

interface SelectedKPI {
  id: string;
  label: string;
  value: string;
  source: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  actions: string[];
}

interface BossDashboardState {
  // Navigation state
  activeModule: BossModule;
  activeScreen: BossScreen;
  activeSidebarItem: string;
  
  // Selection state
  selectedKPI: SelectedKPI | null;
  
  // UI state
  sidebarCollapsed: boolean;
  modalOpen: boolean;
  
  // Navigation history for back button
  navHistory: string[];
  
  // Actions
  setActiveModule: (module: BossModule) => void;
  setActiveScreen: (screen: BossScreen) => void;
  setActiveSidebarItem: (item: string) => void;
  setSelectedKPI: (kpi: SelectedKPI | null) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setModalOpen: (open: boolean) => void;
  navigateToModule: (module: BossModule, screen?: BossScreen) => void;
  goBack: () => boolean;
  reset: () => void;
}

const initialState = {
  activeModule: 'dashboard' as BossModule,
  activeScreen: 'overview',
  activeSidebarItem: 'dashboard',
  selectedKPI: null,
  sidebarCollapsed: false,
  modalOpen: false,
  navHistory: ['dashboard'],
};

export const useBossDashboardStore = create<BossDashboardState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setActiveModule: (module) => {
        set((state) => ({
          activeModule: module,
          // Reset KPI selection when module changes
          selectedKPI: null,
          // Add to history
          navHistory: [...state.navHistory.slice(-10), module],
        }));
      },

      setActiveScreen: (screen) => {
        set({ activeScreen: screen });
      },

      setActiveSidebarItem: (item) => {
        set({ activeSidebarItem: item });
      },

      setSelectedKPI: (kpi) => {
        set({ selectedKPI: kpi });
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed });
      },

      setModalOpen: (open) => {
        set({ modalOpen: open });
      },

      navigateToModule: (module, screen) => {
        set((state) => ({
          activeModule: module,
          activeScreen: screen || 'overview',
          activeSidebarItem: module,
          selectedKPI: null,
          navHistory: [...state.navHistory.slice(-10), module],
        }));
      },

      goBack: () => {
        const { navHistory } = get();
        if (navHistory.length <= 1) {
          return false;
        }
        
        const newHistory = [...navHistory];
        newHistory.pop(); // Remove current
        const previousModule = newHistory[newHistory.length - 1] as BossModule;
        
        set({
          activeModule: previousModule,
          activeScreen: 'overview',
          activeSidebarItem: previousModule,
          selectedKPI: null,
          navHistory: newHistory,
        });
        
        return true;
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'boss-dashboard-state',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        // Don't persist activeModule/screen to always start fresh
      }),
    }
  )
);

// Selector hooks for specific state slices
export const useActiveModule = () => useBossDashboardStore((s) => s.activeModule);
export const useActiveScreen = () => useBossDashboardStore((s) => s.activeScreen);
export const useSelectedKPI = () => useBossDashboardStore((s) => s.selectedKPI);
export const useSidebarCollapsed = () => useBossDashboardStore((s) => s.sidebarCollapsed);
