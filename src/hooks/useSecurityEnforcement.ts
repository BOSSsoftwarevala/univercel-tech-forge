import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface SecurityViolation {
  type: 'copy' | 'paste' | 'screenshot' | 'contextmenu' | 'devtools' | 'print';
  timestamp: Date;
  details?: string;
}

export function useSecurityEnforcement() {
  const { user } = useAuth();

  const logViolation = useCallback(async (violation: SecurityViolation) => {
    try {
      await supabase.from('audit_logs').insert({
        user_id: user?.id || null,
        module: 'security_enforcement',
        action: `violation_${violation.type}`,
        meta_json: {
          violation_type: violation.type,
          timestamp: violation.timestamp.toISOString(),
          details: violation.details,
          user_agent: navigator.userAgent,
        },
      });
    } catch (error) {
      console.error('Failed to log security violation:', error);
    }
  }, [user]);

  useEffect(() => {
    // Block copy
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      logViolation({ type: 'copy', timestamp: new Date() });
      return false;
    };

    // Block paste
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      logViolation({ type: 'paste', timestamp: new Date() });
      return false;
    };

    // Block cut
    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      logViolation({ type: 'copy', timestamp: new Date(), details: 'cut attempt' });
      return false;
    };

    // Block context menu (right-click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      logViolation({ type: 'contextmenu', timestamp: new Date() });
      return false;
    };

    // Block keyboard shortcuts for copy/paste/print/devtools
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Ctrl+C, Ctrl+V, Ctrl+X
      if (e.ctrlKey || e.metaKey) {
        if (['c', 'v', 'x', 'a'].includes(e.key.toLowerCase())) {
          e.preventDefault();
          logViolation({ type: 'copy', timestamp: new Date(), details: `Ctrl+${e.key}` });
          return false;
        }
        // Block Ctrl+P (print)
        if (e.key.toLowerCase() === 'p') {
          e.preventDefault();
          logViolation({ type: 'print', timestamp: new Date() });
          return false;
        }
        // Block Ctrl+S (save)
        if (e.key.toLowerCase() === 's') {
          e.preventDefault();
          return false;
        }
        // Block Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (DevTools)
        if (e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase())) {
          e.preventDefault();
          logViolation({ type: 'devtools', timestamp: new Date(), details: `Ctrl+Shift+${e.key}` });
          return false;
        }
      }
      // Block F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
        logViolation({ type: 'devtools', timestamp: new Date(), details: 'F12' });
        return false;
      }
      // Block PrintScreen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        logViolation({ type: 'screenshot', timestamp: new Date() });
        return false;
      }
    };

    // Detect screenshot attempts via visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // User switched tabs - potential screenshot
        logViolation({ 
          type: 'screenshot', 
          timestamp: new Date(), 
          details: 'Tab switched - possible screenshot' 
        });
      }
    };

    // Block drag events
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Block selection
    const handleSelectStart = (e: Event) => {
      // Allow selection in input fields
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA'].includes(target.tagName)) {
        return true;
      }
      e.preventDefault();
      return false;
    };

    // Add CSS to disable text selection and pointer events on sensitive elements
    const style = document.createElement('style');
    style.id = 'security-enforcement-styles';
    style.textContent = `
      body {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      input, textarea {
        -webkit-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
      }
      @media print {
        body { display: none !important; }
      }
    `;
    document.head.appendChild(style);

    // Add event listeners
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('cut', handleCut);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('selectstart', handleSelectStart);

    // Cleanup
    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('selectstart', handleSelectStart);
      
      const existingStyle = document.getElementById('security-enforcement-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [logViolation]);
}
