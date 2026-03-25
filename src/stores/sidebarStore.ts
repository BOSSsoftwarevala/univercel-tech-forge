/**
 * SINGLE-CONTEXT SIDEBAR STORE (v2)
 * 
 * GOLDEN RULE: Only ONE context active at a time
 * 
 * Context A = Boss Dashboard (global sidebar visible)
 * Context B = Module View (module sidebar visible, boss sidebar HIDDEN)
 * 
 * RULES:
 * - NEVER show both sidebars together
 * - Module open = Boss UI hidden
 * - Back = Restore Boss UI completely
 * - No overlay, no duplicate screen, no stacked UI
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SidebarType = 'global' | 'category';

export type CategorySidebarId = 
  | 'server-manager'
  | 'vala-ai'
  | 'franchise-manager'
  | 'reseller-manager'
  | 'lead-manager'
  | 'product-demo'
  | 'marketing'
  | 'finance'
  | 'finance-manager'
  | 'sales-support'
  | 'security'
  | 'support'
  | 'settings'
  | 'legal'
  | 'task-management'
  | 'hr-manager'
  | null;

// Active context - either Boss Dashboard or a specific Module
export type ActiveContext = 'boss' | 'module';

interface SidebarState {
  // Core context - ONLY ONE active at a time
  activeContext: ActiveContext;
  
  // Which sidebar is showing
  activeSidebar: SidebarType;
  
  // Which module is active (when activeContext === 'module')
  activeCategorySidebar: CategorySidebarId;
  
  // Collapsed states (persisted)
  globalCollapsed: boolean;
  categoryCollapsed: boolean;
  
  // Transition lock to prevent race conditions
  isTransitioning: boolean;
  
  // Actions
  showGlobalSidebar: () => void;
  showCategorySidebar: (categoryId: CategorySidebarId) => void;
  toggleGlobalCollapsed: () => void;
  toggleCategoryCollapsed: () => void;
  setGlobalCollapsed: (collapsed: boolean) => void;
  setCategoryCollapsed: (collapsed: boolean) => void;
  
  // Context transitions (CLEAN enter/exit)
  exitToGlobal: () => void;
  enterCategory: (categoryId: CategorySidebarId) => void;
  
  // Strict state queries
  isGlobalVisible: () => boolean;
  isCategoryVisible: () => boolean;
  getCurrentCategoryId: () => CategorySidebarId;
  isInBossContext: () => boolean;
  isInModuleContext: () => boolean;
  
  // Safe transition check
  canTransition: () => boolean;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      // Default: Boss context with global sidebar
      activeContext: 'boss',
      activeSidebar: 'global',
      activeCategorySidebar: null,
      globalCollapsed: false,
      categoryCollapsed: false,
      isTransitioning: false,
      
      showGlobalSidebar: () => {
        const state = get();
        if (state.isTransitioning) return;
        
        set({
          activeContext: 'boss',
          activeSidebar: 'global',
          activeCategorySidebar: null,
        });
      },
      
      showCategorySidebar: (categoryId) => {
        const state = get();
        if (state.isTransitioning || !categoryId) return;
        
        set({
          activeContext: 'module',
          activeSidebar: 'category',
          activeCategorySidebar: categoryId,
        });
      },
      
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
      
      // CLEAN EXIT: Module → Boss (full context switch)
      exitToGlobal: () => {
        const state = get();
        if (state.isTransitioning) return;
        
        // Lock transition
        set({ isTransitioning: true });
        
        // Complete state reset to Boss context
        set({
          activeContext: 'boss',
          activeSidebar: 'global',
          activeCategorySidebar: null,
          isTransitioning: false,
        });
      },
      
      // CLEAN ENTER: Boss → Module (full context switch)
      enterCategory: (categoryId) => {
        const state = get();
        if (state.isTransitioning || !categoryId) return;
        
        // Lock transition
        set({ isTransitioning: true });
        
        // Complete state switch to Module context
        set({
          activeContext: 'module',
          activeSidebar: 'category',
          activeCategorySidebar: categoryId,
          isTransitioning: false,
        });
      },
      
      // Query helpers
      isGlobalVisible: () => {
        const state = get();
        return state.activeContext === 'boss' && state.activeSidebar === 'global';
      },
      
      isCategoryVisible: () => {
        const state = get();
        return state.activeContext === 'module' && state.activeSidebar === 'category';
      },
      
      getCurrentCategoryId: () => get().activeCategorySidebar,
      
      isInBossContext: () => get().activeContext === 'boss',
      
      isInModuleContext: () => get().activeContext === 'module',
      
      canTransition: () => !get().isTransitioning,
    }),
    {
      name: 'sidebar-context-store-v2',
      partialize: (state) => ({
        globalCollapsed: state.globalCollapsed,
        categoryCollapsed: state.categoryCollapsed,
      }),
    }
  )
);

/**
 * Hook for components to check if they should render
 * Returns true only if this is the currently active sidebar in the correct context
 */
export function useShouldRenderSidebar(type: SidebarType, categoryId?: CategorySidebarId): boolean {
  const { activeContext, activeSidebar, activeCategorySidebar } = useSidebarStore();
  
  if (type === 'global') {
    // Global sidebar only visible in Boss context
    return activeContext === 'boss' && activeSidebar === 'global';
  }
  
  if (type === 'category' && categoryId) {
    // Category sidebar only visible in Module context AND matching category
    return activeContext === 'module' && 
           activeSidebar === 'category' && 
           activeCategorySidebar === categoryId;
  }
  
  return false;
}

/**
 * Hook to check if we're in Boss Dashboard context
 * Use this to conditionally render Boss-specific UI
 */
export function useIsBossContext(): boolean {
  return useSidebarStore((state) => state.activeContext === 'boss');
}

/**
 * Hook to check if we're in Module context
 * Use this to conditionally render module-specific UI
 */
export function useIsModuleContext(): boolean {
  return useSidebarStore((state) => state.activeContext === 'module');
}
