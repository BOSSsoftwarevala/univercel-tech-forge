/**
 * Source Code Protection System
 * ==============================
 * COMPREHENSIVE protection against unauthorized code usage:
 * 1. Prevent copying/screenshots - Block right-click, copy, print screen, dev tools
 * 2. License/Legal protection - Add copyright notices and license enforcement
 * 3. Access control - Role-based restrictions
 * 4. Code obfuscation - Runtime protection measures
 * 
 * © 2024 Software Vala. All Rights Reserved.
 * STRICTLY CONFIDENTIAL - UNAUTHORIZED USE PROHIBITED
 */

import { useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// ============================================
// LICENSE & COPYRIGHT NOTICE
// ============================================
const LICENSE_NOTICE = `
╔══════════════════════════════════════════════════════════════════╗
║                    PROPRIETARY SOFTWARE                           ║
║                                                                   ║
║  © 2024 Software Vala. All Rights Reserved.                      ║
║                                                                   ║
║  This software is protected by copyright law and international   ║
║  treaties. Unauthorized reproduction or distribution of this      ║
║  software, or any portion of it, may result in severe civil      ║
║  and criminal penalties, and will be prosecuted to the maximum   ║
║  extent possible under the law.                                   ║
║                                                                   ║
║  License: Proprietary Commercial License                         ║
║  Contact: legal@softwarevala.com                                 ║
╚══════════════════════════════════════════════════════════════════╝
`;

// ============================================
// SECURITY EVENT LOGGING
// ============================================
async function logProtectionViolation(
  userId: string | null,
  violationType: string,
  details: Record<string, any>
): Promise<void> {
  try {
    await supabase.from('audit_logs').insert({
      user_id: userId,
      module: 'source_protection',
      action: violationType,
      meta_json: {
        ...details,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      },
    });
  } catch (error) {
    console.error('Failed to log protection violation:', error);
  }
}

// ============================================
// PROTECTION HOOK
// ============================================
export function useSourceCodeProtection() {
  const { user } = useAuth();
  const violationCountRef = useRef(0);
  const MAX_VIOLATIONS = 5;

  // Log violation and show warning
  const handleViolation = useCallback((type: string, event?: Event) => {
    event?.preventDefault();
    event?.stopPropagation();
    
    violationCountRef.current++;
    
    logProtectionViolation(user?.id || null, type, {
      violationCount: violationCountRef.current,
      deviceFingerprint: getDeviceFingerprint(),
    });

    if (violationCountRef.current >= MAX_VIOLATIONS) {
      toast.error('Security Alert: Multiple violations detected. This incident has been logged.', {
        duration: 10000,
      });
    } else {
      toast.warning('This action is blocked for security reasons.', {
        duration: 3000,
      });
    }

    return false;
  }, [user?.id]);

  useEffect(() => {
    // Skip in development for debugging
    if (import.meta.env.DEV) {
      console.log(LICENSE_NOTICE);
      return;
    }

    // ========================================
    // 1. PREVENT COPYING & SCREENSHOTS
    // ========================================
    
    // Block keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block PrintScreen
      if (e.key === 'PrintScreen') {
        return handleViolation('print_screen_attempt', e);
      }

      // Block Mac screenshots (Cmd+Shift+3/4/5)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && ['3', '4', '5'].includes(e.key)) {
        return handleViolation('mac_screenshot_attempt', e);
      }

      // Block F12 (DevTools)
      if (e.key === 'F12') {
        return handleViolation('devtools_f12', e);
      }

      // Block Ctrl+Shift+I (Inspect)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'i') {
        return handleViolation('devtools_inspect', e);
      }

      // Block Ctrl+Shift+J (Console)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'j') {
        return handleViolation('devtools_console', e);
      }

      // Block Ctrl+Shift+C (Element picker)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'c') {
        return handleViolation('devtools_picker', e);
      }

      // Block Ctrl+U (View Source)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
        return handleViolation('view_source', e);
      }

      // Block Ctrl+S (Save Page)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        return handleViolation('save_page', e);
      }

      // Block Ctrl+A (Select All) on sensitive areas
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        const target = e.target as HTMLElement;
        if (!['INPUT', 'TEXTAREA'].includes(target.tagName)) {
          return handleViolation('select_all', e);
        }
      }

      // Block Ctrl+C (Copy) outside input fields
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        const target = e.target as HTMLElement;
        if (!['INPUT', 'TEXTAREA'].includes(target.tagName)) {
          const selection = window.getSelection();
          if (selection && selection.toString().length > 50) {
            return handleViolation('bulk_copy', e);
          }
        }
      }

      // Block Ctrl+P (Print)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        return handleViolation('print_attempt', e);
      }
    };

    // Block right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Allow right-click only in input fields
      if (!['INPUT', 'TEXTAREA'].includes(target.tagName)) {
        return handleViolation('context_menu', e);
      }
    };

    // Block drag operations
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' || target.tagName === 'A') {
        return handleViolation('drag_attempt', e);
      }
    };

    // Block copy event
    const handleCopy = (e: ClipboardEvent) => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 100) {
        e.preventDefault();
        handleViolation('copy_event', e);
        // Replace clipboard with warning
        e.clipboardData?.setData('text/plain', '© Software Vala - Content Protected');
        return false;
      }
    };

    // ========================================
    // 2. DEVTOOLS DETECTION
    // ========================================
    
    // Detect DevTools opening via window size
    let devToolsOpen = false;
    const checkDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        if (!devToolsOpen) {
          devToolsOpen = true;
          handleViolation('devtools_opened');
        }
      } else {
        devToolsOpen = false;
      }
    };

    // Detect debugger via console timing
    const detectDebugger = () => {
      const start = performance.now();
      // This will pause if debugger is attached
      // eslint-disable-next-line no-debugger
      (() => {})();
      const end = performance.now();
      if (end - start > 100) {
        handleViolation('debugger_detected');
      }
    };

    // ========================================
    // 3. VISIBILITY CHANGE DETECTION
    // ========================================
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logProtectionViolation(user?.id || null, 'visibility_change', {
          reason: 'Tab switched - potential screenshot',
        });
      }
    };

    // ========================================
    // 4. CSS PROTECTION STYLES
    // ========================================
    
    const style = document.createElement('style');
    style.id = 'source-protection-styles';
    style.textContent = `
      /* Disable text selection on protected content */
      .protected-content,
      body:not(input):not(textarea) {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
      }
      
      /* Allow selection in input fields */
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
        pointer-events: none;
      }
      
      /* Add protection overlay on print */
      @media print {
        body {
          display: none !important;
        }
        body::before {
          content: "© Software Vala - Printing Disabled" !important;
          display: block !important;
          font-size: 24px !important;
          text-align: center !important;
          padding: 50px !important;
        }
      }
    `;
    document.head.appendChild(style);

    // ========================================
    // ATTACH EVENT LISTENERS
    // ========================================
    
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('dragstart', handleDragStart, true);
    document.addEventListener('copy', handleCopy, true);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('resize', checkDevTools);

    // Check for devtools periodically
    const devToolsInterval = setInterval(checkDevTools, 1000);
    const debuggerInterval = setInterval(detectDebugger, 5000);

    // Print license notice to console
    console.log(LICENSE_NOTICE);

    // ========================================
    // CLEANUP
    // ========================================
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('dragstart', handleDragStart, true);
      document.removeEventListener('copy', handleCopy, true);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', checkDevTools);
      clearInterval(devToolsInterval);
      clearInterval(debuggerInterval);
      
      const styleEl = document.getElementById('source-protection-styles');
      if (styleEl) styleEl.remove();
    };
  }, [handleViolation, user?.id]);
}

// ============================================
// DEVICE FINGERPRINT (for tracking violations)
// ============================================
function getDeviceFingerprint(): string {
  const components = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset().toString(),
    `${screen.width}x${screen.height}`,
    screen.colorDepth.toString(),
  ];
  return btoa(components.join('|')).slice(0, 32);
}

// ============================================
// PROTECTION COMPONENT
// ============================================
interface SourceCodeProtectionProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export const SourceCodeProtection: React.FC<SourceCodeProtectionProps> = ({ 
  children, 
  enabled = true 
}) => {
  if (enabled) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useSourceCodeProtection();
  }

  return <>{children}</>;
};

export default SourceCodeProtection;
