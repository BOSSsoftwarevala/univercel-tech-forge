/**
 * BUTTON AUDIT OVERLAY
 * Debug mode to highlight unbound buttons and log missing handlers
 * 
 * RULES:
 * - Block deployment if dead clicks found
 * - Highlight unmapped buttons in red
 * - Show button registry status
 */

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, X, Bug, Eye, EyeOff, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ACTION_MAP } from '@/hooks/useButtonActionRegistry';

interface ButtonAuditResult {
  elementId: string;
  element: string;
  hasAction: boolean;
  hasOnClick: boolean;
  isClickable: boolean;
  location: string;
}

// Global audit log storage
const auditLog: ButtonAuditResult[] = [];

export function logButtonAudit(result: ButtonAuditResult) {
  const exists = auditLog.find(r => r.elementId === result.elementId);
  if (!exists) {
    auditLog.push(result);
  }
}

// Export for external access
export function getAuditLog(): ButtonAuditResult[] {
  return [...auditLog];
}

export function clearAuditLog() {
  auditLog.length = 0;
}

interface ButtonAuditOverlayProps {
  enabled?: boolean;
}

const ButtonAuditOverlayInner: React.FC<ButtonAuditOverlayProps> = ({
  enabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<ButtonAuditResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [highlightUnbound, setHighlightUnbound] = useState(false);

  // Scan DOM for clickable elements
  const scanForButtons = useCallback(() => {
    setIsScanning(true);
    const scannedResults: ButtonAuditResult[] = [];
    
    // Find all potentially clickable elements
    const clickableSelectors = [
      'button',
      '[role="button"]',
      'a[href]',
      '[onclick]',
      '.cursor-pointer',
      '[data-button-id]',
    ];
    
    const elements = document.querySelectorAll(clickableSelectors.join(','));
    
    elements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      const buttonId = htmlEl.dataset.buttonId || htmlEl.id || htmlEl.className.split(' ')[0] || 'unknown';
      
      // Check if has onClick handler
      const hasOnClick = !!(
        htmlEl.onclick || 
        htmlEl.getAttribute('onclick') ||
        htmlEl.dataset.buttonId
      );
      
      // Check if in action registry
      const hasAction = !!ACTION_MAP[buttonId];
      
      // Determine if truly clickable
      const isDisabled = htmlEl.hasAttribute('disabled') || htmlEl.classList.contains('cursor-not-allowed');
      const isClickable = (hasOnClick || hasAction) && !isDisabled;
      
      scannedResults.push({
        elementId: buttonId,
        element: htmlEl.tagName.toLowerCase(),
        hasAction,
        hasOnClick,
        isClickable,
        location: htmlEl.closest('[data-page]')?.getAttribute('data-page') || 'unknown',
      });
    });
    
    // Combine with audit log
    const combined = [...scannedResults, ...auditLog];
    const unique = combined.filter((item, index, self) =>
      index === self.findIndex(t => t.elementId === item.elementId)
    );
    
    setResults(unique);
    setIsScanning(false);
  }, []);

  // Apply highlight styles
  useEffect(() => {
    if (!highlightUnbound) return;
    
    const style = document.createElement('style');
    style.id = 'button-audit-highlight';
    style.textContent = `
      button:not([onclick]):not([data-has-action="true"]),
      [role="button"]:not([onclick]):not([data-has-action="true"]) {
        outline: 2px dashed rgba(239, 68, 68, 0.5) !important;
        outline-offset: 2px !important;
      }
      [data-button-status="unmapped"] {
        outline: 2px solid rgba(239, 68, 68, 0.8) !important;
        background: rgba(239, 68, 68, 0.1) !important;
      }
      [data-button-status="mapped"] {
        outline: 2px solid rgba(34, 197, 94, 0.5) !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      const existingStyle = document.getElementById('button-audit-highlight');
      if (existingStyle) existingStyle.remove();
    };
  }, [highlightUnbound]);

  if (!enabled) return null;

  const unboundCount = results.filter(r => !r.isClickable).length;
  const boundCount = results.filter(r => r.isClickable).length;
  const registryCount = Object.keys(ACTION_MAP).length;

  return (
    <>
      {/* Debug Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-4 right-4 z-[9999] w-12 h-12 rounded-full shadow-lg flex items-center justify-center",
          unboundCount > 0 
            ? "bg-red-500 text-white" 
            : "bg-emerald-500 text-white"
        )}
        title="Button Audit Panel"
      >
        <Bug className="w-6 h-6" />
        {unboundCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 text-amber-900 rounded-full text-xs font-bold flex items-center justify-center">
            {unboundCount}
          </span>
        )}
      </motion.button>

      {/* Audit Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-0 right-0 w-96 h-full bg-background border-l border-border shadow-2xl z-[9998] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bug className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Button Audit</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Stats */}
            <div className="p-4 border-b border-border grid grid-cols-3 gap-2">
              <div className="text-center p-2 rounded-lg bg-secondary/50">
                <div className="text-2xl font-bold text-foreground">{registryCount}</div>
                <div className="text-xs text-muted-foreground">Registry</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <div className="text-2xl font-bold text-emerald-400">{boundCount}</div>
                <div className="text-xs text-emerald-400">Bound</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-red-500/10 border border-red-500/30">
                <div className="text-2xl font-bold text-red-400">{unboundCount}</div>
                <div className="text-xs text-red-400">Unbound</div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-b border-border flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={scanForButtons}
                disabled={isScanning}
                className="flex-1"
              >
                <Search className="w-4 h-4 mr-2" />
                {isScanning ? 'Scanning...' : 'Scan DOM'}
              </Button>
              <Button
                variant={highlightUnbound ? "default" : "outline"}
                size="sm"
                onClick={() => setHighlightUnbound(!highlightUnbound)}
                className="flex-1"
              >
                {highlightUnbound ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                Highlight
              </Button>
            </div>

            {/* Results List */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-2">
                {results.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bug className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Click "Scan DOM" to audit buttons</p>
                  </div>
                ) : (
                  results.map((result, index) => (
                    <div
                      key={`${result.elementId}-${index}`}
                      className={cn(
                        "p-3 rounded-lg border",
                        result.isClickable
                          ? "bg-emerald-500/5 border-emerald-500/30"
                          : "bg-red-500/5 border-red-500/30"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <code className="text-xs font-mono text-foreground truncate max-w-[200px]">
                          {result.elementId}
                        </code>
                        {result.isClickable ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 flex-wrap">
                        <Badge variant="secondary" className="text-[10px]">
                          {result.element}
                        </Badge>
                        {result.hasAction && (
                          <Badge className="text-[10px] bg-emerald-500/20 text-emerald-400">
                            registry
                          </Badge>
                        )}
                        {result.hasOnClick && (
                          <Badge className="text-[10px] bg-blue-500/20 text-blue-400">
                            onClick
                          </Badge>
                        )}
                        {!result.isClickable && (
                          <Badge variant="destructive" className="text-[10px]">
                            DEAD
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Footer Warning */}
            {unboundCount > 0 && (
              <div className="p-4 border-t border-red-500/30 bg-red-500/10">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {unboundCount} dead button(s) detected!
                  </span>
                </div>
                <p className="text-xs text-red-400/70 mt-1">
                  Deployment should be blocked until all buttons are bound.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Export the component directly - no forwardRef needed since AnimatePresence doesn't accept refs
export const ButtonAuditOverlay: React.FC<ButtonAuditOverlayProps> = (props) => {
  return <ButtonAuditOverlayInner {...props} />;
};

export default ButtonAuditOverlay;
