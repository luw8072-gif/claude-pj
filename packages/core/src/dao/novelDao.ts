import { getDb } from '../database.js';
import type { Novel } from '../types.js';

export const novelDao = {
  create(title: string): Novel {
    const db = getDb();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO novels (id, title, author, description, settings, created_at, updated_at)
      VALUES (?, ?, '', '', '{}', ?, ?)
    `).run(id, title, now, now);
    return this.getById(id)!;
  },

  getAll(): Novel[] {
    return getDb().prepare('SELECT * FROM novels ORDER BY updated_at DESC').all() as Novel[];
  },

  getById(id: string): Novel | undefined {
    return getDb().prepare('SELECT * FROM novels WHERE id = ?').get(id) as Novel | undefined;
  },

  update(id: string, data: Partial<Novel>): void {
    const fields: string[] = [];
    const values: unknown[] = [];
    for (const [key, value] of Object.entries(data)) {
      if (key === 'id') continue;
      if (key === 'settings' && typeof value === 'object') {
        fields.push('settings = ?');
        values.push(JSON.stringify(value));
      } else {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    fields.push("updated_at = ?");
    values.push(new Date().toISOString());
    values.push(id);
    getDb().prepare(`UPDATE novels SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  },

  delete(id: string): void {
    getDb().prepare('DELETE FROM novels WHERE id = ?').run(id);
  },
};
