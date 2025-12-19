/**
 * Draft Manager
 * Saves form drafts locally for offline editing
 */

import { indexedDB } from './indexed-db';

interface Draft {
  id: string;
  type: string;
  data: Record<string, unknown>;
  updated_at: number;
  created_at: number;
}

class DraftManager {
  private generateId(type: string, identifier?: string): string {
    return identifier ? `${type}:${identifier}` : `${type}:${Date.now()}`;
  }

  async save(
    type: string,
    data: Record<string, unknown>,
    identifier?: string
  ): Promise<string> {
    const id = this.generateId(type, identifier);
    const now = Date.now();

    const existing = await this.get(type, identifier);
    
    const draft: Draft = {
      id,
      type,
      data,
      updated_at: now,
      created_at: existing?.created_at || now
    };

    await indexedDB.set('drafts', draft);
    return id;
  }

  async get(type: string, identifier?: string): Promise<Draft | null> {
    const id = this.generateId(type, identifier);
    return indexedDB.get<Draft>('drafts', id);
  }

  async getByType(type: string): Promise<Draft[]> {
    return indexedDB.getAllByIndex<Draft>('drafts', 'type', type);
  }

  async getAll(): Promise<Draft[]> {
    return indexedDB.getAll<Draft>('drafts');
  }

  async delete(type: string, identifier?: string): Promise<void> {
    const id = this.generateId(type, identifier);
    await indexedDB.delete('drafts', id);
  }

  async clearType(type: string): Promise<void> {
    const drafts = await this.getByType(type);
    await Promise.all(drafts.map(d => indexedDB.delete('drafts', d.id)));
  }

  async clearAll(): Promise<void> {
    await indexedDB.clear('drafts');
  }

  // Auto-save hook for forms
  createAutoSave(
    type: string,
    identifier?: string,
    debounceMs = 1000
  ): {
    save: (data: Record<string, unknown>) => void;
    load: () => Promise<Record<string, unknown> | null>;
    clear: () => Promise<void>;
  } {
    let timeoutId: number | null = null;

    return {
      save: (data: Record<string, unknown>) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
          this.save(type, data, identifier);
        }, debounceMs);
      },
      load: async () => {
        const draft = await this.get(type, identifier);
        return draft?.data || null;
      },
      clear: async () => {
        if (timeoutId) clearTimeout(timeoutId);
        await this.delete(type, identifier);
      }
    };
  }
}

export const draftManager = new DraftManager();
