/**
 * GLOBAL BUTTON EXPORTS
 * Central export point for all button-related utilities
 * 
 * Import from here to ensure consistent button handling across the app
 */

// Core registry and hooks
export { 
  useButtonActionRegistry,
  ACTION_MAP,
  type ActionType,
  type ActionDefinition,
} from '@/hooks/useButtonActionRegistry';

// Safe button components
export { 
  SafeButton, 
  SafeIconButton, 
  SafeCardButton,
  default as SafeButtonDefault,
} from './SafeButton';

// Universal click wrapper
export {
  UniversalClickWrapper,
  TableRowClick,
  ListItemClick,
  default as UniversalClickWrapperDefault,
} from './UniversalClickWrapper';

// Button binding utilities
export {
  generateButtonId,
  useRegistryClickHandler,
  WithRegistryBinding,
  EnsureAction,
  ButtonStatusIndicator,
  ClickableCard,
  ClickableRow,
  ButtonBindingUtils,
} from './ButtonBindingUtils';

// Locked button component
export { LockedButton } from './LockedButton';

// Audit overlay (for development)
export { 
  ButtonAuditOverlay,
  logButtonAudit,
  getAuditLog,
  clearAuditLog,
} from './ButtonAuditOverlay';

// Legacy button hooks (for backwards compatibility)
export { useGlobalNavigation, useButtonHandler } from '@/hooks/useGlobalNavigation';
export { useButtonAction } from '@/hooks/useButtonAction';
