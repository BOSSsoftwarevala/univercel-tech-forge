/**
 * Hardened Chat Engine - Enterprise Security
 * - Masked IDs only, no real identity leakage
 * - Permanent logs (no delete/edit)
 * - Screenshot prevention
 * - Translation-safe masking
 */

import { supabase } from '@/integrations/supabase/client';
import { callEdgeRoute } from '@/lib/api/edge-client';
import { createMaskedUser, maskSensitiveData } from './masking';
import { generateMaskedId, AppRole, MASKED_ID_CONFIG } from './rbac';

// Re-export for convenience
export const MASKING_CONFIG = MASKED_ID_CONFIG;

// Chat message structure with security fields
export interface SecureChatMessage {
  id: string;
  threadId: string;
  maskedSenderId: string;
  roleIcon: string;
  message: string;
  originalLanguage: string;
  translatedText?: string;
  timestamp: string;
  // Security flags - always false for immutability
  canEdit: false;
  canDelete: false;
  isSystemMessage: boolean;
}

export interface ChatThread {
  id: string;
  createdBy: string;
  relatedLeadId?: string;
  relatedTaskId?: string;
  relatedRole?: AppRole;
  isActive: boolean;
  createdAt: string;
}

// Prevent copy/screenshot using CSS and JS
export const applyChatSecurity = (): (() => void) => {
  // Disable text selection on chat messages
  const style = document.createElement('style');
  style.id = 'chat-security-styles';
  style.textContent = `
    .secure-chat-message {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
    }
    .secure-chat-message * {
      -webkit-user-select: none !important;
      user-select: none !important;
    }
  `;
  document.head.appendChild(style);

  // Block common copy shortcuts
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C' || e.key === 'p' || e.key === 'P' || e.key === 's' || e.key === 'S')) {
      const selection = window.getSelection();
      const chatElement = document.querySelector('.secure-chat-container');
      if (chatElement && selection && chatElement.contains(selection.anchorNode)) {
        e.preventDefault();
        console.warn('[Security] Copy/print blocked in secure chat');
      }
    }
  };

  // Block context menu in chat
  const handleContextMenu = (e: MouseEvent) => {
    const chatElement = document.querySelector('.secure-chat-container');
    if (chatElement && chatElement.contains(e.target as Node)) {
      e.preventDefault();
    }
  };

  // Block print screen
  const handlePrintScreen = (e: KeyboardEvent) => {
    if (e.key === 'PrintScreen') {
      // Clear clipboard after printscreen
      navigator.clipboard.writeText('');
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('contextmenu', handleContextMenu);
  document.addEventListener('keyup', handlePrintScreen);

  // Cleanup function
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('contextmenu', handleContextMenu);
    document.removeEventListener('keyup', handlePrintScreen);
    const styleEl = document.getElementById('chat-security-styles');
    if (styleEl) styleEl.remove();
  };
};

// Generate masked sender ID for chat
export const generateChatMaskedId = (
  userId: string,
  role: AppRole,
  countryCode?: string
): string => {
  const { maskedId } = generateMaskedId(role, userId);
  return maskedId;
};

// Send a message with full security
export const sendSecureMessage = async (
  threadId: string,
  messageText: string,
  senderRole: AppRole,
  language: string = 'en'
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  try {
    // Sanitize message text - remove potential XSS
    const sanitizedText = messageText
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .trim();

    if (!sanitizedText) {
      return { success: false, error: 'Message cannot be empty' };
    }

    // Check for sensitive data leakage
    if (containsSensitiveData(sanitizedText)) {
      return { 
        success: false, 
        error: 'Message may contain sensitive information. Please remove personal details.' 
      };
    }

    const response = await callEdgeRoute<{ message_id: string }>('api-chat', 'send', {
      method: 'POST',
      body: {
        thread_id: threadId,
        message_text: sanitizedText,
        language,
      },
      module: 'chat',
    });

    return { success: true, messageId: response.data?.message_id };
  } catch (err) {
    return { success: false, error: 'Failed to send message' };
  }
};

// Check if message contains sensitive data
const containsSensitiveData = (text: string): boolean => {
  const patterns = {
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
    phone: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
    creditCard: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/,
    ssn: /\b\d{3}[-]?\d{2}[-]?\d{4}\b/,
    aadhar: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/,
    pan: /[A-Z]{5}\d{4}[A-Z]/,
  };

  for (const pattern of Object.values(patterns)) {
    if (pattern.test(text)) {
      return true;
    }
  }
  return false;
};

// Fetch thread messages with masked IDs
export const fetchThreadMessages = async (
  threadId: string
): Promise<SecureChatMessage[]> => {
  try {
    const response = await callEdgeRoute<{
      messages: Array<{
        id: string;
        sender: string;
        role_icon?: string;
        text: string;
        language?: string;
        translated?: string;
        timestamp: string;
        is_system?: boolean;
      }>;
    }>('api-chat', 'thread', {
      query: { thread_id: threadId },
      module: 'chat',
    });

    if (!response.data?.messages) {
      return [];
    }

    return response.data.messages.map((msg: any) => ({
      id: msg.id,
      threadId,
      maskedSenderId: msg.sender, // Already masked from backend
      roleIcon: msg.role_icon || '👤',
      message: msg.text,
      originalLanguage: msg.language || 'en',
      translatedText: msg.translated,
      timestamp: msg.timestamp,
      canEdit: false,
      canDelete: false,
      isSystemMessage: msg.is_system || false,
    }));
  } catch {
    return [];
  }
};

// Create new chat thread
export const createChatThread = async (
  relatedLeadId?: string,
  relatedTaskId?: string,
  relatedRole?: AppRole
): Promise<{ success: boolean; threadId?: string; error?: string }> => {
  try {
    const response = await callEdgeRoute<{ thread_id: string }>('api-chat', 'thread/create', {
      method: 'POST',
      body: {
        lead_id: relatedLeadId,
        task_id: relatedTaskId,
        role: relatedRole,
      },
      module: 'chat',
    });

    return { success: true, threadId: response.data?.thread_id };
  } catch {
    return { success: false, error: 'Failed to create thread' };
  }
};

// Log chat security event for audit
export const logChatSecurityEvent = async (
  eventType: 'copy_attempt' | 'screenshot_attempt' | 'inspect_attempt' | 'sensitive_data_detected',
  details: Record<string, any>
): Promise<void> => {
  try {
    await supabase.from('audit_logs').insert({
      action: `chat_security_${eventType}`,
      module: 'internal_chat',
      meta_json: {
        ...details,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      },
    });
  } catch (error) {
    console.error('Failed to log chat security event:', error);
  }
};

// Export constants for chat UI
export const CHAT_SECURITY_CONFIG = {
  maxMessageLength: 2000,
  allowedFileTypes: [], // No file uploads in secure chat
  screenshotBlocking: true,
  copyBlocking: true,
  permanentLogs: true,
  editDisabled: true,
  deleteDisabled: true,
} as const;
