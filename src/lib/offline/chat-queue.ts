/**
 * Chat Queue Manager
 * Handles offline chat message queuing and delivery
 */

import { indexedDB } from './indexed-db';
import { networkDetector } from '../network/network-detector';

interface QueuedMessage {
  id: string;
  thread_id: string;
  message_text: string;
  sender_id: string;
  timestamp: number;
  status: 'pending' | 'sending' | 'sent' | 'failed';
  retries: number;
}

type MessageCallback = (message: QueuedMessage) => void;

class ChatQueueManager {
  private callbacks: Set<MessageCallback> = new Set();
  private processing = false;

  private generateId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async queueMessage(
    threadId: string,
    messageText: string,
    senderId: string
  ): Promise<string> {
    const message: QueuedMessage = {
      id: this.generateId(),
      thread_id: threadId,
      message_text: messageText,
      sender_id: senderId,
      timestamp: Date.now(),
      status: 'pending',
      retries: 0
    };

    await indexedDB.set('chat_queue', message);
    this.notifyCallbacks(message);

    // Try to send immediately if online
    if (networkDetector.getInfo().isOnline) {
      this.processQueue();
    }

    return message.id;
  }

  async getQueuedMessages(threadId?: string): Promise<QueuedMessage[]> {
    if (threadId) {
      return indexedDB.getAllByIndex<QueuedMessage>('chat_queue', 'thread_id', threadId);
    }
    return indexedDB.getAll<QueuedMessage>('chat_queue');
  }

  async getPendingCount(): Promise<number> {
    const messages = await indexedDB.getAll<QueuedMessage>('chat_queue');
    return messages.filter(m => m.status === 'pending' || m.status === 'sending').length;
  }

  async processQueue(): Promise<void> {
    if (this.processing || !networkDetector.getInfo().isOnline) return;
    
    this.processing = true;

    try {
      const messages = await indexedDB.getAll<QueuedMessage>('chat_queue');
      const pending = messages
        .filter(m => m.status === 'pending')
        .sort((a, b) => a.timestamp - b.timestamp);

      for (const message of pending) {
        if (!networkDetector.getInfo().isOnline) break;

        message.status = 'sending';
        await indexedDB.set('chat_queue', message);
        this.notifyCallbacks(message);

        const success = await this.sendMessage(message);

        if (success) {
          message.status = 'sent';
          // Remove from queue after successful send
          await indexedDB.delete('chat_queue', message.id);
        } else {
          message.retries++;
          message.status = message.retries >= 3 ? 'failed' : 'pending';
          await indexedDB.set('chat_queue', message);
        }

        this.notifyCallbacks(message);

        // Rate limit for slow networks
        const networkInfo = networkDetector.getInfo();
        if (networkInfo.quality === '2g') {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    } finally {
      this.processing = false;
    }
  }

  private async sendMessage(message: QueuedMessage): Promise<boolean> {
    try {
      // This would integrate with your actual chat API
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          thread_id: message.thread_id,
          message_text: message.message_text,
          sender_id: message.sender_id,
          client_id: message.id
        })
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  async retryFailed(): Promise<void> {
    const messages = await indexedDB.getAll<QueuedMessage>('chat_queue');
    const failed = messages.filter(m => m.status === 'failed');

    for (const message of failed) {
      message.status = 'pending';
      message.retries = 0;
      await indexedDB.set('chat_queue', message);
    }

    this.processQueue();
  }

  async clearQueue(): Promise<void> {
    await indexedDB.clear('chat_queue');
  }

  onMessageUpdate(callback: MessageCallback): () => void {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  private notifyCallbacks(message: QueuedMessage): void {
    this.callbacks.forEach(cb => cb(message));
  }
}

export const chatQueue = new ChatQueueManager();
