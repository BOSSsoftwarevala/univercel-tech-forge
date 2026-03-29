import { useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  description: string;
  action: () => void;
  global?: boolean;
  disabled?: boolean;
}

interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
  showTooltips?: boolean;
}

export function useKeyboardShortcuts({
  shortcuts,
  enabled = true,
  showTooltips = false,
}: UseKeyboardShortcutsOptions) {
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Skip if user is typing in an input
    const target = event.target as HTMLElement;
    const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
                     target.isContentEditable;

    for (const shortcut of shortcutsRef.current) {
      if (shortcut.disabled) continue;
      if (!shortcut.global && isTyping) continue;

      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatch = shortcut.ctrl ? (event.ctrlKey || event.metaKey) : !event.ctrlKey;
      const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
      const altMatch = shortcut.alt ? event.altKey : !event.altKey;
      const metaMatch = shortcut.meta ? event.metaKey : true;

      if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
        event.preventDefault();
        shortcut.action();
        
        if (showTooltips) {
          toast.info(`${shortcut.description}`, { duration: 1500 });
        }
        break;
      }
    }
  }, [enabled, showTooltips]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    shortcuts: shortcutsRef.current,
    getShortcutLabel: (shortcut: KeyboardShortcut) => {
      const parts: string[] = [];
      if (shortcut.ctrl) parts.push('⌘');
      if (shortcut.shift) parts.push('⇧');
      if (shortcut.alt) parts.push('⌥');
      parts.push(shortcut.key.toUpperCase());
      return parts.join('');
    },
  };
}

// Predefined enterprise shortcuts
export function useEnterpriseShortcuts(handlers: {
  onSearch?: () => void;
  onNew?: () => void;
  onSave?: () => void;
  onRefresh?: () => void;
  onExport?: () => void;
  onHelp?: () => void;
  onSettings?: () => void;
  onNotifications?: () => void;
  onEscape?: () => void;
}) {
  const shortcuts: KeyboardShortcut[] = [];

  if (handlers.onSearch) shortcuts.push({ key: 'k', ctrl: true, description: 'Open search', action: handlers.onSearch, global: true });
  if (handlers.onNew) shortcuts.push({ key: 'n', ctrl: true, description: 'Create new', action: handlers.onNew });
  if (handlers.onSave) shortcuts.push({ key: 's', ctrl: true, description: 'Save', action: handlers.onSave, global: true });
  if (handlers.onRefresh) shortcuts.push({ key: 'r', ctrl: true, shift: true, description: 'Refresh data', action: handlers.onRefresh, global: true });
  if (handlers.onExport) shortcuts.push({ key: 'e', ctrl: true, description: 'Export data', action: handlers.onExport });
  if (handlers.onHelp) shortcuts.push({ key: '/', ctrl: true, description: 'Show help', action: handlers.onHelp, global: true });
  if (handlers.onSettings) shortcuts.push({ key: ',', ctrl: true, description: 'Open settings', action: handlers.onSettings, global: true });
  if (handlers.onNotifications) shortcuts.push({ key: '.', ctrl: true, description: 'Toggle notifications', action: handlers.onNotifications, global: true });
  if (handlers.onEscape) shortcuts.push({ key: 'Escape', description: 'Close / Cancel', action: handlers.onEscape, global: true });

  return useKeyboardShortcuts({ shortcuts });
}

// Keyboard shortcuts help dialog data
export const ENTERPRISE_SHORTCUTS_HELP = [
  { category: 'Navigation', shortcuts: [
    { keys: '⌘K', description: 'Open global search' },
    { keys: '⌘,', description: 'Open settings' },
    { keys: '⌘.', description: 'Toggle notifications' },
    { keys: 'Esc', description: 'Close modal / cancel' },
  ]},
  { category: 'Actions', shortcuts: [
    { keys: '⌘N', description: 'Create new item' },
    { keys: '⌘S', description: 'Save changes' },
    { keys: '⌘E', description: 'Export data' },
    { keys: '⌘⇧R', description: 'Refresh data' },
  ]},
  { category: 'Selection', shortcuts: [
    { keys: '⌘A', description: 'Select all' },
    { keys: '⌘⇧A', description: 'Deselect all' },
    { keys: 'Space', description: 'Toggle selection' },
  ]},
  { category: 'Help', shortcuts: [
    { keys: '⌘/', description: 'Show keyboard shortcuts' },
    { keys: '?', description: 'Open help center' },
  ]},
];

export default useKeyboardShortcuts;
