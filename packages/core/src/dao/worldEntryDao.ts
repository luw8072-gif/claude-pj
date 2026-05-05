import { getDb } from '../database.js';
import type { WorldEntry } from '../types.js';

export const worldEntryDao = {
  create(novelId: string, name: string, category = ''): WorldEntry {
    const db = getDb();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const maxOrder = db.prepare(
      'SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM world_entries WHERE novel_id = ?'
    ).get(novelId) as { next: number };
    db.prepare(`
      INSERT INTO world_entries (id, novel_id, name, category, content, sort_order, created_at, updated_at)
      VALUES (?, ?, ?, ?, '', ?, ?, ?)
    `).run(id, novelId, name, category, maxOrder.next, now, now);
    return this.getById(id)!;
  },

  getByNovel(novelId: string): WorldEntry[] {
    return getDb().prepare(
      'SELECT * FROM world_entries WHERE novel_id = ? ORDER BY sort_order ASC'
    ).all(novelId) as WorldEntry[];
  },

  getByCategory(novelId: string, category: string): WorldEntry[] {
    return getDb().prepare(
      'SELECT * FROM world_entries WHERE novel_id = ? AND category = ? ORDER BY sort_order ASC'
    ).all(novelId, category) as WorldEntry[];
  },

  getById(id: string): WorldEntry | undefined {
    return getDb().prepare('SELECT * FROM world_entries WHERE id = ?').get(id) as WorldEntry | undefined;
  },

  update(id: string, data: Partial<WorldEntry>): void {
    const fields = Object.keys(data)
      .filter(k => k !== 'id' && k !== 'novel_id')
      .map(k => `${k} = ?`);
    const values = Object.entries(data)
      .filter(([k]) => k !== 'id' && k !== 'novel_id')
      .map(([, v]) => v);
    if (fields.length === 0) return;
    fields.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);
    getDb().prepare(`UPDATE world_entries SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  },

  delete(id: string): void {
    getDb().prepare('DELETE FROM world_entries WHERE id = ?').run(id);
  },

  reorder(ids: string[]): void {
    const stmt = getDb().prepare('UPDATE world_entries SET sort_order = ? WHERE id = ?');
    getDb().transaction(() => {
      ids.forEach((id, index) => stmt.run(index, id));
    })();
  },
};
