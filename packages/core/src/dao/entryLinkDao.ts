import { getDb } from '../database.js';
import type { EntryLink } from '../types.js';

export const entryLinkDao = {
  create(fromEntryId: string, toEntryId: string, linkType = ''): EntryLink {
    const id = crypto.randomUUID();
    getDb().prepare(`
      INSERT INTO entry_links (id, from_entry_id, to_entry_id, link_type, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, fromEntryId, toEntryId, linkType, new Date().toISOString());
    return this.getById(id)!;
  },

  getById(id: string): EntryLink | undefined {
    return getDb().prepare('SELECT * FROM entry_links WHERE id = ?').get(id) as EntryLink | undefined;
  },

  getByEntry(entryId: string): EntryLink[] {
    return getDb().prepare(
      'SELECT * FROM entry_links WHERE from_entry_id = ? OR to_entry_id = ? ORDER BY created_at DESC'
    ).all(entryId, entryId) as EntryLink[];
  },

  delete(id: string): void {
    getDb().prepare('DELETE FROM entry_links WHERE id = ?').run(id);
  },
};
