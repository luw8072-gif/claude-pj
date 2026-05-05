import { getDb } from '../database.js';
import type { Volume } from '../types.js';

export const volumeDao = {
  create(novelId: string, title: string): Volume {
    const db = getDb();
    const id = crypto.randomUUID();
    const maxOrder = db.prepare(
      'SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM volumes WHERE novel_id = ?'
    ).get(novelId) as { next: number };
    db.prepare(`
      INSERT INTO volumes (id, novel_id, title, sort_order, summary)
      VALUES (?, ?, ?, ?, '')
    `).run(id, novelId, title, maxOrder.next);
    return this.getById(id)!;
  },

  getByNovel(novelId: string): Volume[] {
    return getDb().prepare(
      'SELECT * FROM volumes WHERE novel_id = ? ORDER BY sort_order ASC'
    ).all(novelId) as Volume[];
  },

  getById(id: string): Volume | undefined {
    return getDb().prepare('SELECT * FROM volumes WHERE id = ?').get(id) as Volume | undefined;
  },

  update(id: string, data: Partial<Volume>): void {
    const fields = Object.keys(data)
      .filter(k => k !== 'id' && k !== 'novel_id')
      .map(k => `${k} = ?`);
    const values = Object.entries(data)
      .filter(([k]) => k !== 'id' && k !== 'novel_id')
      .map(([, v]) => v);
    if (fields.length === 0) return;
    getDb().prepare(`UPDATE volumes SET ${fields.join(', ')} WHERE id = ?`).run(...values, id);
  },

  delete(id: string): void {
    getDb().prepare('DELETE FROM volumes WHERE id = ?').run(id);
  },

  reorder(ids: string[]): void {
    const db = getDb();
    const stmt = db.prepare('UPDATE volumes SET sort_order = ? WHERE id = ?');
    const tx = db.transaction(() => {
      ids.forEach((id, index) => stmt.run(index, id));
    });
    tx();
  },
};
