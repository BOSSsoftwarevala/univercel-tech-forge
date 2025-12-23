import React, { createContext, useContext, ReactNode } from 'react';

/**
 * DEMO TEST MODE - Global Configuration
 * 
 * When enabled:
 * - All demos open freely without approval
 * - No login required for demo access
 * - No popups, warnings, or interruptions
 * - No sound effects or distracting animations
 * - Silent, smooth demo testing experience
 * - Does NOT affect: payments, wallets, real accounts
 * 
 * This is marked internally as TEST MODE only (not visible to users)
 */

interface DemoTestModeContextType {
  // Core test mode flag
  isTestMode: boolean;
  
  // Feature flags
  skipApproval: boolean;
  skipLogin: boolean;
  disablePopups: boolean;
  disableAlerts: boolean;
  disableSounds: boolean;
  disableAnimations: boolean;
  disableWarnings: boolean;
  
  // Safety flags (these stay enabled even in test mode)
  protectPayments: boolean;
  protectWallets: boolean;
  protectRealAccounts: boolean;
  
  // Helper functions
  shouldShowDemoPopup: () => boolean;
  shouldRequireApproval: () => boolean;
  shouldPlaySound: () => boolean;
  shouldShowAnimation: () => boolean;
  shouldRequireLogin: () => boolean;
  shouldShowWarning: () => boolean;
  shouldShowToast: (type: 'demo' | 'payment' | 'system') => boolean;
}

// ENABLE TEST MODE HERE - Set to true for friction-free demo testing
const DEMO_TEST_MODE_ENABLED = true;

const defaultContext: DemoTestModeContextType = {
  isTestMode: DEMO_TEST_MODE_ENABLED,
  
  // When test mode is ON, all these are true (meaning skip/disable)
  skipApproval: DEMO_TEST_MODE_ENABLED,
  skipLogin: DEMO_TEST_MODE_ENABLED,
  disablePopups: DEMO_TEST_MODE_ENABLED,
  disableAlerts: DEMO_TEST_MODE_ENABLED,
  disableSounds: DEMO_TEST_MODE_ENABLED,
  disableAnimations: DEMO_TEST_MODE_ENABLED,
  disableWarnings: DEMO_TEST_MODE_ENABLED,
  
  // Safety flags - always protect these even in test mode
  protectPayments: true,
  protectWallets: true,
  protectRealAccounts: true,
  
  // Helper functions
  shouldShowDemoPopup: () => !DEMO_TEST_MODE_ENABLED,
  shouldRequireApproval: () => !DEMO_TEST_MODE_ENABLED,
  shouldPlaySound: () => !DEMO_TEST_MODE_ENABLED,
  shouldShowAnimation: () => !DEMO_TEST_MODE_ENABLED,
  shouldRequireLogin: () => !DEMO_TEST_MODE_ENABLED,
  shouldShowWarning: () => !DEMO_TEST_MODE_ENABLED,
  shouldShowToast: (type: 'demo' | 'payment' | 'system') => {
    // Always show payment/system toasts, hide demo toasts in test mode
    if (type === 'payment' || type === 'system') return true;
    return !DEMO_TEST_MODE_ENABLED;
  },
};

const DemoTestModeContext = createContext<DemoTestModeContextType>(defaultContext);

export const useDemoTestMode = () => {
  const context = useContext(DemoTestModeContext);
  if (!context) {
    return defaultContext;
  }
  return context;
};

interface DemoTestModeProviderProps {
  children: ReactNode;
}

export const DemoTestModeProvider: React.FC<DemoTestModeProviderProps> = ({ children }) => {
  return (
    <DemoTestModeContext.Provider value={defaultContext}>
      {children}
    </DemoTestModeContext.Provider>
  );
};

// Quick check function that can be used anywhere without hooks
export const isDemoTestMode = () => DEMO_TEST_MODE_ENABLED;

export default DemoTestModeContext;
