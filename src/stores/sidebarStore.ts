/**
 * SINGLE SIDEBAR ENFORCEMENT STORE
 * 
 * ABSOLUTE RULE: Only ONE sidebar visible at any time
 * - Global sidebar: Role switching, main navigation
 * - Category sidebar: Module-specific navigation
 * 
 * NEVER show both together - this is enforced at store level
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SidebarType = 'global' | 'category';

export type CategorySidebarId = 
  | 'server-manager'
  | 'dev-control'
  | 'vala-ai'
  | 'franchise-manager'
  | 'reseller-manager'
  | 'lead-manager'
  | 'product-demo'
  | 'marketing'
  | 'finance'
  | 'security'
  | 'support'
  | 'settings'
  | null;

interface SidebarState {
  // Core state - which sidebar is active
  activeSidebar: SidebarType;
  
  // Which category sidebar is showing (when activeSidebar === 'category')
  activeCategorySidebar: CategorySidebarId;
  
  // Collapsed state for each sidebar type
  globalCollapsed: boolean;
  categoryCollapsed: boolean;
  
  // Actions
  showGlobalSidebar: () => void;
  showCategorySidebar: (categoryId: CategorySidebarId) => void;
  toggleGlobalCollapsed: () => void;
  toggleCategoryCollapsed: () => void;
  setGlobalCollapsed: (collapsed: boolean) => void;
  setCategoryCollapsed: (collapsed: boolean) => void;
  
  // Navigation helpers
  exitToGlobal: () => void;
  enterCategory: (categoryId: CategorySidebarId) => void;
  
  // State queries
  isGlobalVisible: () => boolean;
  isCategoryVisible: () => boolean;
  getCurrentCategoryId: () => CategorySidebarId;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      // Default: Global sidebar visible
      activeSidebar: 'global',
      activeCategorySidebar: null,
      globalCollapsed: false,
      categoryCollapsed: false,
      
      showGlobalSidebar: () => set({
        activeSidebar: 'global',
        activeCategorySidebar: null,
      }),
      
      showCategorySidebar: (categoryId) => set({
        activeSidebar: 'category',
        activeCategorySidebar: categoryId,
      }),
      
      toggleGlobalCollapsed: () => set((state) => ({
        globalCollapsed: !state.globalCollapsed,
      })),
      
      toggleCategoryCollapsed: () => set((state) => ({
        categoryCollapsed: !state.categoryCollapsed,
      })),
      
      setGlobalCollapsed: (collapsed) => set({
        globalCollapsed: collapsed,
      }),
      
      setCategoryCollapsed: (collapsed) => set({
        categoryCollapsed: collapsed,
      }),
      
      // Exit category → return to global
      exitToGlobal: () => {
        set({
          activeSidebar: 'global',
          activeCategorySidebar: null,
        });
      },
      
      // Enter a category → hide global, show category
      enterCategory: (categoryId) => {
        if (!categoryId) return;
        set({
          activeSidebar: 'category',
          activeCategorySidebar: categoryId,
        });
      },
      
      // Query helpers
      isGlobalVisible: () => get().activeSidebar === 'global',
      isCategoryVisible: () => get().activeSidebar === 'category',
      getCurrentCategoryId: () => get().activeCategorySidebar,
    }),
    {
      name: 'sidebar-visibility-store',
      partialize: (state) => ({
        globalCollapsed: state.globalCollapsed,
        categoryCollapsed: state.categoryCollapsed,
      }),
    }
  )
);

/**
 * Hook for components to check if they should render
 * Returns true only if this is the currently active sidebar
 */
export function useShouldRenderSidebar(type: SidebarType, categoryId?: CategorySidebarId): boolean {
  const { activeSidebar, activeCategorySidebar } = useSidebarStore();
  
  if (type === 'global') {
    return activeSidebar === 'global';
  }
  
  if (type === 'category') {
    return activeSidebar === 'category' && activeCategorySidebar === categoryId;
  }
  
  return false;
}
