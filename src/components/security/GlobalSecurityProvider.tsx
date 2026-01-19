/**
 * GLOBAL UI SECURITY PROVIDER
 * Invisible protection layer for all screens
 * LOCK: No modifications without approval
 */

import { useEffect, useCallback, createContext, useContext, useState, ReactNode } from 'react';

interface SecurityContextType {
  isSecurityEnabled: boolean;
  isBossOverride: boolean;
  enableBossOverride: (duration?: number) => void;
  disableBossOverride: () => void;
}

const SecurityContext = createContext<SecurityContextType>({
  isSecurityEnabled: true,
  isBossOverride: false,
  enableBossOverride: () => {},
  disableBossOverride: () => {},
});

export const useSecurityContext = () => useContext(SecurityContext);

interface GlobalSecurityProviderProps {
  children: ReactNode;
  userRole?: string;
}

export const GlobalSecurityProvider = ({ 
  children, 
  userRole = 'user' 
}: GlobalSecurityProviderProps) => {
  const [isBossOverride, setIsBossOverride] = useState(false);
  const [overrideTimer, setOverrideTimer] = useState<NodeJS.Timeout | null>(null);

  const isBoss = userRole === 'boss' || userRole === 'boss_owner' || userRole === 'super_admin';
  const isSecurityEnabled = !isBossOverride;

  // Boss override functions
  const enableBossOverride = useCallback((duration = 300000) => { // 5 min default
    if (!isBoss) return;
    setIsBossOverride(true);
    
    // Auto-revert after duration
    const timer = setTimeout(() => {
      setIsBossOverride(false);
    }, duration);
    
    setOverrideTimer(timer);
    
    // Log override (silent)
    console.info('[SECURITY] Boss override enabled');
  }, [isBoss]);

  const disableBossOverride = useCallback(() => {
    setIsBossOverride(false);
    if (overrideTimer) {
      clearTimeout(overrideTimer);
      setOverrideTimer(null);
    }
    console.info('[SECURITY] Boss override disabled');
  }, [overrideTimer]);

  // ==============================================
  // RIGHT-CLICK PREVENTION
  // ==============================================
  useEffect(() => {
    if (!isSecurityEnabled) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, [isSecurityEnabled]);

  // ==============================================
  // KEYBOARD SHORTCUTS PREVENTION
  // ==============================================
  useEffect(() => {
    if (!isSecurityEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + key combinations
      if (e.ctrlKey || e.metaKey) {
        // Block: C, V, X (copy, paste, cut)
        if (['c', 'v', 'x'].includes(e.key.toLowerCase())) {
          // Allow in input fields for usability
          const target = e.target as HTMLElement;
          const isInputField = ['INPUT', 'TEXTAREA'].includes(target.tagName) || 
                              target.isContentEditable;
          if (!isInputField) {
            e.preventDefault();
            return false;
          }
        }
        
        // Block: U (view source)
        if (e.key.toLowerCase() === 'u') {
          e.preventDefault();
          return false;
        }
        
        // Block: S (save page)
        if (e.key.toLowerCase() === 's') {
          e.preventDefault();
          return false;
        }
        
        // Block: Shift + I/J/C (DevTools)
        if (e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase())) {
          e.preventDefault();
          return false;
        }
        
        // Block: P (print)
        if (e.key.toLowerCase() === 'p') {
          e.preventDefault();
          return false;
        }
      }
      
      // Block F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      
      // Block PrintScreen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSecurityEnabled]);

  // ==============================================
  // TEXT SELECTION PREVENTION
  // ==============================================
  useEffect(() => {
    if (!isSecurityEnabled) return;

    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement;
      // Allow selection in input fields
      const isInputField = ['INPUT', 'TEXTAREA'].includes(target.tagName) || 
                          target.isContentEditable;
      if (!isInputField) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('selectstart', handleSelectStart);
    return () => document.removeEventListener('selectstart', handleSelectStart);
  }, [isSecurityEnabled]);

  // ==============================================
  // DRAG & DROP PREVENTION
  // ==============================================
  useEffect(() => {
    if (!isSecurityEnabled) return;

    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      // Block image and link dragging
      if (target.tagName === 'IMG' || target.tagName === 'A') {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('dragstart', handleDragStart);
    return () => document.removeEventListener('dragstart', handleDragStart);
  }, [isSecurityEnabled]);

  // ==============================================
  // COPY EVENT PREVENTION
  // ==============================================
  useEffect(() => {
    if (!isSecurityEnabled) return;

    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      const isInputField = ['INPUT', 'TEXTAREA'].includes(target.tagName) || 
                          target.isContentEditable;
      if (!isInputField) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('copy', handleCopy);
    return () => document.removeEventListener('copy', handleCopy);
  }, [isSecurityEnabled]);

  // ==============================================
  // IFRAME FRAME-BUSTING PROTECTION
  // ==============================================
  useEffect(() => {
    if (!isSecurityEnabled) return;

    // Detect if running inside an iframe from a different origin
    try {
      if (window.self !== window.top) {
        // We're in an iframe - check if same origin
        try {
          // This will throw if cross-origin
          const parentLocation = window.parent.location.href;
          // Same origin - allowed
        } catch {
          // Cross-origin iframe detected - blank the page
          document.body.innerHTML = '';
          document.body.style.background = '#000';
        }
      }
    } catch {
      // Error accessing parent - likely cross-origin
    }
  }, [isSecurityEnabled]);

  // ==============================================
  // DEVTOOLS DETECTION (Passive)
  // ==============================================
  useEffect(() => {
    if (!isSecurityEnabled) return;

    let devToolsOpen = false;

    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        if (!devToolsOpen) {
          devToolsOpen = true;
          // Silently log - no UI disruption
          console.info('[SECURITY] DevTools detected');
        }
      } else {
        devToolsOpen = false;
      }
    };

    // Check periodically
    const interval = setInterval(detectDevTools, 1000);
    window.addEventListener('resize', detectDevTools);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', detectDevTools);
    };
  }, [isSecurityEnabled]);

  // ==============================================
  // VISIBILITY CHANGE DETECTION (Screenshot/Recording)
  // ==============================================
  useEffect(() => {
    if (!isSecurityEnabled) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page hidden - possible screenshot/recording
        // Silent detection - no action taken
        console.info('[SECURITY] Page visibility changed');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isSecurityEnabled]);

  // ==============================================
  // CSS-BASED PROTECTIONS
  // ==============================================
  useEffect(() => {
    if (!isSecurityEnabled) return;

    // Add global security styles
    const styleId = 'global-security-styles';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = `
      /* Disable text selection globally (except inputs) */
      body *:not(input):not(textarea):not([contenteditable="true"]) {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
      }
      
      /* Enable selection for inputs */
      input, textarea, [contenteditable="true"] {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
      
      /* Disable image dragging */
      img {
        -webkit-user-drag: none !important;
        -khtml-user-drag: none !important;
        -moz-user-drag: none !important;
        -o-user-drag: none !important;
        user-drag: none !important;
        pointer-events: auto;
      }
      
      /* Disable print */
      @media print {
        body {
          display: none !important;
        }
      }
    `;

    return () => {
      if (styleEl && styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl);
      }
    };
  }, [isSecurityEnabled]);

  // ==============================================
  // LONG PRESS PREVENTION (Mobile)
  // ==============================================
  useEffect(() => {
    if (!isSecurityEnabled) return;

    let touchTimer: NodeJS.Timeout | null = null;

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      // Prevent long-press context menu on non-input elements
      if (!['INPUT', 'TEXTAREA'].includes(target.tagName) && !target.isContentEditable) {
        touchTimer = setTimeout(() => {
          e.preventDefault();
        }, 500);
      }
    };

    const handleTouchEnd = () => {
      if (touchTimer) {
        clearTimeout(touchTimer);
        touchTimer = null;
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchmove', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchmove', handleTouchEnd);
    };
  }, [isSecurityEnabled]);

  return (
    <SecurityContext.Provider 
      value={{ 
        isSecurityEnabled, 
        isBossOverride, 
        enableBossOverride, 
        disableBossOverride 
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};

export default GlobalSecurityProvider;
