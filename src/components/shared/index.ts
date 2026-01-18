/**
 * Shared Components Index
 * Export all shared/reusable components
 */

// Enterprise Button System
export { EnterpriseButton, ApproveButton, RejectButton, SuspendButton } from './EnterpriseButton';
export type { EnterpriseButtonProps, ButtonState } from './EnterpriseButton';

// Action Box with Real Backend Permissions
export { ActionBoxWithPermissions } from './ActionBoxWithPermissions';

// Header Components
export { HeaderIconButton } from './HeaderIconButton';
export { GlobalHeaderActions } from './GlobalHeaderActions';

// Button Binding Utilities
export { 
  generateButtonId, 
  useRegistryClickHandler, 
  WithRegistryBinding, 
  EnsureAction,
  ButtonStatusIndicator,
  ClickableCard,
  ClickableRow as ClickableTableRow 
} from './ButtonBindingUtils';

// Loading & Fallback Components
export { 
  RouteNotFoundScreen, 
  LoadingSkeleton, 
  ComingSoonScreen, 
  ContentSkeleton 
} from './RouteLoadingFallback';

// Breadcrumb
export { default as ModuleBreadcrumb } from './ModuleBreadcrumb';
