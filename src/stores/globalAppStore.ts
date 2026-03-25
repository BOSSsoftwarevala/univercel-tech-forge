/**
 * Global App Store - STEP 11: Single Source of Truth
 * Manages all global state with role-aware data scoping
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ============= TYPE DEFINITIONS =============

export type ModuleState = 
  | 'BOSS_DASHBOARD'
  | 'SERVER_MANAGER'
  | 'FRANCHISE_MANAGER'
  | 'RESELLER_MANAGER'
  | 'VALA_AI_MANAGER'
  | 'SUPPORT_MANAGER'
  | 'MARKETING_MANAGER'
  | 'PRODUCT_MANAGER'
  | 'LEAD_MANAGER'
  | 'FINANCE_MANAGER'
  | 'LEGAL_MANAGER'
  | 'TASK_MANAGER'
  | 'ROLE_MANAGER'
  | 'HR_MANAGER'
  | 'AI_MANAGER'
  | 'SEO_MANAGER';

export type DataScopeLevel = 
  | 'global'           // Boss - sees everything
  | 'continent'        // Continent Admin
  | 'country'          // Country Admin
  | 'franchise_owned'  // Franchise - own only
  | 'assigned'         // Reseller - assigned only
  | 'ticket_lead'      // Support/Sales
  | 'build_assigned';  // Developer

export interface DataScope {
  level: DataScopeLevel;
  continentId?: string;
  countryId?: string;
  franchiseId?: string;
  assignedIds?: string[];
}

export interface UIState {
  isLoading: boolean;
  loadingMessage?: string;
  error?: string;
  success?: string;
}

export interface FilterState {
  search?: string;
  status?: string;
  dateRange?: { start: string; end: string };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

export interface EntitySelection {
  entityType: string;
  entityId: string;
  entityData?: Record<string, any>;
}

// ============= STORE STATE =============

interface GlobalAppState {
  // Core identifiers
  activeRole: string | null;
  userId: string | null;
  sessionId: string | null;

  // Module state - ONLY ONE ACTIVE
  activeModule: ModuleState;
  activeScreen: string;
  
  // Selected entity
  selectedEntity: EntitySelection | null;
  
  // UI state
  uiState: UIState;
  
  // Data scope (role-based filtering)
  dataScope: DataScope;
  
  // Filters per module (persisted)
  moduleFilters: Record<string, FilterState>;
  
  // Navigation history
  navigationHistory: Array<{
    module: ModuleState;
    screen: string;
    entity?: EntitySelection;
  }>;

  // KPI cache (to prevent stale counts)
  kpiCache: Record<string, { value: number; timestamp: number }>;
}

interface GlobalAppActions {
  // Auth actions
  setActiveRole: (role: string | null) => void;
  setUserId: (userId: string | null) => void;
  setSessionId: (sessionId: string | null) => void;
  
  // Module actions
  setActiveModule: (module: ModuleState, screen?: string) => void;
  setActiveScreen: (screen: string) => void;
  
  // Entity selection
  selectEntity: (entity: EntitySelection | null) => void;
  
  // UI state
  setLoading: (loading: boolean, message?: string) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
  clearUIState: () => void;
  
  // Data scope
  setDataScope: (scope: DataScope) => void;
  
  // Filters
  setModuleFilter: (module: string, filter: Partial<FilterState>) => void;
  clearModuleFilter: (module: string) => void;
  
  // Navigation
  goBack: () => boolean;
  goHome: () => void;
  
  // KPI cache
  updateKPICache: (key: string, value: number) => void;
  getKPIValue: (key: string) => number | null;
  invalidateKPICache: (keys?: string[]) => void;
  
  // Reset
  resetStore: () => void;
}

// ============= DEFAULT VALUES =============

const defaultFilters: FilterState = {
  page: 1,
  pageSize: 20,
  sortOrder: 'desc',
};

const defaultUIState: UIState = {
  isLoading: false,
};

const defaultDataScope: DataScope = {
  level: 'global',
};

// ============= STORE IMPLEMENTATION =============

export const useGlobalAppStore = create<GlobalAppState & GlobalAppActions>()(
  persist(
    (set, get) => ({
      // Initial state
      activeRole: null,
      userId: null,
      sessionId: null,
      activeModule: 'BOSS_DASHBOARD',
      activeScreen: 'dashboard',
      selectedEntity: null,
      uiState: defaultUIState,
      dataScope: defaultDataScope,
      moduleFilters: {},
      navigationHistory: [],
      kpiCache: {},

      // Auth actions
      setActiveRole: (role) => {
        // Update data scope based on role
        const scopeMap: Record<string, DataScope> = {
          boss_owner: { level: 'global' },
          ceo: { level: 'global' },
          area_manager: { level: 'continent' },
          country_head: { level: 'country' },
          franchise: { level: 'franchise_owned' },
          reseller: { level: 'assigned' },
          support: { level: 'ticket_lead' },
          developer: { level: 'build_assigned' },
        };
        
        set({ 
          activeRole: role,
          dataScope: scopeMap[role || ''] || defaultDataScope,
        });
      },
      
      setUserId: (userId) => set({ userId }),
      setSessionId: (sessionId) => set({ sessionId }),

      // Module actions
      setActiveModule: (module, screen = 'dashboard') => {
        const current = get();
        
        // Push to history
        const newHistory = [
          ...current.navigationHistory,
          { 
            module: current.activeModule, 
            screen: current.activeScreen,
            entity: current.selectedEntity || undefined,
          }
        ].slice(-20); // Keep last 20 entries
        
        set({
          activeModule: module,
          activeScreen: screen,
          selectedEntity: null, // Clear entity when changing modules
          navigationHistory: newHistory,
          uiState: { isLoading: false }, // Reset UI state
        });
      },
      
      setActiveScreen: (screen) => set({ activeScreen: screen }),

      // Entity selection
      selectEntity: (entity) => set({ selectedEntity: entity }),

      // UI state
      setLoading: (loading, message) => set({ 
        uiState: { 
          ...get().uiState, 
          isLoading: loading, 
          loadingMessage: message,
          error: loading ? undefined : get().uiState.error, // Clear error on new loading
        } 
      }),
      
      setError: (error) => set({ 
        uiState: { 
          ...get().uiState, 
          error: error || undefined,
          isLoading: false,
        } 
      }),
      
      setSuccess: (success) => set({ 
        uiState: { 
          ...get().uiState, 
          success: success || undefined,
          isLoading: false,
        } 
      }),
      
      clearUIState: () => set({ uiState: defaultUIState }),

      // Data scope
      setDataScope: (scope) => set({ dataScope: scope }),

      // Filters
      setModuleFilter: (module, filter) => {
        const currentFilters = get().moduleFilters;
        set({
          moduleFilters: {
            ...currentFilters,
            [module]: {
              ...defaultFilters,
              ...currentFilters[module],
              ...filter,
            },
          },
        });
      },
      
      clearModuleFilter: (module) => {
        const currentFilters = { ...get().moduleFilters };
        delete currentFilters[module];
        set({ moduleFilters: currentFilters });
      },

      // Navigation
      goBack: () => {
        const history = get().navigationHistory;
        if (history.length === 0) return false;
        
        const newHistory = [...history];
        const previous = newHistory.pop();
        
        if (previous) {
          set({
            activeModule: previous.module,
            activeScreen: previous.screen,
            selectedEntity: previous.entity || null,
            navigationHistory: newHistory,
          });
          return true;
        }
        return false;
      },
      
      goHome: () => {
        set({
          activeModule: 'BOSS_DASHBOARD',
          activeScreen: 'dashboard',
          selectedEntity: null,
          navigationHistory: [],
          uiState: defaultUIState,
        });
      },

      // KPI cache
      updateKPICache: (key, value) => {
        set({
          kpiCache: {
            ...get().kpiCache,
            [key]: { value, timestamp: Date.now() },
          },
        });
      },
      
      getKPIValue: (key) => {
        const cached = get().kpiCache[key];
        if (!cached) return null;
        
        // Cache expires after 5 minutes
        if (Date.now() - cached.timestamp > 5 * 60 * 1000) {
          return null;
        }
        return cached.value;
      },
      
      invalidateKPICache: (keys) => {
        if (!keys) {
          set({ kpiCache: {} });
          return;
        }
        
        const currentCache = { ...get().kpiCache };
        keys.forEach(key => delete currentCache[key]);
        set({ kpiCache: currentCache });
      },

      // Reset
      resetStore: () => set({
        activeRole: null,
        userId: null,
        sessionId: null,
        activeModule: 'BOSS_DASHBOARD',
        activeScreen: 'dashboard',
        selectedEntity: null,
        uiState: defaultUIState,
        dataScope: defaultDataScope,
        moduleFilters: {},
        navigationHistory: [],
        kpiCache: {},
      }),
    }),
    {
      name: 'global-app-state',
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage for security
      partialize: (state) => ({
        // Only persist these fields
        activeModule: state.activeModule,
        activeScreen: state.activeScreen,
        moduleFilters: state.moduleFilters,
        navigationHistory: state.navigationHistory.slice(-10), // Only last 10
      }),
    }
  )
);

export default useGlobalAppStore;
